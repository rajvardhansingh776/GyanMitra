// src/app/api/chat/route.ts
// import { gyanmitraAi } from '@/ai/flows/gyanmitra-ai';
// import { NextRequest, NextResponse } from 'next/server';
// import { StreamToTextResponse } from '@genkit-ai/next/streaming';

// export async function POST(req: NextRequest) {
//   try {
//     const { question, engagementLevel, pastPerformance, history } = await req.json();

//     const stream = await gyanmitraAi({
//       question,
//       engagementLevel,
//       pastPerformance,
//       history,
//     });

//     return new StreamToTextResponse(stream);

//   } catch (error: any) {
//     console.error('Error in chat API route:', error);
//     return NextResponse.json(
//       { error: error.message || 'An unexpected error occurred.' },
//       { status: 500 }
//     );
//   }
// }
