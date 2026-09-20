"use client";

import { useState } from "react";

function parseScalar(value: string): unknown {
  const trimmed = value.trim();

  if (trimmed === "") return "";

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null" || trimmed === "~") return null;

  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((item) => parseScalar(item))
      .filter((item) => item !== "");
  }

  return trimmed;
}

function parseYamlList(yaml: string): Record<string, unknown>[] {
  const lines = yaml
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

      const firstValue = trimmed.slice(2).trim();

      if (firstValue.includes(":")) {
        const colonIndex = firstValue.indexOf(":");
        const key = firstValue.slice(0, colonIndex).trim();
        const value = firstValue.slice(colonIndex + 1).trim();

        if (key) {
          current[key] = parseScalar(value);
        }
      }

      continue;
    }

    if (!current) {
      current = {};
    }

    const colonIndex = trimmed.indexOf(":");

    if (colonIndex === -1) continue;

    const key = trimmed.slice(0, colonIndex).trim();
    const value = trimmed.slice(colonIndex + 1).trim();

    if (key) {
      current[key] = parseScalar(value);
    }
  }

  if (current) rows.push(current);

  return rows;
}

function parseYamlObject(yaml: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  const lines = yaml
    .split(/\r?\n/)
    .map((line) => line.replace(/\t/g, "  "))
    .filter((line) => line.trim() && !line.trim().startsWith("#"));

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("- ")) continue;

    const colonIndex = trimmed.indexOf(":");

    if (colonIndex === -1) continue;

    const key = trimmed.slice(0, colonIndex).trim();
    const value = trimmed.slice(colonIndex + 1).trim();

    if (key) {
      result[key] = parseScalar(value);
    }
  }

  return result;
}

function escapeMarkdown(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, " ");
}

function objectToMarkdown(
  value: Record<string, unknown>
): string {
  return Object.entries(value)
    .map(([key, item]) => {
      if (Array.isArray(item)) {
        return `**${escapeMarkdown(key)}:** ${item
          .map((entry) => escapeMarkdown(String(entry)))
          .join(", ")}`;
      }

      if (item !== null && typeof item === "object") {
        return `**${escapeMarkdown(key)}:**\n\n${objectToMarkdown(
          item as Record<string, unknown>
        )}`;
      }

      return `**${escapeMarkdown(key)}:** ${escapeMarkdown(
        String(item)
      )}`;
    })
    .join("\n\n");
}

function listToMarkdown(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return "";

  const keys = Array.from(
    new Set(rows.flatMap((row) => Object.keys(row)))
  );

  const header = `| ${keys.map(escapeMarkdown).join(" | ")} |`;
  const separator = `| ${keys.map(() => "---").join(" | ")} |`;

  const body = rows
    .map(
      (row) =>
        `| ${keys
          .map((key) => {
            const value = row[key];

            if (value === null || value === undefined) return "";

            if (typeof value === "object") {
              return escapeMarkdown(JSON.stringify(value));
            }

            return escapeMarkdown(String(value));
          })
          .join(" | ")} |`
    )
    .join("\n");

  return `${header}\n${separator}\n${body}`;
}

function yamlToMarkdown(yaml: string) {
  const trimmed = yaml.trim();

  if (!trimmed) {
    throw new Error("Please enter YAML data.");
  }

  if (trimmed.split(/\r?\n/).some((line) => line.trim().startsWith("- "))) {
    const rows = parseYamlList(trimmed);

    if (rows.length === 0) {
      throw new Error("Unable to parse YAML list.");
    }

    return listToMarkdown(rows);
  }

  const object = parseYamlObject(trimmed);

  if (Object.keys(object).length === 0) {
    throw new Error("Unable to parse YAML data.");
  }

  return objectToMarkdown(object);
}

export default function YamlToMarkdownPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setOutput(yamlToMarkdown(input));
      setError("");
    } catch (err) {
      setOutput("");
      setError(
        err instanceof Error ? err.message : "Unable to convert YAML."
      );
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
          YAML to Markdown Converter
        </h1>

        <p className="mb-8 text-center text-muted-foreground">
          Convert YAML data into clean Markdown format.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">YAML Input</label>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`name: QuickHub
tools: 100
active: true`}
              className="min-h-[320px] w-full rounded-lg border bg-background p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Markdown Output
            </label>

            <textarea
              value={output}
              readOnly
              placeholder="Markdown output will appear here..."
              className="min-h-[320px] w-full rounded-lg border bg-muted/30 p-4 font-mono text-sm outline-none"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm font-medium text-destructive">
            {error}
          </p>
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
    </main>
  );
}
