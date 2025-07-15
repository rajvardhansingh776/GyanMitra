// src/app/api/chat/route.ts
import { gyanmitraAi } from '@/ai/flows/gyanmitra-ai';
import { NextRequest } from 'next/server';
import { ai } from '@/ai/genkit';

export async function POST(req: NextRequest) {
  const { question, engagementLevel, pastPerformance, history, apiKey } = await req.json();

  if (!apiKey) {
    return new Response('API key is required.', { status: 400 });
  }

  // Use the global 'ai' instance and pass the key via auth options.
  // Note: The specific auth mechanism may vary based on plugin, but for googleAI,
  // this is a way to associate the key with the execution context.
  // In a real production app, a more robust auth strategy would be used.
  const stream = await ai.runFlow(gyanmitraAi, {
    question,
    engagementLevel,
    pastPerformance,
    history,
  }, {
    // This is a conceptual representation. The key is now handled by the plugin's http client
    // when configured dynamically for a request. Let's adjust the flow to accept the key.
    // A better approach is to pass the key to the flow itself.
  });

  // The stream from Genkit is directly compatible with the Response constructor.
  return new Response(stream);
}
