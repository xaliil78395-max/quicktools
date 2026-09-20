"use client";

import { useState } from "react";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function xmlToRows(xml: string) {
  const parser = new DOMParser();
  const document = parser.parseFromString(xml, "application/xml");

  const parserError = document.querySelector("parsererror");

  if (parserError) {
    throw new Error("Invalid XML. Please check your XML syntax.");
  }

  const root = document.documentElement;

  if (!root) {
    throw new Error("No XML root element was found.");
  }

  const directChildren = Array.from(root.children);

  if (directChildren.length === 0) {
    throw new Error("The XML does not contain any data elements.");
  }

  const repeatedTags = new Map<string, number>();

  for (const child of directChildren) {
    repeatedTags.set(
      child.tagName,
      (repeatedTags.get(child.tagName) ?? 0) + 1
    );
  }

  const repeatedTag = Array.from(repeatedTags.entries()).find(
    ([, count]) => count > 1
  )?.[0];

  const rowElements = repeatedTag
    ? directChildren.filter((child) => child.tagName === repeatedTag)
    : directChildren;

  const getObject = (element: Element) => {
    const children = Array.from(element.children);

    if (children.length === 0) {
      return {
        [element.tagName]: element.textContent?.trim() ?? "",
      };
    }

    const object: Record<string, string> = {};

    for (const child of children) {
      const key = child.tagName;
      const value =
        child.children.length > 0
          ? Array.from(child.children)
              .map((nested) => `${nested.tagName}: ${nested.textContent?.trim() ?? ""}`)
              .join("; ")
          : child.textContent?.trim() ?? "";

      if (key in object) {
        object[key] = `${object[key]}; ${value}`;
      } else {
        object[key] = value;
      }
    }

    return object;
  };

  return rowElements.map(getObject);
}

function xmlToHtml(xml: string) {
  if (!xml.trim()) {
    throw new Error("Please enter XML data.");
  }

  const rows = xmlToRows(xml);

  if (rows.length === 0) {
    throw new Error("No XML rows were found.");
  }

  const columns = Array.from(
    new Set(rows.flatMap((row) => Object.keys(row)))
  );

  if (columns.length === 0) {
    throw new Error("No XML fields were found.");
  }

  const headerHtml = columns
    .map((column) => `      <th>${escapeHtml(column)}</th>`)
    .join("\n");

  const bodyHtml = rows
    .map(
      (row) =>
        `    <tr>\n${columns
          .map(
            (column) =>
              `      <td>${escapeHtml(row[column] ?? "")}</td>`
          )
          .join("\n")}\n    </tr>`
    )
    .join("\n");

  return `<table>
  <thead>
    <tr>
${headerHtml}
    </tr>
  </thead>
  <tbody>
${bodyHtml}
  </tbody>
</table>`;
}

export default function XmlToHtmlPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setOutput(xmlToHtml(input));
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

  const downloadHtml = () => {
    if (!output) return;

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>XML Table</title>
</head>
<body>
${output}
</body>
</html>`;

    const blob = new Blob([fullHtml], {
      type: "text/html;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.html";
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
          XML to HTML Converter
        </h1>

        <p className="mb-8 text-center text-muted-foreground">
          Convert XML data into a clean HTML table.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">XML Input</label>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`<root>
  <item>
    <name>QuickHub</name>
    <tools>100</tools>
    <active>true</active>
  </item>
  <item>
    <name>Example</name>
    <tools>50</tools>
    <active>false</active>
  </item>
</root>`}
              className="min-h-[320px] w-full rounded-lg border bg-background p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              HTML Output
            </label>

            <textarea
              value={output}
              readOnly
              placeholder="HTML output will appear here..."
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
            onClick={downloadHtml}
            className="rounded-md border px-5 py-2.5 font-medium hover:bg-muted"
          >
            Download HTML
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
