"use client";

import { useState } from "react";

function parseScalar(value: string): unknown {
  const v = value.trim();

  if (v === "") return "";
  if (v === "true") return true;
  if (v === "false") return false;
  if (v === "null" || v === "~") return null;

  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    return v.slice(1, -1);
  }

  if (/^-?\d+(?:\.\d+)?$/.test(v)) {
    return Number(v);
  }

  return v;
}

function parseYamlList(input: string): Record<string, unknown>[] {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.replace(/\t/g, "  "))
    .filter((line) => line.trim() && !line.trim().startsWith("#"));

  const rows: Record<string, unknown>[] = [];
  let current: Record<string, unknown> | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("- ")) {
      if (current) rows.push(current);

      current = {};

      const firstField = trimmed.slice(2).trim();
      const colon = firstField.indexOf(":");

      if (colon !== -1) {
        const key = firstField.slice(0, colon).trim();
        const value = firstField.slice(colon + 1).trim();
        current[key] = parseScalar(value);
      }

      continue;
    }

    if (!current) continue;

    const colon = trimmed.indexOf(":");

    if (colon !== -1) {
      const key = trimmed.slice(0, colon).trim();
      const value = trimmed.slice(colon + 1).trim();

      current[key] = parseScalar(value);
    }
  }

  if (current) rows.push(current);

  return rows;
}

function escapeCsv(value: unknown): string {
  const text =
    value === null || value === undefined ? "" : String(value);

  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function yamlToCsv(input: string): string {
  const rows = parseYamlList(input);

  if (!rows.length) {
    throw new Error("No YAML records found.");
  }

  const headers = Array.from(
    new Set(rows.flatMap((row) => Object.keys(row)))
  );

  const csv = [
    headers.map(escapeCsv).join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCsv(row[header])).join(",")
    ),
  ];

  return csv.join("\n");
}

export default function YamlToCsvPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setError("");
      setOutput(yamlToCsv(input));
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "Invalid YAML.");
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  const downloadCsv = () => {
    if (!output) return;

    const blob = new Blob([output], {
      type: "text/csv;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "quickhub-data.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <a
            href="/"
            className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            Back
          </a>

          <a
            href="/"
            className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            Home
          </a>
        </div>

        <h1 className="mb-2 text-3xl font-bold">
          YAML to CSV Converter
        </h1>

        <p className="mb-6 text-muted-foreground">
          Convert YAML data into CSV format directly in your browser.
        </p>

        <div className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`- name: QuickHub
  tools: 100
  active: true
- name: Example
  tools: 50
  active: false`}
            className="min-h-[280px] w-full rounded-lg border border-border bg-background p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-primary"
          />

          <div className="flex flex-wrap gap-3">
            <button
              onClick={convert}
              className="bg-primary border border-primary px-5 py-2.5 font-medium text-primary-foreground rounded-md"
            >
              Convert
            </button>

            <button
              onClick={copyOutput}
              disabled={!output}
              className="rounded-md border border-border px-5 py-2.5 font-medium disabled:opacity-50"
            >
              Copy
            </button>

            <button
              onClick={downloadCsv}
              disabled={!output}
              className="rounded-md border border-border px-5 py-2.5 font-medium disabled:opacity-50"
            >
              Download CSV
            </button>

            <button
              onClick={clearAll}
              className="rounded-md border border-border px-5 py-2.5 font-medium"
            >
              Clear
            </button>
          </div>

          {error && (
            <div className="rounded-md border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <textarea
            value={output}
            readOnly
            placeholder="CSV output will appear here..."
            className="min-h-[280px] w-full rounded-lg border border-border bg-muted/30 p-4 font-mono text-sm"
          />
        </div>

        <div className="mt-8">
          <div id="adsterra-ad" />
        </div>
      </div>
    </main>
  );
}
