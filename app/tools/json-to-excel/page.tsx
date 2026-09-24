"use client";

import { useState } from "react";
import Link from "next/link";
import * as XLSX from "xlsx";
import RelatedTools from "@/components/RelatedTools";

export default function JsonToExcelPage() {
  const [jsonText, setJsonText] = useState("");
  const [status, setStatus] = useState("");

  const convertToExcel = () => {
    setStatus("");

    if (!jsonText.trim()) {
      setStatus("Please enter JSON data.");
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);

      if (!Array.isArray(parsed)) {
        setStatus("JSON must contain an array of objects.");
        return;
      }

      if (parsed.length === 0) {
        setStatus("The JSON array is empty.");
        return;
      }

      if (
        !parsed.every(
          (item) =>
            item !== null &&
            typeof item === "object" &&
            !Array.isArray(item)
        )
      ) {
        setStatus("JSON must be an array of objects.");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(parsed);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
      XLSX.writeFile(workbook, "quickhub-json-to-excel.xlsx");

      setStatus("Excel file created successfully.");
    } catch {
      setStatus("Invalid JSON. Please check your data.");
    }
  };

  const clearAll = () => {
    setJsonText("");
    setStatus("");
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            ← Back
          </Link>

          <Link
            href="/"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Home
          </Link>
        </div>

        <h1 className="mb-2 text-3xl font-bold">JSON to Excel Converter</h1>

        <p className="mb-6 text-muted-foreground">
          Convert JSON data into an Excel spreadsheet directly in your browser.
        </p>

        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder={`[
  {
    "Name": "Ali",
    "Age": 25,
    "City": "Dakar"
  },
  {
    "Name": "John",
    "Age": 30,
    "City": "London"
  }
]`}
          className="min-h-[320px] w-full rounded-lg border bg-background p-4 font-mono text-sm outline-none focus:ring-2"
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={convertToExcel}
            className="rounded-md border px-4 py-2 font-medium hover:bg-muted"
          >
            Convert to Excel
          </button>

          <button
            onClick={clearAll}
            className="rounded-md border px-4 py-2 font-medium hover:bg-muted"
          >
            Clear
          </button>
        </div>

        {status && (
          <p className="mt-4 rounded-md border p-3 text-sm">{status}</p>
        )}

        <RelatedTools currentTool="json-to-excel" />

        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          Advertisement
        </div>
      </div>
    </main>
  );
}
