"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

function escapeCsv(value: string) {
  const text = value.replace(/\r?\n/g, " ").trim();
  if (/[",\n]/.test(text)) {
    return '"' + text.replace(/"/g, '""') + '"';
  }
  return text;
}

export default function HtmlToCsvPage() {
  const [html, setHtml] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    setError("");
    setOutput("");

    if (!html.trim()) {
      setError("Please enter HTML first.");
      return;
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const tables = Array.from(doc.querySelectorAll("table"));

      if (tables.length === 0) {
        setError("No HTML table found.");
        return;
      }

      const rows = Array.from(tables[0].querySelectorAll("tr"));

      if (rows.length === 0) {
        setError("No table rows found.");
        return;
      }

      const data = rows.map((row) =>
        Array.from(row.querySelectorAll("th, td")).map((cell) =>
          escapeCsv(cell.textContent || "")
        )
      );

      const maxColumns = Math.max(...data.map((row) => row.length));

      const normalized = data.map((row) =>
        Array.from({ length: maxColumns }, (_, index) => row[index] ?? "")
      );

      setOutput(normalized.map((row) => row.join(",")).join("\n"));
    } catch {
      setError("Unable to convert the HTML.");
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  const downloadCsv = () => {
    if (!output) return;

    const blob = new Blob([output], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "quickhub-html-to-csv.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setHtml("");
    setOutput("");
    setError("");
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          ← Back
        </Link>

        <Link
          href="/"
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Home
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">HTML to CSV Converter</h1>
        <p className="mt-2 text-muted-foreground">
          Convert HTML tables to CSV directly in your browser.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">
            HTML Input
          </label>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="<table>...</table>"
            className="min-h-[260px] w-full rounded-lg border bg-background p-4 font-mono text-sm outline-none focus:ring-2"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={convert}
            className="rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90"
          >
            Convert
          </button>

          <button
            onClick={copyOutput}
            disabled={!output}
            className="rounded-lg border px-5 py-2.5 font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Copy
          </button>

          <button
            onClick={downloadCsv}
            disabled={!output}
            className="rounded-lg border px-5 py-2.5 font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Download CSV
          </button>

          <button
            onClick={clearAll}
            className="rounded-lg border px-5 py-2.5 font-medium hover:bg-muted"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium">
            CSV Output
          </label>
          <textarea
            value={output}
            readOnly
            placeholder="Your CSV output will appear here..."
            className="min-h-[260px] w-full rounded-lg border bg-muted/30 p-4 font-mono text-sm outline-none"
          />
        </div>

        <RelatedTools currentTool="html-to-csv" />

        <div className="mt-10 min-h-[90px] rounded-lg border p-4 text-center text-sm text-muted-foreground">
          Advertisement
        </div>
      </div>
    </main>
  );
}
