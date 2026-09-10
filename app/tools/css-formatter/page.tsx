"use client";


import AdsterraAd from "@/components/AdsterraAd";
import Link from "next/link";
import { useState } from "react";

function formatCss(css: string) {
  const clean = css
    .replace(/\/\*[\s\S]*?\*\//g, (match) => `${match}\n`)
    .replace(/\s+/g, " ")
    .replace(/\s*{\s*/g, " {\n  ")
    .replace(/\s*:\s*/g, ": ")
    .replace(/;\s*/g, ";\n  ")
    .replace(/\n  ([^{}\n]+)\n}/g, "`n  `$1;`n}`n")
    .replace(/\s*}\s*/g, "\n}\n")
    .replace(/,\s*/g, ",\n")
    .replace(/([^;{}\n])\n}/g, "$1;\n}")
    .replace(/}\n(?=\S)/g, "}\n\n")
    .replace(/\n\s*\n/g, "\n\n")
    .trim();

  return clean;
}

export default function CssFormatterPage() {
  const [css, setCss] = useState("");
  const [formatted, setFormatted] = useState("");

  function handleFormat() {
    if (!css.trim()) return;
    setFormatted(formatCss(css));
  }

  function clearAll() {
    setCss("");
    setFormatted("");
  }

  async function copyFormatted() {
    if (!formatted) return;
    await navigator.clipboard.writeText(formatted);
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
              CSS Formatter
            </h1>
            <p className="mt-2 text-slate-600">
              Format and beautify CSS code instantly.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              CSS Input
            </label>

            <textarea
              value={css}
              onChange={(e) => setCss(e.target.value)}
              placeholder={"body{margin:0;padding:0;color:#333} .container{max-width:1200px;margin:auto}"}
              rows={14}
              className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <span>{css.length} characters</span>
            <span>{css.trim() ? css.trim().split(/\s+/).length : 0} words</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleFormat}
              disabled={!css.trim()}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Format CSS
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </button>

            {formatted && (
              <button
                type="button"
                onClick={copyFormatted}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Copy CSS
              </button>
            )}
          </div>

          {formatted && (
            <div className="mt-8">
              <label className="mb-2 block text-sm font-semibold">
                Formatted CSS
              </label>

              <textarea
                value={formatted}
                readOnly
                rows={16}
                className="w-full resize-y rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-mono text-sm leading-6 outline-none"
              />
            </div>
          )}
        </section>


<section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold">
            What is CSS Formatting?
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            CSS formatting makes stylesheet code easier to read, understand,
            and maintain. This tool organizes selectors, properties, and
            declarations into a clean structure without requiring any
            installation.
          </p>
        </section>
      </div>
    </main>
  );
}






