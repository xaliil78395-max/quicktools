"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

function htmlToJson(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const tables = Array.from(doc.querySelectorAll("table"));

  if (tables.length === 0) {
    throw new Error("No HTML table found.");
  }

  const result = tables.map((table) => {
    const rows = Array.from(table.querySelectorAll("tr"));

    if (rows.length === 0) {
      return [];
    }

    const headerCells = Array.from(
      rows[0].querySelectorAll("th, td")
    );

    const headers = headerCells.map((cell, index) => {
      const value = cell.textContent?.trim() || "";
      return value || `column${index + 1}`;
    });

    return rows.slice(1).map((row) => {
      const cells = Array.from(row.querySelectorAll("th, td"));
      const item: Record<string, string> = {};

      headers.forEach((header, index) => {
        item[header] = cells[index]?.textContent?.trim() || "";
      });

      return item;
    });
  });

  return JSON.stringify(result.length === 1 ? result[0] : result, null, 2);
}

export default function HtmlToJsonPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    try {
      if (!input.trim()) {
        setOutput("");
        setError("Please enter HTML containing a table.");
        return;
      }

      const result = htmlToJson(input);
      setOutput(result);
      setError("");
      setCopied(false);
    } catch (err) {
      setOutput("");
      setError(
        err instanceof Error ? err.message : "Unable to convert the HTML."
      );
    }
  };

  const handleCopy = async () => {
    if (!output) return;

    await navigator.clipboard.writeText(output);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    if (!output) return;

    const blob = new Blob([output], {
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "converted.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
    setCopied(false);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
        >
          ← Back
        </Link>

        <Link
          href="/"
          className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
        >
          Home
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">HTML to JSON Converter</h1>
        <p className="mt-2 text-muted-foreground">
          Convert HTML tables into structured JSON data directly in your
          browser.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <label className="mb-2 block text-sm font-medium">
            HTML Input
          </label>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`<table>
  <tr><th>Name</th><th>Age</th></tr>
  <tr><td>Ali</td><td>25</td></tr>
  <tr><td>John</td><td>30</td></tr>
</table>`}
            className="min-h-[360px] w-full rounded-lg border bg-background p-4 font-mono text-sm outline-none focus:ring-2"
          />
        </section>

        <section>
          <label className="mb-2 block text-sm font-medium">
            JSON Output
          </label>

          <textarea
            value={output}
            readOnly
            placeholder="Your JSON will appear here..."
            className="min-h-[360px] w-full rounded-lg border bg-background p-4 font-mono text-sm outline-none"
          />
        </section>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-300 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={handleConvert}
          className="rounded-md bg-primary px-5 py-2.5 text-primary-foreground hover:opacity-90"
        >
          Convert
        </button>

        <button
          onClick={handleCopy}
          disabled={!output}
          className="rounded-md border px-5 py-2.5 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copied ? "Copied!" : "Copy"}
        </button>

        <button
          onClick={handleDownload}
          disabled={!output}
          className="rounded-md border px-5 py-2.5 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          Download JSON
        </button>

        <button
          onClick={handleClear}
          className="rounded-md border px-5 py-2.5 hover:bg-muted"
        >
          Clear
        </button>
      </div>

      <RelatedTools currentTool="html-to-json" />

      <div className="mt-10 rounded-lg border p-4 text-center text-sm text-muted-foreground">
        Advertisement
      </div>
    </main>
  );
}
