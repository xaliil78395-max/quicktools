"use client";
import RelatedTools from "@/components/RelatedTools";

import { useState } from "react";

function parseScalar(value: string): unknown {
  const trimmed = value.trim();

  if (!trimmed) return "";

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null" || trimmed === "~") return null;

  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((item) => parseScalar(item));
  }

  return trimmed;
}

function stripComment(line: string) {
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

function parseYaml(yaml: string): unknown {
  const lines = yaml
    .split(/\r?\n/)
    .map(stripComment)
    .map((line) => line.replace(/\t/g, "    "))
    .filter((line) => line.trim() !== "");

  if (lines.length === 0) {
    throw new Error("Please enter YAML data.");
  }

  const firstContent = lines[0].trim();

  if (firstContent.startsWith("- ")) {
    return parseYamlList(lines);
  }

  return parseYamlObject(lines);
}

function parseYamlObject(lines: string[]): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  const stack: Array<{
    indent: number;
    object: Record<string, unknown>;
  }> = [{ indent: -1, object: root }];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const indent = line.length - line.trimStart().length;

    if (trimmed.startsWith("- ")) {
      continue;
    }

    const colonIndex = trimmed.indexOf(":");

    if (colonIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, colonIndex).trim();
    const rawValue = trimmed.slice(colonIndex + 1).trim();

    while (
      stack.length > 1 &&
      indent <= stack[stack.length - 1].indent
    ) {
      stack.pop();
    }

    const current = stack[stack.length - 1].object;

    if (rawValue) {
      current[key] = parseScalar(rawValue);
      continue;
    }

    const nextLine = lines[i + 1];
    const nextTrimmed = nextLine?.trim() ?? "";

    if (nextTrimmed.startsWith("- ")) {
      const array: unknown[] = [];
      current[key] = array;

      let j = i + 1;

      while (j < lines.length) {
        const itemLine = lines[j];
        const itemTrimmed = itemLine.trim();
        const itemIndent =
          itemLine.length - itemLine.trimStart().length;

        if (itemIndent <= indent || !itemTrimmed.startsWith("- ")) {
          break;
        }

        const itemContent = itemTrimmed.slice(2).trim();

        if (itemContent.includes(":")) {
          const itemObject: Record<string, unknown> = {};
          const firstColon = itemContent.indexOf(":");
          const itemKey = itemContent.slice(0, firstColon).trim();
          const itemValue = itemContent.slice(firstColon + 1).trim();

          itemObject[itemKey] = itemValue
            ? parseScalar(itemValue)
            : "";

          let k = j + 1;

          while (k < lines.length) {
            const nestedLine = lines[k];
            const nestedTrimmed = nestedLine.trim();
            const nestedIndent =
              nestedLine.length - nestedLine.trimStart().length;

            if (
              nestedIndent <= itemIndent ||
              nestedTrimmed.startsWith("- ")
            ) {
              break;
            }

            const nestedColon = nestedTrimmed.indexOf(":");

            if (nestedColon !== -1) {
              const nestedKey = nestedTrimmed
                .slice(0, nestedColon)
                .trim();
              const nestedValue = nestedTrimmed
                .slice(nestedColon + 1)
                .trim();

              itemObject[nestedKey] = nestedValue
                ? parseScalar(nestedValue)
                : "";
            }

            k++;
          }

          array.push(itemObject);
          j = k;
        } else {
          array.push(parseScalar(itemContent));
          j++;
        }
      }

      i = j - 1;
    } else {
      const child: Record<string, unknown> = {};
      current[key] = child;
      stack.push({ indent, object: child });
    }
  }

  return root;
}

function parseYamlList(lines: string[]) {
  const result: Record<string, unknown>[] = [];

  let current: Record<string, unknown> | null = null;
  let currentIndent = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    const indent = line.length - line.trimStart().length;

    if (trimmed.startsWith("- ")) {
      if (current) {
        result.push(current);
      }

      current = {};
      currentIndent = indent;

      const content = trimmed.slice(2).trim();
      const colonIndex = content.indexOf(":");

      if (colonIndex !== -1) {
        const key = content.slice(0, colonIndex).trim();
        const value = content.slice(colonIndex + 1).trim();
        current[key] = value ? parseScalar(value) : "";
      } else if (content) {
        current.value = parseScalar(content);
      }
    } else if (current && indent > currentIndent) {
      const colonIndex = trimmed.indexOf(":");

      if (colonIndex !== -1) {
        const key = trimmed.slice(0, colonIndex).trim();
        const value = trimmed.slice(colonIndex + 1).trim();
        current[key] = value ? parseScalar(value) : "";
      }
    }
  }

  if (current) {
    result.push(current);
  }

  return result;
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function valueToHtml(value: unknown): string {
  if (Array.isArray(value)) {
    if (
      value.length > 0 &&
      value.every(
        (item) =>
          item !== null &&
          typeof item === "object" &&
          !Array.isArray(item)
      )
    ) {
      const objects = value as Record<string, unknown>[];
      const columns = Array.from(
        new Set(objects.flatMap((item) => Object.keys(item)))
      );

      const header = columns
        .map((column) => `      <th>${escapeHtml(column)}</th>`)
        .join("\n");

      const body = objects
        .map(
          (item) =>
            `    <tr>\n${columns
              .map(
                (column) =>
                  `      <td>${escapeHtml(item[column])}</td>`
              )
              .join("\n")}\n    </tr>`
        )
        .join("\n");

      return `<table>
  <thead>
    <tr>
${header}
    </tr>
  </thead>
  <tbody>
${body}
  </tbody>
</table>`;
    }

    return `<ul>\n${value
      .map((item) => `  <li>${valueToHtml(item)}</li>`)
      .join("\n")}\n</ul>`;
  }

  if (value !== null && typeof value === "object") {
    const object = value as Record<string, unknown>;

    return `<div class="yaml-object">\n${Object.entries(object)
      .map(
        ([key, item]) =>
          `  <div class="yaml-field"><strong>${escapeHtml(
            key
          )}</strong>: ${valueToHtml(item)}</div>`
      )
      .join("\n")}\n</div>`;
  }

  return escapeHtml(value);
}

function yamlToHtml(yaml: string) {
  const data = parseYaml(yaml);
  return `<div class="yaml-container">\n${valueToHtml(data)}\n</div>`;
}

export default function YamlToHtmlPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setOutput(yamlToHtml(input));
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

  const downloadHtml = () => {
    if (!output) return;

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YAML to HTML</title>
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
          YAML to HTML Converter
        </h1>

        <p className="mb-8 text-center text-muted-foreground">
          Convert YAML data into clean HTML.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">YAML Input</label>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`name: QuickHub
tools: 100
active: true
tags:
  - tools
  - web`}
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
            <RelatedTools currentTool="yaml-to-html" />
      </main>
  );
}

