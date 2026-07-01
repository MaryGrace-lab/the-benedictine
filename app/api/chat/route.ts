import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { SCHOOL_KNOWLEDGE } from "@/lib/schoolKnowledge";
import { z } from "zod";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const ChatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(2000),
    })
  ).max(20).min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = ChatRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    const { messages } = validation.data;

    const conversation = messages
      .map(
        (m: { role: string; content: string }) =>
          `${m.role}: ${m.content}`
      )
      .join("\n");

    const prompt = `
${SCHOOL_KNOWLEDGE}

Conversation:

${conversation}

Reply as Benedicta:
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({
      reply: response.text,
    });
  } catch (error) {
  console.error("Chat API error:", (error as Error).message);
  return NextResponse.json(
    { error: "Failed to generate response" },
    { status: 500 }
  );
}
}