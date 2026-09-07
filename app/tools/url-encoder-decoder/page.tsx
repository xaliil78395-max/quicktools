"use client";

import Link from "next/link";
import { useState } from "react";

export default function UrlEncoderDecoder() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);

  const result = (() => {
    if (!text) return "";

    try {
      return mode === "encode" ? encodeURIComponent(text) : decodeURIComponent(text);
    } catch {
      return "Invalid URL-encoded text";
    }
  })();

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
            Developer Tool
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            URL Encoder / Decoder
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Encode or decode URLs and text instantly with this free online tool.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <label className="text-lg font-semibold">Input</label>

                <textarea
                  value={text}
                  onChange={(event) => {
                    setText(event.target.value);
                    setCopied(false);
                  }}
                  placeholder="Enter URL or text here..."
                  spellCheck={false}
                  className="mt-4 h-80 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-6 text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="text-lg font-semibold">Result</label>

                <textarea
                  value={result}
                  readOnly
                  placeholder="Your result will appear here..."
                  spellCheck={false}
                  className="mt-4 h-80 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-6 text-slate-700 outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 rounded-2xl bg-slate-50 p-4">
              <button
                type="button"
                onClick={() => setMode("encode")}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  mode === "encode"
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                Encode URL
              </button>

              <button
                type="button"
                onClick={() => setMode("decode")}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  mode === "decode"
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                Decode URL
              </button>
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
          <h2 className="text-xl font-bold">Free URL Encoder / Decoder</h2>

          <p className="mt-3 leading-7 text-slate-600">
            Encode special characters in URLs for safe transmission or decode
            URL-encoded text back into its original form.
          </p>

          <p className="mt-3 leading-7 text-slate-600">
            Everything runs directly in your browser, so your text is not
            uploaded to a server.
          </p>
        </div>
      </section>
    </main>
  );
}
