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
      'A direct, step-by-step explanation of how the AI arrived at the solution.'
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
  prompt: `You are an expert AI tutor. Your goal is to provide clear, direct, and engaging solutions to student questions.

A student asks: {{{question}}}

Analyze the student's profile:
- Engagement Level: {{{engagementLevel}}} (0=low, 1=high)
- Past Performance: {{{pastPerformance}}} (0=poor, 1=excellent)

Based on this profile, generate a response.

RULES:
1.  **Solution**: Provide a direct, accurate answer to the question. Do not add conversational fluff or introductory phrases.
2.  **Difficulty Level**: Assess the complexity of your own solution (e.g., "Beginner", "Intermediate", "Advanced").
3.  **Explanation**: Give a step-by-step breakdown of how you reached the solution. Be concise and clear.
    -   For a student with **low engagement/performance**, the explanation should be more foundational and detailed.
    -   For a student with **high engagement/performance**, the explanation can be more advanced and succinct, focusing on key concepts.

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
