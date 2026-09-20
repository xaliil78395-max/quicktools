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

  if (
    (v.startsWith("[") && v.endsWith("]")) ||
    (v.startsWith("{") && v.endsWith("}"))
  ) {
    try {
      return JSON.parse(v);
    } catch {}
  }

  if (/^-?\d+(\.\d+)?$/.test(v)) {
    return Number(v);
  }

  return v;
}

function stripComment(line: string): string {
  let inSingle = false;
  let inDouble = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === "'" && !inDouble) inSingle = !inSingle;
    if (char === '"' && !inSingle) inDouble = !inDouble;

    if (char === "#" && !inSingle && !inDouble) {
      return line.slice(0, i);
    }
  }

  return line;
}

function yamlToObject(yaml: string): unknown {
  const lines = yaml
    .split(/\r?\n/)
    .map(stripComment)
    .filter((line) => line.trim() !== "");

  if (!lines.length) {
    throw new Error("Please enter YAML data.");
  }

  function parseBlock(start: number, indent: number): [unknown, number] {
    const isArray = lines[start].match(/^\s*-\s/);

    if (isArray) {
      const result: unknown[] = [];
      let i = start;

      while (i < lines.length) {
        const raw = lines[i];
        const currentIndent = raw.search(/\S|$/);

        if (currentIndent < indent) break;
        if (currentIndent > indent) {
          i++;
          continue;
        }

        const content = raw.trim();

        if (!content.startsWith("-")) break;

        const value = content.slice(1).trim();

        if (value === "") {
          const [nested, next] = parseBlock(i + 1, indent + 2);
          result.push(nested);
          i = next;
        } else if (value.includes(": ") || value.endsWith(":")) {
          const [nestedObject, next] = parseBlock(i, indent);
          result.push(nestedObject);
          i = next;
        } else {
          result.push(parseScalar(value));
          i++;
        }
      }

      return [result, i];
    }

    const result: Record<string, unknown> = {};
    let i = start;

    while (i < lines.length) {
      const raw = lines[i];
      const currentIndent = raw.search(/\S|$/);

      if (currentIndent < indent) break;

      if (currentIndent > indent) {
        i++;
        continue;
      }

      const content = raw.trim();

      if (content.startsWith("-")) break;

      const colon = content.indexOf(":");

      if (colon === -1) {
        throw new Error(`Invalid YAML line: ${content}`);
      }

      const key = content.slice(0, colon).trim();
      const value = content.slice(colon + 1).trim();

      if (!key) {
        throw new Error("YAML contains an empty key.");
      }

      if (value === "") {
        if (i + 1 < lines.length) {
          const nextIndent = lines[i + 1].search(/\S|$/);

          if (nextIndent > indent) {
            const [nested, next] = parseBlock(i + 1, nextIndent);
            result[key] = nested;
            i = next;
            continue;
          }
        }

        result[key] = {};
        i++;
      } else {
        result[key] = parseScalar(value);
        i++;
      }
    }

    return [result, i];
  }

  return parseBlock(0, lines[0].search(/\S|$/))[0];
}

function escapeXml(value: unknown): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function objectToXml(value: unknown, tagName = "root", level = 0): string {
  const indent = "  ".repeat(level);
  const childIndent = "  ".repeat(level + 1);

  if (Array.isArray(value)) {
    return value
      .map((item) => objectToXml(item, "item", level))
      .join("\n");
  }

  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);

    if (!entries.length) {
      return `${indent}<${tagName}></${tagName}>`;
    }

    const children = entries
      .map(([key, child]) => {
        const safeKey = key.replace(/[^a-zA-Z0-9_.-]/g, "_");

        if (Array.isArray(child)) {
          return `${childIndent}<${safeKey}>\n${child
            .map((item) => objectToXml(item, "item", level + 2))
            .join("\n")}\n${childIndent}</${safeKey}>`;
        }

        return objectToXml(child, safeKey, level + 1);
      })
      .join("\n");

    return `${indent}<${tagName}>\n${children}\n${indent}</${tagName}>`;
  }

  return `${indent}<${tagName}>${escapeXml(value)}</${tagName}>`;
}

export default function YamlToXmlPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setError("");

      const parsed = yamlToObject(input);
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n${objectToXml(parsed)}`;

      setOutput(xml);
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "Invalid YAML data.");
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  const downloadOutput = () => {
    if (!output) return;

    const blob = new Blob([output], {
      type: "application/xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "converted.xml";
    a.click();

    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <a
            href="/"
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            ← Back
          </a>

          <a
            href="/"
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Home
          </a>
        </div>

        <h1 className="mb-2 text-center text-3xl font-bold">
          YAML to XML Converter
        </h1>

        <p className="mb-6 text-center text-muted-foreground">
          Convert YAML data to XML format
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <section>
            <label className="mb-2 block font-semibold">YAML Input</label>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`name: QuickHub
tools: 100
active: true
tags:
  - tools
  - web`}
              className="min-h-[360px] w-full rounded-xl border bg-background p-4 font-mono text-sm outline-none focus:ring-2"
            />
          </section>

          <section>
            <label className="mb-2 block font-semibold">XML Output</label>

            <textarea
              value={output}
              readOnly
              placeholder="XML output will appear here..."
              className="min-h-[360px] w-full rounded-xl border bg-muted/30 p-4 font-mono text-sm outline-none"
            />
          </section>
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={convert}
            className="rounded-lg bg-primary border border-primary px-5 py-2.5 font-medium text-primary-foreground"
          >
            Convert
          </button>

          <button
            onClick={copyOutput}
            disabled={!output}
            className="rounded-lg border px-5 py-2.5 font-medium disabled:opacity-50"
          >
            Copy
          </button>

          <button
            onClick={downloadOutput}
            disabled={!output}
            className="rounded-lg border px-5 py-2.5 font-medium disabled:opacity-50"
          >
            Download XML
          </button>

          <button
            onClick={clearAll}
            className="rounded-lg border px-5 py-2.5 font-medium"
          >
            Clear
          </button>
        </div>

        <div className="mt-10 min-h-[90px]">
          <div id="container-ads" />
        </div>
      </div>
    </main>
  );
}

