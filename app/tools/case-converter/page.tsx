"use client";

import { useState } from "react";

export default function CaseConverter() {
  const [text, setText] = useState("");

  const toTitleCase = (value: string) =>
    value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

  const toSentenceCase = (value: string) =>
    value.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (char) =>
      char.toUpperCase()
    );

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Case Converter
          </h1>

          <p className="mt-3 text-muted-foreground">
            Convert your text to different letter cases instantly.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="min-h-[300px] w-full resize-y rounded-xl border bg-background p-4 text-base outline-none transition focus:ring-2 focus:ring-primary"
            aria-label="Text to convert"
          />

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setText(text.toUpperCase())}
              className="rounded-xl border px-4 py-3 font-medium transition hover:bg-muted"
            >
              UPPERCASE
            </button>

            <button
              type="button"
              onClick={() => setText(text.toLowerCase())}
              className="rounded-xl border px-4 py-3 font-medium transition hover:bg-muted"
            >
              lowercase
            </button>

            <button
              type="button"
              onClick={() => setText(toTitleCase(text))}
              className="rounded-xl border px-4 py-3 font-medium transition hover:bg-muted"
            >
              Title Case
            </button>

            <button
              type="button"
              onClick={() => setText(toSentenceCase(text))}
              className="rounded-xl border px-4 py-3 font-medium transition hover:bg-muted"
            >
              Sentence case
            </button>
          </div>

          <button
            type="button"
            onClick={() => setText("")}
            className="mt-4 w-full rounded-xl border px-4 py-3 font-medium transition hover:bg-muted"
          >
            Clear
          </button>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">
            Free online case converter
          </h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            Use this free case converter to quickly change text between
            uppercase, lowercase, title case, and sentence case. Simply type
            or paste your text above and choose the case you want.
          </p>
        </section>
      </div>
    </main>
  );
}
