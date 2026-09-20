"use client";

import { useState } from "react";

function escapeMarkdown(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, " ");
}

function elementToValue(element: Element): unknown {
  const children = Array.from(element.children);

  if (children.length === 0) {
    return element.textContent?.trim() ?? "";
  }

  const result: Record<string, unknown> = {};

  for (const child of children) {
    const key = child.tagName;
    const value = elementToValue(child);

    if (key in result) {
      if (!Array.isArray(result[key])) {
        result[key] = [result[key]];
      }
      (result[key] as unknown[]).push(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

function valueToMarkdown(value: unknown, indent = 0): string {
  const space = " ".repeat(indent);

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";

    if (
      value.every(
        (item) =>
          item !== null &&
          typeof item === "object" &&
          !Array.isArray(item)
      )
    ) {
      const rows = value as Record<string, unknown>[];
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
                const item = row[key];

                if (item === null || item === undefined) return "";

                if (typeof item === "object") {
                  return escapeMarkdown(JSON.stringify(item));
                }

                return escapeMarkdown(String(item));
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
          return `${space}**${escapeMarkdown(key)}:**\n${valueToMarkdown(
            item,
            indent + 2
          )}`;
        }

        return `${space}**${escapeMarkdown(key)}:** ${escapeMarkdown(
          String(item)
        )}`;
      })
      .join("\n");
  }

  if (value === null) return "null";

  return escapeMarkdown(String(value));
}

function xmlToMarkdown(xml: string) {
  const parser = new DOMParser();
  const document = parser.parseFromString(xml, "application/xml");

  const parserError = document.querySelector("parsererror");

  if (parserError) {
    throw new Error("Invalid XML. Please enter valid XML data.");
  }

  if (!document.documentElement) {
    throw new Error("XML document is empty.");
  }

  const root = document.documentElement;
  const value = elementToValue(root);

  return `# ${root.tagName}\n\n${valueToMarkdown(value)}`;
}

export default function XmlToMarkdownPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setOutput(xmlToMarkdown(input));
      setError("");
    } catch (err) {
      setOutput("");
      setError(
        err instanceof Error ? err.message : "Unable to convert XML."
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
          XML to Markdown Converter
        </h1>

        <p className="mb-8 text-center text-muted-foreground">
          Convert XML data into clean Markdown format.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">XML Input</label>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`<root>
  <name>QuickHub</name>
  <tools>100</tools>
  <active>true</active>
</root>`}
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
