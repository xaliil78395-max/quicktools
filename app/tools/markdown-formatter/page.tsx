"use client";


import AdsterraAd from "@/components/AdsterraAd";
import Link from "next/link";
import { useState } from "react";

function markdownToHtml(markdown: string) {
  return markdown
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/^\- (.*)$/gm, "<li>$1</li>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br />");
}

export default function MarkdownFormatterPage() {
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");

  function formatMarkdown() {
    setHtml(markdownToHtml(markdown));
  }

  function clearAll() {
    setMarkdown("");
    setHtml("");
  }

  async function copyHtml() {
    if (!html) return;
    await navigator.clipboard.writeText(html);
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
              Markdown Formatter
            </h1>
            <p className="mt-2 text-slate-600">
              Convert Markdown into clean HTML instantly.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Markdown Input
            </label>

            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder={"# Hello World\n\nThis is **bold** text."}
              rows={14}
              className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 font-mono outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={formatMarkdown}
              disabled={!markdown.trim()}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Format Markdown
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </button>

            {html && (
              <button
                type="button"
                onClick={copyHtml}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Copy HTML
              </button>
            )}
          </div>

          {html && (
            <div className="mt-8">
              <label className="mb-2 block text-sm font-semibold">
                Formatted HTML
              </label>

              <textarea
                value={html}
                readOnly
                rows={14}
                className="w-full resize-y rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-mono outline-none"
              />
            </div>
          )}
        </section>


<section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold">
            What is Markdown?
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            Markdown is a lightweight markup language used to format text.
            It is widely used for documentation, README files, notes, blogs,
            and developer content.
          </p>
        </section>
      </div>
    </main>
  );
}



