"use client";


import AdsterraAd from "@/components/AdsterraAd";
import Link from "next/link";
import { useMemo, useState } from "react";

function formatHtml(html: string) {
  if (!html.trim()) return "";

  const normalized = html
    .replace(/>\s+</g, "><")
    .replace(/</g, "\n<")
    .replace(/>/g, ">\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  let depth = 0;

  return normalized
    .map((line) => {
      if (/^<\//.test(line)) {
        depth = Math.max(0, depth - 1);
      }

      const formatted = `${"  ".repeat(depth)}${line}`;

      if (
        /^<[^!?/][^>]*>$/.test(line) &&
        !/\/>$/.test(line) &&
        !/^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)\b/i.test(
          line,
        ) &&
        !/<\/[^>]+>$/.test(line)
      ) {
        depth += 1;
      }

      return formatted;
    })
    .join("\n");
}

export default function HtmlFormatter() {
  const [html, setHtml] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => formatHtml(html), [html]);

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
    setHtml("");
    setCopied(false);
  };

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
            Developer Tool
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            HTML Formatter
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Format and beautify HTML code instantly for cleaner, easier-to-read markup.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <label className="text-lg font-semibold">Input HTML</label>

                  <span className="text-sm text-slate-500">
                    {html.length} characters
                  </span>
                </div>

                <textarea
                  value={html}
                  onChange={(event) => {
                    setHtml(event.target.value);
                    setCopied(false);
                  }}
                  placeholder={"Paste your HTML code here..."}
                  spellCheck={false}
                  className="mt-4 h-96 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-6 text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-4">
                  <label className="text-lg font-semibold">Formatted HTML</label>

                  <span className="text-sm text-slate-500">
                    {result ? result.split("\n").length : 0} lines
                  </span>
                </div>

                <textarea
                  value={result}
                  readOnly
                  placeholder="Your formatted HTML will appear here..."
                  spellCheck={false}
                  className="mt-4 h-96 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-6 text-slate-700 outline-none"
                />
              </div>
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
          <h2 className="text-xl font-bold">Free HTML Formatter</h2>

          <p className="mt-3 leading-7 text-slate-600">
            Quickly beautify compressed or poorly formatted HTML code and make
            it easier to read, edit, and debug.
          </p>

          <p className="mt-3 leading-7 text-slate-600">
            Your HTML is processed directly in your browser and is not uploaded
            to a server.
          </p>
        </div>
      </section>
    </main>
  );
}


