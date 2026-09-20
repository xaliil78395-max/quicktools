"use client";

import Link from "next/link";
import { useState } from "react";
import AdsterraAd from "@/components/AdsterraAd";

function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];

    if (inQuotes) {
      if (char === '"') {
        if (csv[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char === "\r") {
      if (csv[i + 1] === "\n") {
        continue;
      }

      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((currentRow) =>
    currentRow.some((value) => value.trim() !== "")
  );
}

function csvToJson(csv: string): string {
  const rows = parseCsv(csv);

  if (rows.length < 2) {
    throw new Error("CSV must contain a header row and at least one data row.");
  }

  const headers = rows[0].map((header, index) => {
    const cleaned = header.trim();
    return cleaned || `column${index + 1}`;
  });

  const duplicateHeaders = headers.filter(
    (header, index) => headers.indexOf(header) !== index
  );

  if (duplicateHeaders.length > 0) {
    throw new Error("CSV headers must be unique.");
  }

  const data = rows.slice(1).map((row) => {
    const object: Record<string, string> = {};

    headers.forEach((header, index) => {
      object[header] = row[index] ?? "";
    });

    return object;
  });

  return JSON.stringify(data, null, 2);
}

export default function CsvToJsonPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setError("");
      setOutput(csvToJson(input));
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "Invalid CSV.");
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  const downloadJson = () => {
    if (!output) return;

    const blob = new Blob([output], {
      type: "application/json;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "converted.json";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
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
          CSV to JSON Converter
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Convert CSV data into structured JSON directly in your browser.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block font-semibold">CSV Input</label>

          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={"name,tools,active\nQuickHub,100,true\nExample,50,false"}
            className="min-h-64 w-full rounded-2xl border border-slate-300 bg-white p-4 font-mono text-sm outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={convert}
            className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900"
          >
            Convert to JSON
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
          <label className="mb-2 block font-semibold">JSON Output</label>

          <textarea
            value={output}
            readOnly
            placeholder="Your JSON output will appear here..."
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
            onClick={downloadJson}
            disabled={!output}
            className="rounded-xl border border-slate-300 px-5 py-3 font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Download JSON
          </button>
        </div>
      </div>

      <AdsterraAd />
    </main>
  );
}
