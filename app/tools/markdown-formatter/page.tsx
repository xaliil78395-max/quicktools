"use client";

import Link from "next/link";
import { useState } from "react";
import AdsterraAd from "@/components/AdsterraAd";

function formatMarkdown(markdown: string) {
  let text = markdown
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();

  if (!text) return "";

  const lines = text.split("\n");
  const output: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      if (output.length && output[output.length - 1] !== "") {
        output.push("");
      }
      continue;
    }

    if (/^#{1,6}\s*/.test(line)) {
      output.push(line.replace(/^(#{1,6})\s*/, "$1 "));
      continue;
    }

    if (/^[-*+]\s+/.test(line)) {
      output.push(line.replace(/^[-*+]\s+/, "- "));
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      output.push(line.replace(/^\d+\.\s+/, "1. "));
      continue;
    }

    if (/^>\s?/.test(line)) {
      output.push(line.replace(/^>\s*/, "> "));
      continue;
    }

    if (/^```/.test(line)) {
      output.push(line);
      continue;
    }

    output.push(line);
  }

  return output.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export default function MarkdownFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    setOutput(formatMarkdown(input));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!output) return;

    await navigator.clipboard.writeText(output);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setCopied(false);
  };

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="rounded-xl border border-slate-300 px-4 py-2 font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            ← Back
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-slate-300 px-4 py-2 font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Home
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-3xl font-bold">Markdown Formatter</h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Format and clean Markdown text for better readability and consistency.
          </p>

          <div className="mt-6">
            <label className="mb-2 block font-semibold">
              Markdown Input
            </label>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"# QuickHub\n\n## Useful Tools\n\n- Image tools\n- PDF tools"}
              className="min-h-[260px] w-full rounded-xl border border-slate-300 bg-white p-4 font-mono text-sm outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleFormat}
              className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900"
            >
              Format Markdown
            </button>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!output}
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              {copied ? "Copied!" : "Copy"}
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Clear
            </button>
          </div>

          <div className="mt-8">
            <label className="mb-2 block font-semibold">
              Formatted Markdown
            </label>

            <textarea
              value={output}
              readOnly
              placeholder="Formatted Markdown will appear here..."
              className="min-h-[260px] w-full rounded-xl border border-slate-300 bg-slate-50 p-4 font-mono text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold">How to format Markdown</h2>

            <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-600 dark:text-slate-400">
              <li>Paste your Markdown into the input box.</li>
              <li>Click “Format Markdown” to clean and standardize it.</li>
              <li>Use “Copy” to copy the formatted Markdown.</li>
              <li>Use “Clear” to remove the input and output.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <AdsterraAd />
        </div>
      </div>
    </main>
  );
}
