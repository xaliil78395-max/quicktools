"use client";


import AdsterraAd from "@/components/AdsterraAd";
import Link from "next/link";
import { useState } from "react";

function minifyJson(json: string) {
  const parsed = JSON.parse(json);
  return JSON.stringify(parsed);
}

export default function JsonMinifierPage() {
  const [json, setJson] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  function handleMinify() {
    if (!json.trim()) return;

    try {
      setError("");
      setResult(minifyJson(json));
    } catch {
      setResult("");
      setError("Invalid JSON. Please check your JSON syntax and try again.");
    }
  }

  function clearAll() {
    setJson("");
    setResult("");
    setError("");
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
              JSON Minifier
            </h1>
            <p className="mt-2 text-slate-600">
              Minify JSON by removing unnecessary spaces and line breaks.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              JSON Input
            </label>

            <textarea
              value={json}
              onChange={(e) => setJson(e.target.value)}
              placeholder={'{\n  "name": "John",\n  "age": 30\n}'}
              rows={14}
              className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <span>{json.length} characters</span>
            <span>
              {json.trim() ? json.trim().split(/\s+/).length : 0} words
            </span>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleMinify}
              disabled={!json.trim()}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Minify JSON
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
                Minified JSON
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
            What is JSON Minification?
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            JSON minification removes unnecessary whitespace and line breaks
            while preserving the data and structure of the JSON. Smaller JSON
            data can reduce payload size and make data transfer more efficient.
          </p>
        </section>
      </div>
    </main>
  );
}



