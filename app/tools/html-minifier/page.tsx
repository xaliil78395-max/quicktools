"use client";


import AdsterraAd from "@/components/AdsterraAd";
import Link from "next/link";
import { useState } from "react";

function minifyHtml(html: string) {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export default function HtmlMinifierPage() {
  const [html, setHtml] = useState("");
  const [result, setResult] = useState("");

  function handleMinify() {
    if (!html.trim()) return;
    setResult(minifyHtml(html));
  }

  function clearAll() {
    setHtml("");
    setResult("");
  }

  async function copyResult() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Back to QuickTools
        </Link>


        <AdsterraAd />
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              HTML Minifier
            </h1>
            <p className="mt-2 text-slate-600">
              Minify HTML by removing unnecessary spaces, line breaks, and comments.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              HTML Input
            </label>

            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              placeholder={"<div>\n  <!-- Comment -->\n  <h1>Hello World</h1>\n</div>"}
              rows={14}
              className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <span>{html.length} characters</span>
            <span>
              {html.trim() ? html.trim().split(/\s+/).length : 0} words
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleMinify}
              disabled={!html.trim()}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Minify HTML
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </button>

            {result && (
              <button
                type="button"
                onClick={copyResult}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Copy Result
              </button>
            )}
          </div>

          {result && (
            <div className="mt-8">
              <label className="mb-2 block text-sm font-semibold">
                Minified HTML
              </label>

              <textarea
                value={result}
                readOnly
                rows={10}
                className="w-full resize-y rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-mono text-sm leading-6 outline-none"
              />
            </div>
          )}
        </section>


<section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold">
            What is HTML Minification?
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            HTML minification removes unnecessary characters such as extra
            whitespace, line breaks, and comments from HTML code. Smaller HTML
            files can reduce page size and help improve loading performance.
          </p>
        </section>
      </div>
    </main>
  );
}



