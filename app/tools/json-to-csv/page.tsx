"use client";

import Link from "next/link";
import { useState } from "react";
import RelatedTools from "@/components/RelatedTools";
import AdsterraAd from "@/components/AdsterraAd";

function jsonToCsv(input: string) {
  const data = JSON.parse(input);

  if (!Array.isArray(data)) {
    throw new Error("JSON must contain an array of objects.");
  }

  if (data.length === 0) {
    throw new Error("The JSON array is empty.");
  }

  if (!data.every((item) => item && typeof item === "object" && !Array.isArray(item))) {
    throw new Error("Every item must be a JSON object.");
  }

  const headers = Array.from(
    new Set(data.flatMap((item) => Object.keys(item)))
  );

  const escapeCsv = (value: unknown) => {
    if (value === null || value === undefined) return "";

    let text = "";

    if (typeof value === "object") {
      text = JSON.stringify(value);
    } else {
      text = String(value);
    }

    if (/[",\r\n]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }

    return text;
  };

  const rows = [
    headers.map(escapeCsv).join(","),
    ...data.map((item) =>
      headers.map((header) => escapeCsv(item[header])).join(",")
    ),
  ];

  return rows.join("\r\n");
}

export default function JsonToCsvPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setError("");
      setOutput(jsonToCsv(input));
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "Invalid JSON.");
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const downloadCsv = () => {
    if (!output) return;

    const blob = new Blob([output], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "converted.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link
          href="/"
          onClick={() => window.history.back()}
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

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          JSON to CSV Converter
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Convert an array of JSON objects into a CSV file directly in your browser.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block font-semibold">JSON Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={'[\n  {"name":"QuickHub","tools":100},\n  {"name":"Example","tools":50}\n]'}
            className="min-h-64 w-full rounded-2xl border border-slate-300 bg-white p-4 font-mono text-sm outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={convert}
            className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900"
          >
            Convert to CSV
          </button>

          <button
            type="button"
            onClick={clearAll}
            className="rounded-xl border border-slate-300 px-5 py-3 font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        <div>
          <label className="mb-2 block font-semibold">CSV Output</label>
          <textarea
            value={output}
            readOnly
            placeholder="Your CSV output will appear here..."
            className="min-h-64 w-full rounded-2xl border border-slate-300 bg-slate-50 p-4 font-mono text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={copyOutput}
            disabled={!output}
            className="rounded-xl border border-slate-300 px-5 py-3 font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Copy
          </button>

          <button
            type="button"
            onClick={downloadCsv}
            disabled={!output}
            className="rounded-xl border border-slate-300 px-5 py-3 font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Download CSV
          </button>
        </div>
      </div>

      <RelatedTools currentTool="json-to-csv" />



      <AdsterraAd />
    </main>
  );
}

