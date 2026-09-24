"use client";

import { useState } from "react";
import Link from "next/link";
import * as XLSX from "xlsx";
import RelatedTools from "@/components/RelatedTools";

export default function ExcelToJsonPage() {
  const [json, setJson] = useState("");
  const [error, setError] = useState("");

  const convertFile = async (file: File) => {
    setError("");
    setJson("");

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });

      const firstSheetName = workbook.SheetNames[0];

      if (!firstSheetName) {
        setError("No worksheet found in the Excel file.");
        return;
      }

      const worksheet = workbook.Sheets[firstSheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
      });

      setJson(JSON.stringify(data, null, 2));
    } catch {
      setError("Unable to convert the Excel file to JSON.");
    }
  };

  const copyJson = async () => {
    if (!json) return;
    await navigator.clipboard.writeText(json);
  };

  const downloadJson = () => {
    if (!json) return;

    const blob = new Blob([json], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "quickhub-excel-to-json.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setJson("");
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
        <h1 className="text-3xl font-bold">Excel to JSON Converter</h1>
        <p className="mt-2 text-muted-foreground">
          Convert Excel XLSX or XLS files to JSON directly in your browser.
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
              if (file) convertFile(file);
            }}
            className="w-full rounded-lg border border-border bg-background p-3"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {json && (
          <div>
            <label className="mb-2 block text-sm font-medium">
              JSON Output
            </label>

            <textarea
              value={json}
              readOnly
              className="min-h-[350px] w-full rounded-lg border border-border bg-background p-4 font-mono text-sm outline-none"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={copyJson}
            disabled={!json}
            className="rounded-lg border border-primary bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Copy JSON
          </button>

          <button
            onClick={downloadJson}
            disabled={!json}
            className="rounded-lg border border-primary bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Download JSON
          </button>

          <button
            onClick={clearAll}
            className="rounded-lg border border-border px-5 py-2.5 font-medium hover:bg-muted"
          >
            Clear
          </button>
        </div>

        <RelatedTools currentTool="excel-to-json" />

        <div className="mt-10 min-h-[90px] rounded-lg border border-border p-4 text-center text-sm text-muted-foreground">
          Advertisement
        </div>
      </div>
    </main>
  );
}
