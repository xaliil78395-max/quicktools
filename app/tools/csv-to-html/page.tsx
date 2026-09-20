"use client";

import { useState } from "react";

function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    const next = csv[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        i++;
      }

      row.push(field);
      field = "";

      if (row.some((value) => value.trim() !== "")) {
        rows.push(row);
      }

      row = [];
    } else {
      field += char;
    }
  }

  if (field !== "" || row.length > 0) {
    row.push(field);

    if (row.some((value) => value.trim() !== "")) {
      rows.push(row);
    }
  }

  return rows;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function csvToHtml(csv: string) {
  if (!csv.trim()) {
    throw new Error("Please enter CSV data.");
  }

  const rows = parseCsv(csv);

  if (rows.length < 2) {
    throw new Error("Please provide a header row and at least one data row.");
  }

  const columnCount = rows[0].length;

  if (columnCount === 0) {
    throw new Error("No CSV columns were found.");
  }

  const headers = rows[0].map((header, index) =>
    header.trim() || `Column ${index + 1}`
  );

  const headerHtml = headers
    .map((header) => `      <th>${escapeHtml(header)}</th>`)
    .join("\n");

  const bodyHtml = rows
    .slice(1)
    .map((row) => {
      const cells = Array.from(
        { length: columnCount },
        (_, index) => row[index] ?? ""
      );

      return `    <tr>\n${cells
        .map((cell) => `      <td>${escapeHtml(cell)}</td>`)
        .join("\n")}\n    </tr>`;
    })
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

export default function CsvToHtmlPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setOutput(csvToHtml(input));
      setError("");
    } catch (err) {
      setOutput("");
      setError(
        err instanceof Error ? err.message : "Unable to convert CSV."
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
  <title>CSV Table</title>
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
          CSV to HTML Converter
        </h1>

        <p className="mb-8 text-center text-muted-foreground">
          Convert CSV data into a clean HTML table.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">CSV Input</label>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`name,tools,active
QuickHub,100,true
Example,50,false`}
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
