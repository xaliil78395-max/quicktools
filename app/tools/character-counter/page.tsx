"use client";

import { useMemo, useState } from "react";

export default function CharacterCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

    return {
      characters,
      charactersNoSpaces,
      words,
    };
  }, [text]);

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Character Counter
          </h1>
          <p className="mt-3 text-muted-foreground">
            Count characters and words in your text instantly.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="min-h-[300px] w-full resize-y rounded-xl border bg-background p-4 text-base outline-none transition focus:ring-2 focus:ring-primary"
            aria-label="Text to count"
          />

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border p-5 text-center">
              <div className="text-sm text-muted-foreground">
                Characters
              </div>
              <div className="mt-2 text-3xl font-bold">
                {stats.characters}
              </div>
            </div>

            <div className="rounded-xl border p-5 text-center">
              <div className="text-sm text-muted-foreground">
                No Spaces
              </div>
              <div className="mt-2 text-3xl font-bold">
                {stats.charactersNoSpaces}
              </div>
            </div>

            <div className="rounded-xl border p-5 text-center">
              <div className="text-sm text-muted-foreground">
                Words
              </div>
              <div className="mt-2 text-3xl font-bold">
                {stats.words}
              </div>
            </div>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">
            Free online character counter
          </h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            Use this free character counter to quickly count characters,
            characters without spaces, and words in any text. Simply type or
            paste your text into the box above and the results will update
            instantly.
          </p>
        </section>
      </div>
    </main>
  );
}
