// src/app/api/chat/route.ts
import { gyanmitraAiStream } from '@/ai/flows/gyanmitra-ai';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { question, engagement, performance, history } = await req.json();

  const stream = await gyanmitraAiStream({
    question,
    engagementLevel: engagement,
    pastPerformance: performance,
    history,
  });

  // Pipe the raw stream from Genkit to the response
  return new Response(stream.pipeThrough(new TextEncoderStream()));
}
