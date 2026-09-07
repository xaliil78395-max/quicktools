import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = typeof body.text === "string" ? body.text.trim() : "";

    if (!text) {
      return NextResponse.json(
        { error: "Please provide a lesson or study text." },
        { status: 400 },
      );
    }

    if (text.length > 50000) {
      return NextResponse.json(
        { error: "The lesson is too long. Please keep it under 50,000 characters." },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 500 },
      );
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: "You are an expert educational summarizer. Summarize the provided lesson clearly and accurately. Preserve important facts, concepts, definitions, dates, names, and relationships. Organize the summary with short headings and bullet points when useful. Do not invent information. Write the summary in the same language as the lesson.",
              },
            ],
          },
          contents: [
            {
              role: "user",
              parts: [{ text }],
            },
          ],
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);

      return NextResponse.json(
        { error: "The AI service could not process your lesson." },
        { status: 502 },
      );
    }

    const summary =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text || "")
        .join("")
        .trim() || "";

    if (!summary) {
      return NextResponse.json(
        { error: "The AI service returned an empty summary." },
        { status: 502 },
      );
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summarization error:", error);

    return NextResponse.json(
      { error: "Unable to summarize the lesson. Please try again." },
      { status: 500 },
    );
  }
}

