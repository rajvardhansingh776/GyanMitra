'use server';

/**
 * @fileOverview An AI problem solver that adjusts difficulty based on student engagement and past performance.
 *
 * - gyanmitraAi - A function that provides AI-driven problem-solving assistance as a stream.
 * - GyanMitraAiInput - The input type for the gyanmitraAi function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';
import { z } from 'genkit/zod';


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
  apiKey: z.string().optional().describe("The user's Google AI API Key.")
});
export type GyanMitraAiInput = z.infer<typeof GyanMitraAiInputSchema>;


export async function gyanmitraAi(input: GyanMitraAiInput) {
  return gyanmitraAiFlow(input);
}


const gyanmitraAiFlow = ai.defineFlow(
  {
    name: 'gyanmitraAiFlow',
    inputSchema: GyanMitraAiInputSchema,
    outputSchema: z.string(),
    stream: true,
  },
  async (input) => {
    // Dynamically configure a new Genkit instance with the provided API key
    const dynamicAi = genkit({
      plugins: [googleAI(input.apiKey ? { apiKey: input.apiKey } : {})],
      model: 'googleai/gemini-1.5-flash',
    });

    const { stream } = await dynamicAi.generate({
      prompt: `You are an expert AI tutor. Your goal is to provide clear, direct, and engaging solutions to student questions. You are in a conversation with a student.
    
    Analyze the student's profile:
    - Engagement Level: {{{engagementLevel}}} (0=low, 1=high)
    - Past Performance: {{{pastPerformance}}} (0=poor, 1=excellent)
    
    {{#if history}}
    This is the conversation history:
    {{#each history}}
      **{{role}}**: {{{content}}}
    {{/each}}
    {{/if}}
    
    The student's latest question is: {{{question}}}
    
    RULES:
    1.  **Analyze the Question Type**: First, determine if this is a factual query (e.g., "What is photosynthesis?"), a problem-solving question (e.g., "Solve for x in 2x+5=15"), or a follow-up question related to the history.
    2.  **Formatting**: Format your entire response using Markdown. Use code blocks for any code snippets, math equations, or commands. Use lists for steps.
    3.  **Solution**: Provide a direct, accurate answer to the question.
        - For the **first question** in a conversation (when history is empty), provide a comprehensive solution that includes a step-by-step explanation.
        - For **follow-up questions**, be conversational and concise. Directly address the user's latest question in the context of the history. Do not repeat the full solution.
    4. **Difficulty**:
        - For a student with **low engagement/performance**, the explanation should be more foundational.
        - For a student with **high engagement/performance**, the explanation can be more succinct.
    
    Your response MUST be only the markdown text of the answer. Do not wrap it in JSON.
    `,
      history: input.history?.map(m => ({...m, role: m.role === 'assistant' ? 'model' : 'user'})) || [],
      data: input,
      stream: true,
    });
      
    const outputStream = new ReadableStream({
      async start(controller) {
          for await (const chunk of stream) {
              if (chunk.text) {
                  controller.enqueue(chunk.text);
              }
          }
          controller.close();
      }
    });
    
    return outputStream;
  }
);
