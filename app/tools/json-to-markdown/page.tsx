"use client";
import RelatedTools from "@/components/RelatedTools";

import { useState } from "react";

function escapeMarkdown(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, " ");
}

function valueToMarkdown(value: unknown, indent = 0): string {
  const space = " ".repeat(indent);

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";

    if (value.every((item) => item !== null && typeof item === "object" && !Array.isArray(item))) {
      const rows = value as Record<string, unknown>[];
      const keys = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));

      const header = `| ${keys.map(escapeMarkdown).join(" | ")} |`;
      const separator = `| ${keys.map(() => "---").join(" | ")} |`;
      const body = rows
        .map(
          (row) =>
            `| ${keys
              .map((key) => {
                const cell = row[key];
                if (cell === null || cell === undefined) return "";
                if (typeof cell === "object") {
                  return escapeMarkdown(JSON.stringify(cell));
                }
                return escapeMarkdown(String(cell));
              })
              .join(" | ")} |`
        )
        .join("\n");

      return `${header}\n${separator}\n${body}`;
    }

    return value
      .map((item) => `${space}- ${valueToMarkdown(item, indent + 2)}`)
      .join("\n");
  }

  if (value !== null && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, item]) => {
        if (item !== null && typeof item === "object") {
          return `${space}**${escapeMarkdown(key)}:**\n${valueToMarkdown(item, indent + 2)}`;
        }

        return `${space}**${escapeMarkdown(key)}:** ${escapeMarkdown(String(item))}`;
      })
      .join("\n");
  }

  if (value === null) return "null";
  if (typeof value === "string") return escapeMarkdown(value);
  return String(value);
}

export default function JsonToMarkdownPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(valueToMarkdown(parsed));
      setError("");
    } catch {
      setOutput("");
      setError("Invalid JSON. Please enter valid JSON data.");
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  const downloadMarkdown = () => {
    if (!output) return;

    const blob = new Blob([output], {
      type: "text/markdown;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <a
            href="/"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            ← Back
          </a>

          <a
            href="/"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Home
          </a>
        </div>

        <h1 className="mb-3 text-center text-3xl font-bold">
          JSON to Markdown Converter
        </h1>

        <p className="mb-8 text-center text-muted-foreground">
          Convert JSON data into clean Markdown format.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">JSON Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`{
  "name": "QuickHub",
  "tools": 100,
  "active": true
}`}
              className="min-h-[320px] w-full rounded-lg border bg-background p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Markdown Output</label>
            <textarea
              value={output}
              readOnly
              placeholder="Markdown output will appear here..."
              className="min-h-[320px] w-full rounded-lg border bg-muted/30 p-4 font-mono text-sm outline-none"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm font-medium text-destructive">{error}</p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={convert}
            className="rounded-md border border-primary bg-primary px-5 py-2.5 font-medium text-primary-foreground"
          >
            Convert
          </button>

          <button
            onClick={copyOutput}
            className="rounded-md border px-5 py-2.5 font-medium hover:bg-muted"
          >
            Copy
          </button>

          <button
            onClick={downloadMarkdown}
            className="rounded-md border px-5 py-2.5 font-medium hover:bg-muted"
          >
            Download Markdown
          </button>

          <button
            onClick={clearAll}
            className="rounded-md border px-5 py-2.5 font-medium hover:bg-muted"
          >
            Clear
          </button>
        </div>

        <div className="mt-10 rounded-lg border p-4 text-center text-sm text-muted-foreground">
          Advertisement
        </div>
      </div>
            <RelatedTools currentTool="json-to-markdown" />
      </main>
  );
}

