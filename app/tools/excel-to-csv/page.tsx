"use client";

import { useState } from "react";
import Link from "next/link";
import * as XLSX from "xlsx";
import RelatedTools from "@/components/RelatedTools";

export default function ExcelToCsvPage() {
  const [fileName, setFileName] = useState("");
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setError("");
    setOutput("");
    setFileName(file.name);

    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });

      if (wb.SheetNames.length === 0) {
        setError("No worksheet found in the Excel file.");
        return;
      }

      setWorkbook(wb);
      setSheets(wb.SheetNames);
      setSelectedSheet(wb.SheetNames[0]);
    } catch {
      setError("Unable to read the Excel file.");
      setWorkbook(null);
      setSheets([]);
      setSelectedSheet("");
    }
  };

  const convert = () => {
    setError("");
    setOutput("");

    if (!workbook || !selectedSheet) {
      setError("Please select an Excel file first.");
      return;
    }

    try {
      const worksheet = workbook.Sheets[selectedSheet];

      if (!worksheet) {
        setError("Selected worksheet not found.");
        return;
      }

      const csv = XLSX.utils.sheet_to_csv(worksheet);

      if (!csv.trim()) {
        setError("The selected worksheet is empty.");
        return;
      }

      setOutput(csv);
    } catch {
      setError("Unable to convert the worksheet to CSV.");
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
    const a = document.createElement("a");

    a.href = url;
    a.download = "quickhub-excel-to-csv.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setFileName("");
    setSheets([]);
    setSelectedSheet("");
    setWorkbook(null);
    setOutput("");
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
        <h1 className="text-3xl font-bold">Excel to CSV Converter</h1>
        <p className="mt-2 text-muted-foreground">
          Convert Excel XLSX or XLS worksheets to CSV directly in your browser.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Excel File
          </label>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="block w-full rounded-lg border border-border bg-background p-3 text-sm"
          />

          {fileName && (
            <p className="mt-2 text-sm text-muted-foreground">
              Selected: {fileName}
            </p>
          )}
        </div>

        {sheets.length > 0 && (
          <div>
            <label className="mb-2 block text-sm font-medium">
              Worksheet
            </label>

            <select
              value={selectedSheet}
              onChange={(e) => setSelectedSheet(e.target.value)}
              className="w-full rounded-lg border border-border bg-background p-3 text-sm"
            >
              {sheets.map((sheet) => (
                <option key={sheet} value={sheet}>
                  {sheet}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={convert}
            className="rounded-lg border border-primary bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90"
          >
            Convert
          </button>

          <button
            onClick={copyOutput}
            disabled={!output}
            className="rounded-lg border border-border px-5 py-2.5 font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Copy
          </button>

          <button
            onClick={downloadCsv}
            disabled={!output}
            className="rounded-lg border border-border px-5 py-2.5 font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Download CSV
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

        <div>
          <label className="mb-2 block text-sm font-medium">
            CSV Output
          </label>

          <textarea
            value={output}
            readOnly
            placeholder="Your CSV output will appear here..."
            className="min-h-[300px] w-full rounded-lg border border-border bg-muted/30 p-4 font-mono text-sm outline-none"
          />
        </div>

        <RelatedTools currentTool="excel-to-csv" />

        <div className="mt-10 min-h-[90px] rounded-lg border border-border p-4 text-center text-sm text-muted-foreground">
          Advertisement
        </div>
      </div>
    </main>
  );
}
