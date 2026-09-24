"use client";

import { useState } from "react";
import Link from "next/link";
import * as XLSX from "xlsx";
import RelatedTools from "@/components/RelatedTools";

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
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
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
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

      if (row.some((value) => value.trim() !== "")) {
        rows.push(row);
      }

      row = [];
    } else {
      current += char;
    }
  }

  if (current !== "" || row.length > 0) {
    row.push(current);

    if (row.some((value) => value.trim() !== "")) {
      rows.push(row);
    }
  }

  return rows;
}

export default function CsvToExcelPage() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const convertAndDownload = () => {
    setError("");

    if (!input.trim()) {
      setError("Please enter CSV data first.");
      return;
    }

    try {
      const rows = parseCsv(input);

      if (rows.length === 0) {
        setError("No CSV data found.");
        return;
      }

      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

      XLSX.writeFile(workbook, "quickhub-csv-to-excel.xlsx");
    } catch {
      setError("Unable to convert the CSV data to Excel.");
    }
  };

  const clearAll = () => {
    setInput("");
    setError("");
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          ← Back
        </Link>

        <Link
          href="/"
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Home
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">CSV to Excel Converter</h1>
        <p className="mt-2 text-muted-foreground">
          Convert CSV data to an Excel XLSX file directly in your browser.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">
            CSV Input
          </label>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"Name,Age,City\nAli,25,Dakar\nJohn,30,London"}
            className="min-h-[300px] w-full rounded-lg border border-border bg-background p-4 font-mono text-sm outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={convertAndDownload}
            className="rounded-lg border border-primary bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90"
          >
            Convert & Download Excel
          </button>

          <button
            onClick={clearAll}
            className="rounded-lg border border-border px-5 py-2.5 font-medium hover:bg-muted"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <RelatedTools currentTool="csv-to-excel" />

        <div className="mt-10 min-h-[90px] rounded-lg border border-border p-4 text-center text-sm text-muted-foreground">
          Advertisement
        </div>
      </div>
    </main>
  );
}
