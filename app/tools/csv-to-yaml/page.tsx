"use client";
import RelatedTools from "@/components/RelatedTools";

import { useState } from "react";

function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];

    if (char === '"') {
      if (inQuotes && csv[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && csv[i + 1] === "\n") i++;

      row.push(current);
      current = "";

      if (row.some((cell) => cell.trim() !== "")) {
        rows.push(row);
      }

      row = [];
    } else {
      current += char;
    }
  }

  row.push(current);

  if (row.some((cell) => cell.trim() !== "")) {
    rows.push(row);
  }

  return rows;
}

function parseValue(value: string): unknown {
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

  if (/^-?\d+(\.\d+)?$/.test(v)) {
    return Number(v);
  }

  return v;
}

function yamlKey(key: string): string {
  const trimmed = key.trim();

  if (/^[A-Za-z_][A-Za-z0-9_-]*$/.test(trimmed)) {
    return trimmed;
  }

  return JSON.stringify(trimmed);
}

function yamlScalar(value: unknown): string {
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);

  const text = String(value);

  if (
    text === "" ||
    /[:#,\[\]{}&*!|>'"%@`]/.test(text) ||
    text.startsWith("-") ||
    text.startsWith("?") ||
    text.startsWith(" ") ||
    text.endsWith(" ") ||
    text === "true" ||
    text === "false" ||
    text === "null" ||
    /^-?\d+(\.\d+)?$/.test(text)
  ) {
    return JSON.stringify(text);
  }

  return text;
}

function objectToYaml(value: unknown, indent = 0): string {
  const spaces = " ".repeat(indent);

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (item !== null && typeof item === "object" && !Array.isArray(item)) {
          const entries = Object.entries(item as Record<string, unknown>);

          if (entries.length === 0) {
            return `${spaces}- {}`;
          }

          const lines: string[] = [];

          entries.forEach(([key, child], index) => {
            const keyText = yamlKey(key);

            if (index === 0) {
              if (child !== null && typeof child === "object") {
                lines.push(
                  `${spaces}- ${keyText}:`,
                  objectToYaml(child, indent + 4)
                );
              } else {
                lines.push(`${spaces}- ${keyText}: ${yamlScalar(child)}`);
              }
            } else {
              if (child !== null && typeof child === "object") {
                lines.push(
                  `${" ".repeat(indent + 2)}${keyText}:`,
                  objectToYaml(child, indent + 4)
                );
              } else {
                lines.push(
                  `${" ".repeat(indent + 2)}${keyText}: ${yamlScalar(child)}`
                );
              }
            }
          });

          return lines.join("\n");
        }

        if (Array.isArray(item)) {
          return `${spaces}-\n${objectToYaml(item, indent + 2)}`;
        }

        return `${spaces}- ${yamlScalar(item)}`;
      })
      .join("\n");
  }

  if (value !== null && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, item]) => {
        const safeKey = yamlKey(key);

        if (item !== null && typeof item === "object") {
          return `${spaces}${safeKey}:\n${objectToYaml(item, indent + 2)}`;
        }

        return `${spaces}${safeKey}: ${yamlScalar(item)}`;
      })
      .join("\n");
  }

  return `${spaces}${yamlScalar(value)}`;
}
function csvToYaml(csv: string): string {
  const rows = parseCsv(csv);

  if (rows.length < 2) {
    throw new Error(
      "Please provide CSV with a header row and at least one data row."
    );
  }

  const headers = rows[0].map((header, index) => {
    const value = header.trim();
    return value || `column_${index + 1}`;
  });

  const normalizedHeaders = headers.map((header) => header.toLowerCase());

  if (new Set(normalizedHeaders).size !== normalizedHeaders.length) {
    throw new Error("CSV headers must be unique.");
  }

  const data = rows.slice(1).map((row) => {
    const object: Record<string, unknown> = {};

    headers.forEach((header, index) => {
      object[header] = parseValue(row[index] ?? "");
    });

    return object;
  });

  return objectToYaml(data);
}

export default function CsvToYamlPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setError("");
      setOutput(csvToYaml(input));
    } catch (err) {
      setOutput("");
      setError(
        err instanceof Error ? err.message : "Invalid CSV data."
      );
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  const downloadOutput = () => {
    if (!output) return;

    const blob = new Blob([output], {
      type: "text/yaml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "converted.yaml";
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
          CSV to YAML Converter
        </h1>

        <p className="mb-6 text-center text-muted-foreground">
          Convert CSV data to YAML format
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <section>
            <label className="mb-2 block font-semibold">
              CSV Input
            </label>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`name,tools,active
QuickHub,100,true
Example,50,false`}
              className="min-h-[360px] w-full rounded-xl border bg-background p-4 font-mono text-sm outline-none focus:ring-2"
            />
          </section>

          <section>
            <label className="mb-2 block font-semibold">
              YAML Output
            </label>

            <textarea
              value={output}
              readOnly
              placeholder="YAML output will appear here..."
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
            className="rounded-lg border border-primary bg-primary px-5 py-2.5 font-medium text-primary-foreground"
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
            Download YAML
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
    <RelatedTools currentTool="csv-to-yaml" />
</main>
  );
}






