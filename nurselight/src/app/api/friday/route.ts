import OpenAI from "openai";
import { FRIDAY_SYSTEM_PROMPT } from "@/lib/friday-prompt";

export const dynamic = "force-dynamic";

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  const openai = getClient();

  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    stream: true,
    temperature: 0.85,
    max_tokens: 600,
    messages: [
      { role: "system", content: FRIDAY_SYSTEM_PROMPT },
      ...messages.slice(-20), // keep last 20 messages for context
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content;
        if (text) {
          controller.enqueue(encoder.encode(text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
