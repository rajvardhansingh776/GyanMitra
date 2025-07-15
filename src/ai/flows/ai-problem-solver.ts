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
});
export type AiProblemSolverInput = z.infer<typeof AiProblemSolverInputSchema>;

const AiProblemSolverOutputSchema = z.object({
  solution: z.string().describe('The AI-generated solution to the problem.'),
  difficultyLevel: z
    .string()
    .describe(
      'The difficulty level of the solution, adjusted based on engagement and past performance.'
    ),
  explanation: z
    .string()
    .describe(
      'An explanation of how the AI arrived at the provided solution, suitable for the student.'
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
  prompt: `You are an AI assistant helping a student with their homework.

The student is asking for help with the following question: {{{question}}}

Based on the student's engagement level ({{{engagementLevel}}}) and past performance ({{{pastPerformance}}}), adjust the difficulty of your solution.

Provide a solution, indicate the difficulty level, and explain your reasoning in a way that the student can understand.

Consider the following:
- If the student has a low engagement level or poor past performance, provide a simpler solution with a more detailed explanation.
- If the student has a high engagement level and excellent past performance, provide a more challenging solution with a less detailed explanation.
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
