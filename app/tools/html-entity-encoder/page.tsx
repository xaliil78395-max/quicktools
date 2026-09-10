"use client";


import AdsterraAd from "@/components/AdsterraAd";
import Link from "next/link";
import { useState } from "react";

function encodeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function decodeHtml(text: string) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

export default function HtmlEntityEncoderPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  function handleConvert() {
    if (!text.trim()) return;

    setResult(mode === "encode" ? encodeHtml(text) : decodeHtml(text));
  }

  function clearAll() {
    setText("");
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
              HTML Entity Encoder / Decoder
            </h1>
            <p className="mt-2 text-slate-600">
              Encode or decode HTML entities quickly and safely.
            </p>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("encode")}
              className={`rounded-xl px-5 py-3 font-semibold transition ${
                mode === "encode"
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Encode
            </button>

            <button
              type="button"
              onClick={() => setMode("decode")}
              className={`rounded-xl px-5 py-3 font-semibold transition ${
                mode === "decode"
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Decode
            </button>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Input
            </label>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                mode === "encode"
                  ? "<div>Hello & welcome</div>"
                  : "&lt;div&gt;Hello &amp; welcome&lt;/div&gt;"
              }
              rows={12}
              className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="mt-4 text-sm text-slate-500">
            {text.length} characters
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleConvert}
              disabled={!text.trim()}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {mode === "encode" ? "Encode HTML" : "Decode HTML"}
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
                Result
              </label>

              <textarea
                value={result}
                readOnly
                rows={12}
                className="w-full resize-y rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-mono text-sm leading-6 outline-none"
              />
            </div>
          )}
        </section>


<section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold">
            What are HTML Entities?
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            HTML entities are special character representations used in HTML.
            They allow characters such as less-than signs, ampersands, and
            quotation marks to be represented safely inside HTML documents.
          </p>
        </section>
      </div>
    </main>
  );
}



