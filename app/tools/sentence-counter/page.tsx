"use client";

import { useMemo, useState } from "react";

export default function SentenceCounter() {
  const [text, setText] = useState("");

  const sentences = useMemo(() => {
    const trimmed = text.trim();

    if (!trimmed) return 0;

    return trimmed
      .split(/[.!?]+(?:\s+|$)/)
      .map((sentence) => sentence.trim())
      .filter(Boolean).length;
  }, [text]);

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Sentence Counter
          </h1>

          <p className="mt-3 text-muted-foreground">
            Count sentences in your text instantly.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="min-h-[300px] w-full resize-y rounded-xl border bg-background p-4 text-base outline-none transition focus:ring-2 focus:ring-primary"
            aria-label="Text to count sentences"
          />

          <div className="mt-5">
            <div className="rounded-xl border p-6 text-center">
              <div className="text-sm text-muted-foreground">
                Sentences
              </div>

              <div className="mt-2 text-4xl font-bold">
                {sentences}
              </div>
            </div>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">
            Free online sentence counter
          </h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            Use this free sentence counter to quickly count the number of
            sentences in your text. Simply type or paste your text into the
            box above and the result will update instantly.
          </p>
        </section>
      </div>
    </main>
  );
}
