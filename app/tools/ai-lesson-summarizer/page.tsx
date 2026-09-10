"use client";


import AdsterraAd from "@/components/AdsterraAd";
import Link from "next/link";
import { useState } from "react";

export default function AILessonSummarizerPage() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  async function summarize() {
    if (!text.trim()) return;

    setLoading(true);
    setSummary("");

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSummary(data.error || "Something went wrong.");
        return;
      }

      setSummary(data.summary);
    } catch {
      setSummary("Unable to connect to the summarization service.");
    } finally {
      setLoading(false);
    }
  }

  async function copySummary() {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
  }

  function clearAll() {
    setText("");
    setSummary("");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl">
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
              AI Lesson Summarizer
            </h1>
            <p className="mt-2 text-slate-600">
              Turn long lessons and study notes into clear, concise summaries.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Lesson or Study Notes
            </label>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your lesson, notes, or study material here..."
              rows={12}
              className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <span>{text.length} characters</span>
            <span>{text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={summarize}
              disabled={loading || !text.trim()}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Summarizing..." : "Summarize Lesson"}
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </button>

            {summary && (
              <button
                type="button"
                onClick={copySummary}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Copy Summary
              </button>
            )}
          </div>

          {summary && (
            <div className="mt-8">
              <label className="mb-2 block text-sm font-semibold">
                AI Summary
              </label>

              <textarea
                value={summary}
                readOnly
                rows={10}
                className="w-full resize-y rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 leading-7 outline-none"
              />
            </div>
          )}
        </section>


<section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold">
            Study Smarter with AI
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            Paste a lesson or study material and let AI identify the most
            important ideas, concepts, and information. This tool is designed
            to make long educational content easier to review and understand.
          </p>
        </section>
      </div>
    </main>
  );
}



