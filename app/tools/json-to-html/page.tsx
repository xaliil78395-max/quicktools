"use client";

import { useState } from "react";

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function valueToHtml(value: unknown): string {
  if (Array.isArray(value)) {
    return `<ul>${value
      .map((item) => `<li>${valueToHtml(item)}</li>`)
      .join("")}</ul>`;
  }

  if (value !== null && typeof value === "object") {
    return `<div class="json-object">${Object.entries(
      value as Record<string, unknown>
    )
      .map(
        ([key, item]) =>
          `<div class="json-field"><strong>${escapeHtml(
            key
          )}</strong>: ${valueToHtml(item)}</div>`
      )
      .join("")}</div>`;
  }

  return escapeHtml(value);
}

function jsonToHtml(input: string): string {
  let data: unknown;

  try {
    data = JSON.parse(input);
  } catch {
    throw new Error("Invalid JSON.");
  }

  return `<div class="json-container">${valueToHtml(data)}</div>`;
}

export default function JsonToHtmlPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setError("");
      setOutput(jsonToHtml(input));
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "Invalid JSON.");
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  const downloadHtml = () => {
    if (!output) return;

    const htmlDocument = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>JSON Converted HTML</title>
</head>
<body>
${output}
</body>
</html>`;

    const blob = new Blob([htmlDocument], {
      type: "text/html;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "quickhub-json.html";
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
          JSON to HTML Converter
        </h1>

        <p className="mb-6 text-muted-foreground">
          Convert JSON data into structured HTML directly in your browser.
        </p>

        <div className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`{
  "name": "QuickHub",
  "tools": 100,
  "active": true
}`}
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
              onClick={downloadHtml}
              disabled={!output}
              className="rounded-md border border-border px-5 py-2.5 font-medium disabled:opacity-50"
            >
              Download HTML
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
            placeholder="HTML output will appear here..."
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
