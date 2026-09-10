"use client";


import AdsterraAd from "@/components/AdsterraAd";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function TextSorter() {
  const [text, setText] = useState("");
  const [order, setOrder] = useState<"az" | "za">("az");
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const lines = text.split(/\r?\n/);

    return [...lines]
      .sort((a, b) => {
        const first = ignoreCase ? a.toLowerCase() : a;
        const second = ignoreCase ? b.toLowerCase() : b;
        const comparison = first.localeCompare(second);
        return order === "az" ? comparison : -comparison;
      })
      .join("\n");
  }, [text, order, ignoreCase]);

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

  const lineCount = text ? text.split(/\r?\n/).length : 0;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">

        <AdsterraAd />
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
            Text Sorter
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Sort lines of text alphabetically from A to Z or Z to A.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <label className="text-lg font-semibold">Input</label>

                  <span className="text-sm text-slate-500">
                    {lineCount} {lineCount === 1 ? "line" : "lines"}
                  </span>
                </div>

                <textarea
                  value={text}
                  onChange={(event) => {
                    setText(event.target.value);
                    setCopied(false);
                  }}
                  placeholder={"Paste your text here...\nOne item per line"}
                  spellCheck={false}
                  className="mt-4 h-80 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-6 text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-4">
                  <label className="text-lg font-semibold">Result</label>

                  <span className="text-sm text-slate-500">
                    {lineCount} {lineCount === 1 ? "line" : "lines"}
                  </span>
                </div>

                <textarea
                  value={result}
                  readOnly
                  placeholder="Your sorted text will appear here..."
                  spellCheck={false}
                  className="mt-4 h-80 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-6 text-slate-700 outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <button
                type="button"
                onClick={() => setOrder("az")}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  order === "az"
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                A → Z
              </button>

              <button
                type="button"
                onClick={() => setOrder("za")}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  order === "za"
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                Z → A
              </button>

              <label className="ml-0 flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700 sm:ml-auto">
                <input
                  type="checkbox"
                  checked={ignoreCase}
                  onChange={(event) => setIgnoreCase(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
                />
                Ignore case
              </label>
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
          <h2 className="text-xl font-bold">Free Text Sorter</h2>

          <p className="mt-3 leading-7 text-slate-600">
            Quickly sort lists, names, keywords, data, and other text line by
            line. Choose alphabetical order from A to Z or reverse order from
            Z to A.
          </p>

          <p className="mt-3 leading-7 text-slate-600">
            Use the ignore-case option when uppercase and lowercase letters
            should be treated equally while sorting.
          </p>
        </div>
      </section>
    </main>
  );
}


