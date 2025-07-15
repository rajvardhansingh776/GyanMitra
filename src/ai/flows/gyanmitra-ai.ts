'use server';

/**
 * @fileOverview An AI problem solver that adjusts difficulty based on student engagement and past performance.
 *
 * - gyanmitraAi - A function that provides AI-driven problem-solving assistance.
 * - GyanMitraAiInput - The input type for the gyanmitraAi function.
 * - GyanMitraAiOutput - The return type for the gyanmitraAi function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';


const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const GyanMitraAiInputSchema = z.object({
  question: z.string().describe('The question the student needs help with.'),
  engagementLevel: z
    .number()
    .describe(
      'The student engagement level, on a scale of 0 to 1, where 0 is not engaged and 1 is fully engaged.'
    ),
  pastPerformance: z
    .number()
    .describe(
      'The students past performance, on a scale of 0 to 1, where 0 is poor performance and 1 is excellent performance.'
    ),
  history: z
    .array(MessageSchema)
    .optional()
    .describe('The conversation history.'),
});
export type GyanMitraAiInput = z.infer<typeof GyanMitraAiInputSchema>;

export type GyanMitraAiOutput = z.infer<typeof GyanMitraAiOutputSchema>;
const GyanMitraAiOutputSchema = z.object({
    response: z.string().describe('The markdown-formatted response to the student.'),
});


export async function gyanmitraAi(input: GyanMitraAiInput) {
  const flow = await ai.runFlow(gyanmitraAiFlow, input);
  return flow;
}

const gyanmitraAiFlow = ai.defineFlow(
  {
    name: 'gyanmitraAiFlow',
    inputSchema: GyanMitraAiInputSchema,
    outputSchema: z.string(),
    stream: true,
  },
  async (input) => {
    const prompt = `You are an expert AI tutor. Your goal is to provide clear, direct, and engaging solutions to student questions. You are in a conversation with a student.
    
    Analyze the student's profile:
    - Engagement Level: ${input.engagementLevel} (0=low, 1=high)
    - Past Performance: ${input.pastPerformance} (0=poor, 1=excellent)
    
    ${
      input.history
        ? `This is the conversation history:\n${input.history
            .map((m) => `**${m.role}**: ${m.content}`)
            .join('\n')}`
        : ''
    }
    
    The student's latest question is: ${input.question}
    
    RULES:
    1.  **Analyze the Question Type**: First, determine if this is a factual query (e.g., "What is photosynthesis?"), a problem-solving question (e.g., "Solve for x in 2x+5=15"), or a follow-up question related to the history.
    2.  **Formatting**: Format your entire response using Markdown. Use code blocks for any code snippets, math equations, or commands. Use lists for steps.
    3.  **Solution**: Provide a direct, accurate answer to the question.
        - For the **first question** in a conversation (when history is empty), provide a comprehensive solution that includes a step-by-step explanation.
        - For **follow-up questions**, be conversational and concise. Directly address the user's latest question in the context of the history. Do not repeat the full solution.
    4. **Difficulty**:
        - For a student with **low engagement/performance**, the explanation should be more foundational.
        - For a student with **high engagement/performance**, the explanation can be more succinct.
    
    Your response MUST be only the markdown text of the answer.
    `;

    const { stream, response } = ai.generateStream({
      prompt: prompt,
      history: input.history?.map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        content: h.content,
      })),
    });

    return stream;
  }
);
