// src/app/api/chat/route.ts
import { gyanmitraAi } from '@/ai/flows/gyanmitra-ai';
import { NextRequest } from 'next/server';
import { ai } from '@/ai/genkit';

export async function POST(req: NextRequest) {
  const { question, engagementLevel, pastPerformance, history } = await req.json();

  const stream = await gyanmitraAi({
    question,
    engagementLevel,
    pastPerformance,
    history,
  });

  // The stream from Genkit is directly compatible with the Response constructor.
  return new Response(stream);
}
