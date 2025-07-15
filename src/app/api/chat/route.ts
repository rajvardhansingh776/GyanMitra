// src/app/api/chat/route.ts
import { gyanmitraAi } from '@/ai/flows/gyanmitra-ai';
import { NextRequest } from 'next/server';
import {googleAI} from '@genkit-ai/googleai';

export async function POST(req: NextRequest) {
  const { question, engagement, performance, history, apiKey } = await req.json();

  const config = apiKey ? {plugins: [googleAI({apiKey})]} : undefined;

  const stream = await gyanmitraAi({
    question,
    engagementLevel: engagement,
    pastPerformance: performance,
    history,
  }, {config});

  // The stream from Genkit is directly compatible with the Response constructor.
  return new Response(stream);
}
