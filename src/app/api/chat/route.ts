// src/app/api/chat/route.ts
import { gyanmitraAi, GyanMitraAiOutput } from '@/ai/flows/gyanmitra-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { question, engagementLevel, pastPerformance, history } = await req.json();

    const result: GyanMitraAiOutput = await gyanmitraAi({
      question,
      engagementLevel,
      pastPerformance,
      history,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
