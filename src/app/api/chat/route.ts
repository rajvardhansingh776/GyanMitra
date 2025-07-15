// src/app/api/chat/route.ts
import { gyanmitraAi } from '@/ai/flows/gyanmitra-ai';
import { NextRequest } from 'next/server';
import {googleAI} from '@genkit-ai/googleai';
import {genkit} from 'genkit';

export async function POST(req: NextRequest) {
  const { question, engagementLevel, pastPerformance, history, apiKey } = await req.json();

  // Conditionally configure Genkit based on whether an API key is provided in the request.
  // If no key is provided, it will fall back to the environment variable.
  const ai = genkit({
    plugins: [googleAI(apiKey ? {apiKey} : undefined)],
    model: 'googleai/gemini-1.5-flash',
  });

  const stream = await ai.runFlow(gyanmitraAi, {
    question,
    engagementLevel,
    pastPerformance,
    history,
  });

  // The stream from Genkit is directly compatible with the Response constructor.
  return new Response(stream);
}
