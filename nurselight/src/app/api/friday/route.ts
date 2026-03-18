import OpenAI from "openai";
import { FRIDAY_SYSTEM_PROMPT } from "@/lib/friday-prompt";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// Gemini fallback via their OpenAI-compatible endpoint
function getGeminiClient() {
  return new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  });
}

function streamResponse(readable: ReadableStream<Uint8Array>) {
  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "Transfer-Encoding": "chunked",
    },
  });
}

function createReadableStream(
  streamIter: AsyncIterable<{ choices: Array<{ delta?: { content?: string | null } }> }>
) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamIter) {
          const text = chunk.choices[0]?.delta?.content;
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      } catch {
        controller.enqueue(encoder.encode("\n\n[Connection interrupted. Please try again.]"));
        controller.close();
      }
    },
  });
}

async function tryOpenAI(allMessages: ChatMessage[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("No OpenAI key");

  const openai = new OpenAI({ apiKey });
  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    stream: true,
    temperature: 0.85,
    max_tokens: 600,
    messages: allMessages,
  });

  return createReadableStream(stream);
}

async function tryGemini(allMessages: ChatMessage[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("No Gemini key");

  // Gemini's OpenAI-compatible endpoint needs the system prompt
  // folded into the first user message if there's no dedicated support
  const geminiMessages = allMessages.map((m) => {
    if (m.role === "system") {
      return { role: "user" as const, content: `[System Instructions]\n${m.content}` };
    }
    return m;
  });

  // If first two messages are both "user" now, merge them
  if (
    geminiMessages.length >= 2 &&
    geminiMessages[0].role === "user" &&
    geminiMessages[1].role === "user"
  ) {
    geminiMessages[0] = {
      role: "user",
      content: geminiMessages[0].content + "\n\n" + geminiMessages[1].content,
    };
    geminiMessages.splice(1, 1);
  }

  // Ensure alternating user/assistant turns for Gemini
  const cleaned: typeof geminiMessages = [];
  for (const msg of geminiMessages) {
    if (cleaned.length > 0 && cleaned[cleaned.length - 1].role === msg.role) {
      cleaned[cleaned.length - 1].content += "\n\n" + msg.content;
    } else {
      cleaned.push({ ...msg });
    }
  }

  const gemini = getGeminiClient();
  const stream = await gemini.chat.completions.create({
    model: "gemini-2.0-flash",
    stream: true,
    temperature: 0.85,
    messages: cleaned,
  });

  return createReadableStream(stream);
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const allMessages: ChatMessage[] = [
      { role: "system", content: FRIDAY_SYSTEM_PROMPT },
      ...messages.slice(-20),
    ];

    // Try OpenAI first, fall back to Gemini
    try {
      const readable = await tryOpenAI(allMessages);
      return streamResponse(readable);
    } catch (openaiErr) {
      console.log("OpenAI failed, falling back to Gemini:", openaiErr instanceof Error ? openaiErr.message : openaiErr);

      try {
        const readable = await tryGemini(allMessages);
        return streamResponse(readable);
      } catch (geminiErr) {
        throw new Error(
          `Both providers failed. OpenAI: ${openaiErr instanceof Error ? openaiErr.message : "unknown"}. Gemini: ${geminiErr instanceof Error ? geminiErr.message : "unknown"}`
        );
      }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
