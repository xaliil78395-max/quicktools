"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();

    const words = trimmed ? trimmed.split(/\s+/).length : 0;

    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;

    const sentences = trimmed
      ? trimmed.split(/[.!?]+(?:\s|$)/).filter(Boolean).length
      : 0;

    const paragraphs = trimmed
      ? text.split(/\n\s*\n/).filter((paragraph) => paragraph.trim()).length
      : 0;

    const readingTime = words === 0 ? 0 : Math.max(1, Math.ceil(words / 200));

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTime,
    };
  }, [text]);

  const clearText = () => {
    setText("");
  };

  const copyText = async () => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard access may be unavailable in some browsers.
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Back to QuickTools
          </Link>

          <div className="mt-8 inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
            Text Tool
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            Word Counter
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Count words, characters, sentences, paragraphs, and reading time
            instantly in your browser.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <label
              htmlFor="word-counter-text"
              className="text-sm font-semibold text-slate-700"
            >
              Enter or paste your text
            </label>

            <textarea
              id="word-counter-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Start typing or paste your text here..."
              className="mt-3 min-h-[320px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              spellCheck
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={copyText}
                disabled={!text}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Copy Text
              </button>

              <button
                type="button"
                onClick={clearText}
                disabled={!text}
                className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Words</p>
              <p className="mt-2 text-3xl font-bold tracking-tight">
                {stats.words.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Characters</p>
              <p className="mt-2 text-3xl font-bold tracking-tight">
                {stats.characters.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">No Spaces</p>
              <p className="mt-2 text-3xl font-bold tracking-tight">
                {stats.charactersNoSpaces.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Sentences</p>
              <p className="mt-2 text-3xl font-bold tracking-tight">
                {stats.sentences.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Paragraphs</p>
              <p className="mt-2 text-3xl font-bold tracking-tight">
                {stats.paragraphs.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Reading Time</p>
              <p className="mt-2 text-3xl font-bold tracking-tight">
                {stats.readingTime} min
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold">Free online word counter</h2>

          <p className="mt-3 leading-7 text-slate-600">
            QuickTools counts your words and text statistics instantly as you
            type or paste. Everything runs directly in your browser.
          </p>

          <p className="mt-3 leading-7 text-slate-600">
            Your text does not need to be uploaded to a remote server, making
            this tool useful for essays, articles, assignments, social posts,
            and everyday writing.
          </p>
        </div>
      </section>
    </main>
  );
}
