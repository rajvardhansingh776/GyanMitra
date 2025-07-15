'use server';

/**
 * @fileOverview An AI problem solver that adjusts difficulty based on student engagement and past performance.
 *
 * - aiProblemSolver - A function that provides AI-driven problem-solving assistance.
 * - AiProblemSolverInput - The input type for the aiProblemSolver function.
 * - AiProblemSolverOutput - The return type for the aiProblemSolver function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const AiProblemSolverInputSchema = z.object({
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
export type AiProblemSolverInput = z.infer<typeof AiProblemSolverInputSchema>;

const AiProblemSolverOutputSchema = z.object({
  solution: z.string().describe('The AI-generated solution to the problem. This should be formatted using Markdown.'),
  difficultyLevel: z
    .string()
    .optional()
    .describe(
      'The difficulty level of the solution, adjusted based on engagement and past performance. Only provided for the first question.'
    ),
  explanation: z
    .string()
    .optional()
    .describe(
      'A direct, step-by-step explanation of how the AI arrived at the solution. This should only be provided for initial problem-solving questions. This should be formatted using Markdown.'
    ),
});
export type AiProblemSolverOutput = z.infer<typeof AiProblemSolverOutputSchema>;

export async function aiProblemSolver(
  input: AiProblemSolverInput
): Promise<AiProblemSolverOutput> {
  return aiProblemSolverFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiProblemSolverPrompt',
  input: {schema: AiProblemSolverInputSchema},
  output: {schema: AiProblemSolverOutputSchema},
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
1.  **Analyze the Question Type**: First, determine if the question is a factual query (e.g., "What is photosynthesis?"), a problem-solving question (e.g., "Solve for x in 2x+5=15"), or a follow-up question related to the history.
2.  **Formatting**: Format your response using Markdown. Use code blocks for any code snippets, math equations, or commands. Use lists for steps.
3.  **Solution**: Provide a direct, accurate answer to the question.
    - For the **first question** in a conversation (when history is empty), provide a comprehensive solution.
    - For **follow-up questions**, be conversational and concise. Directly address the user's latest question in the context of the history. Do not repeat the full solution.
4.  **Explanation**:
    -   If the question is a **factual query**, DO NOT provide an explanation.
    -   If it's the **first problem-solving question**, provide a step-by-step breakdown.
        -   For a student with **low engagement/performance**, the explanation should be more foundational.
        -   For a student with **high engagement/performance**, the explanation can be more succinct.
    -   For **follow-up questions**, DO NOT provide a separate explanation field. Integrate any necessary clarification into the conversational `solution` text. The `explanation` field must be omitted for follow-ups.
5.  **Difficulty Level**:
    - Assess the complexity of your own solution (e.g., "Beginner", "Intermediate", "Advanced") and provide it ONLY for the **first question** in a conversation. Omit it for all follow-up questions.

Your response must be structured to directly match the output schema.
`,
});

const aiProblemSolverFlow = ai.defineFlow(
  {
    name: 'aiProblemSolverFlow',
    inputSchema: AiProblemSolverInputSchema,
    outputSchema: AiProblemSolverOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
