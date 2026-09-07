"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function RemoveDuplicateLines() {
  const [text, setText] = useState("");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const lines = text.split(/\r?\n/);

    const seen = new Set<string>();
    const uniqueLines: string[] = [];

    for (const line of lines) {
      const key = ignoreWhitespace ? line.trim() : line;

      if (!seen.has(key)) {
        seen.add(key);
        uniqueLines.push(line);
      }
    }

    return uniqueLines.join("\n");
  }, [text, ignoreWhitespace]);

  const inputLines = text ? text.split(/\r?\n/).length : 0;
  const outputLines = result ? result.split(/\r?\n/).length : 0;
  const removedLines = Math.max(0, inputLines - outputLines);

  const copyResult = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  const clearAll = () => {
    setText("");
    setCopied(false);
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
            Remove Duplicate Lines
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Remove duplicate lines from your text while keeping the original
            order.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <label className="text-lg font-semibold">
                    Input
                  </label>

                  <span className="text-sm text-slate-500">
                    {inputLines} {inputLines === 1 ? "line" : "lines"}
                  </span>
                </div>

                <textarea
                  value={text}
                  onChange={(event) => {
                    setText(event.target.value);
                    setCopied(false);
                  }}
                  placeholder={"Paste your text here...\nOne line per item"}
                  spellCheck={false}
                  className="mt-4 h-80 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-6 text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-4">
                  <label className="text-lg font-semibold">
                    Result
                  </label>

                  <span className="text-sm text-slate-500">
                    {outputLines} {outputLines === 1 ? "line" : "lines"}
                  </span>
                </div>

                <textarea
                  value={result}
                  readOnly
                  placeholder="Your cleaned text will appear here..."
                  spellCheck={false}
                  className="mt-4 h-80 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-6 text-slate-700 outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
              <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={ignoreWhitespace}
                  onChange={(event) =>
                    setIgnoreWhitespace(event.target.checked)
                  }
                  className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
                />
                Ignore leading and trailing spaces
              </label>

              <span className="text-sm text-slate-500">
                {removedLines > 0
                  ? `${removedLines} duplicate ${
                      removedLines === 1 ? "line" : "lines"
                    } removed`
                  : "No duplicate lines removed"}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={copyResult}
                disabled={!result}
                className="rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copied ? "Copied!" : "Copy Result"}
              </button>

              <button
                type="button"
                onClick={clearAll}
                className="rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold">Free Duplicate Line Remover</h2>

          <p className="mt-3 leading-7 text-slate-600">
            Quickly remove repeated lines from lists, text files, datasets,
            code, and other content. QuickTools keeps the first occurrence of
            each line and preserves the original order.
          </p>

          <p className="mt-3 leading-7 text-slate-600">
            Enable the whitespace option when lines that differ only by
            leading or trailing spaces should be treated as duplicates.
          </p>
        </div>
      </section>
    </main>
  );
}
