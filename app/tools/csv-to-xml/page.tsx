"use client";

import { useState } from "react";

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

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
      if (char === "\r" && csv[i + 1] === "\n") {
        i++;
      }

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

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function safeXmlTag(value: string): string {
  let tag = value.trim().replace(/[^a-zA-Z0-9_.-]/g, "_");

  if (!tag) tag = "field";
  if (!/^[a-zA-Z_]/.test(tag)) tag = `field_${tag}`;

  return tag;
}

function csvToXml(csv: string): string {
  const rows = parseCsv(csv);

  if (rows.length < 2) {
    throw new Error("Please provide CSV with a header row and at least one data row.");
  }

  const headers = rows[0].map((header, index) => {
    const value = header.trim();
    return value || `column_${index + 1}`;
  });

  const uniqueHeaders = new Set(headers.map(safeXmlTag));

  if (uniqueHeaders.size !== headers.length) {
    throw new Error("CSV headers must be unique after XML tag conversion.");
  }

  const items = rows.slice(1).map((row) => {
    const fields = headers
      .map((header, index) => {
        const tag = safeXmlTag(header);
        const value = row[index] ?? "";

        return `      <${tag}>${escapeXml(value)}</${tag}>`;
      })
      .join("\n");

    return `    <item>\n${fields}\n    </item>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<root>
${items.join("\n")}
</root>`;
}

export default function CsvToXmlPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setError("");
      setOutput(csvToXml(input));
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "Invalid CSV data.");
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
          CSV to XML Converter
        </h1>

        <p className="mb-6 text-center text-muted-foreground">
          Convert CSV data to XML format
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <section>
            <label className="mb-2 block font-semibold">CSV Input</label>

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

