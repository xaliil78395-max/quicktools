"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AdsterraAd from "@/components/AdsterraAd";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getByteSize(value: string) {
  return new Blob([value]).size;
}

export default function JsonMinifierPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const originalSize = useMemo(() => getByteSize(input), [input]);
  const minifiedSize = useMemo(() => getByteSize(output), [output]);

  const savings =
    originalSize > 0 && output
      ? Math.max(0, ((originalSize - minifiedSize) / originalSize) * 100)
      : 0;

  function minifyJson() {
    setError("");
    setCopied(false);

    if (!input.trim()) {
      setOutput("");
      setError("Please paste JSON before minifying.");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch {
      setOutput("");
      setError("Invalid JSON. Please check your JSON syntax and try again.");
    }
  }

  async function copyOutput() {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Unable to copy automatically. Please copy the result manually.");
    }
  }

  function clearAll() {
    setInput("");
    setOutput("");
    setError("");
    setCopied(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">

        <div className="flex items-center justify-between w-full mb-8">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
          >
            ← Back
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
          >
            Home
          </Link>
        </div>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Developer Tools
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
            JSON Minifier
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Minify JSON online by removing unnecessary spaces and line breaks.
            Fast, private, and processed directly in your browser.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label
            htmlFor="json-input"
            className="mb-3 block text-sm font-semibold text-slate-800"
          >
            JSON Input
          </label>

          <textarea
            id="json-input"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError("");
            }}
            placeholder="Paste your JSON here..."
            className="min-h-[300px] w-full resize-y rounded-xl border border-slate-300 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            spellCheck={false}
          />

          {error && (
            <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={minifyJson}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Minify JSON
            </button>

            <button
              type="button"
              onClick={copyOutput}
              disabled={!output}
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied ? "Copied!" : "Copy"}
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Clear
            </button>
          </div>

          {output && (
            <div className="mt-8">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <label
                  htmlFor="json-output"
                  className="text-sm font-semibold text-slate-800"
                >
                  Minified JSON
                </label>

                <div className="text-sm text-slate-500">
                  {formatBytes(originalSize)} → {formatBytes(minifiedSize)}

                  <span className="ml-2 font-semibold text-indigo-600">
                    ({savings.toFixed(1)}% smaller)
                  </span>
                </div>
              </div>

              <textarea
                id="json-output"
                value={output}
                readOnly
                className="min-h-[240px] w-full resize-y rounded-xl border border-slate-300 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none"
                spellCheck={false}
              />
            </div>
          )}
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            How to minify JSON
          </h2>

          <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-600">
            <li>Paste your valid JSON into the input box.</li>
            <li>Click “Minify JSON” to remove unnecessary whitespace.</li>
            <li>Review the smaller JSON output and its size reduction.</li>
            <li>Click “Copy” to copy the minified JSON.</li>
          </ol>

          <p className="mt-5 text-sm leading-6 text-slate-500">
            Your JSON is processed directly in your browser. It is not
            uploaded to a conversion server.
          </p>
        </section>

        <AdsterraAd />
      </div>
    </main>
  );
}
