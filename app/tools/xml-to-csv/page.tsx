"use client";
import RelatedTools from "@/components/RelatedTools";

import { useState } from "react";

function xmlNodeToValue(node: Element): unknown {
  const children = Array.from(node.children);

  if (children.length === 0) {
    return node.textContent?.trim() ?? "";
  }

  const result: Record<string, unknown> = {};

  for (const child of children) {
    const value = xmlNodeToValue(child);

    if (result[child.tagName] !== undefined) {
      if (Array.isArray(result[child.tagName])) {
        (result[child.tagName] as unknown[]).push(value);
      } else {
        result[child.tagName] = [result[child.tagName], value];
      }
    } else {
      result[child.tagName] = value;
    }
  }

  return result;
}

function flattenRecord(
  value: Record<string, unknown>,
  prefix = ""
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, item] of Object.entries(value)) {
    const column = prefix ? `${prefix}.${key}` : key;

    if (
      item !== null &&
      typeof item === "object" &&
      !Array.isArray(item)
    ) {
      Object.assign(
        result,
        flattenRecord(item as Record<string, unknown>, column)
      );
    } else if (Array.isArray(item)) {
      result[column] = item
        .map((entry) =>
          entry !== null && typeof entry === "object"
            ? JSON.stringify(entry)
            : String(entry ?? "")
        )
        .join("; ");
    } else {
      result[column] = item === null ? "" : String(item);
    }
  }

  return result;
}

function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

function xmlToCsv(input: string): string {
  const parser = new DOMParser();
  const document = parser.parseFromString(input, "application/xml");

  const parserError = document.querySelector("parsererror");

  if (parserError) {
    throw new Error("Invalid XML.");
  }

  const root = document.documentElement;

  if (!root) {
    throw new Error("No XML data found.");
  }

  const children = Array.from(root.children);

  if (!children.length) {
    throw new Error("XML must contain data elements.");
  }

  const firstTag = children[0].tagName;
  const isList = children.every(
    (child) => child.tagName === firstTag
  );

  let rows: Record<string, string>[];

  if (isList) {
    rows = children.map((child) => {
      const value = xmlNodeToValue(child);

      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        return flattenRecord(value as Record<string, unknown>);
      }

      return { value: String(value ?? "") };
    });
  } else {
    const value = xmlNodeToValue(root);

    if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      rows = [
        flattenRecord(value as Record<string, unknown>),
      ];
    } else {
      rows = [{ value: String(value ?? "") }];
    }
  }

  if (!rows.length) {
    throw new Error("No XML records found.");
  }

  const headers = Array.from(
    new Set(rows.flatMap((row) => Object.keys(row)))
  );

  return [
    headers.map(escapeCsv).join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCsv(row[header] ?? "")).join(",")
    ),
  ].join("\n");
}

export default function XmlToCsvPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setError("");
      setOutput(xmlToCsv(input));
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "Invalid XML.");
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
          XML to CSV Converter
        </h1>

        <p className="mb-6 text-muted-foreground">
          Convert XML data into CSV format directly in your browser.
        </p>

        <div className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`<?xml version="1.0" encoding="UTF-8"?>
<root>
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
    <RelatedTools currentTool="xml-to-csv" />
</main>
  );
}


