"use client";

import { useState } from "react";
import Link from "next/link";
import * as XLSX from "xlsx";
import RelatedTools from "@/components/RelatedTools";

export default function HtmlToExcelPage() {
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");

  const downloadExcel = () => {
    setError("");

    if (!html.trim()) {
      setError("Please enter HTML first.");
      return;
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const tables = Array.from(doc.querySelectorAll("table"));

      if (tables.length === 0) {
        setError("No HTML table found.");
        return;
      }

      const workbook = XLSX.utils.book_new();

      tables.forEach((table, index) => {
        const worksheet = XLSX.utils.table_to_sheet(table);
        const sheetName = `Table ${index + 1}`;
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      });

      XLSX.writeFile(workbook, "quickhub-html-to-excel.xlsx");
    } catch {
      setError("Unable to convert the HTML to Excel.");
    }
  };

  const clearAll = () => {
    setHtml("");
    setError("");
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          ← Back
        </Link>

        <Link
          href="/"
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Home
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">HTML to Excel Converter</h1>
        <p className="mt-2 text-muted-foreground">
          Convert HTML tables to an Excel XLSX file directly in your browser.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">
            HTML Input
          </label>

          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="<table>...</table>"
            className="min-h-[300px] w-full rounded-lg border bg-background p-4 font-mono text-sm outline-none focus:ring-2"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={downloadExcel}
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

        <RelatedTools currentTool="html-to-excel" />

        <div className="mt-10 min-h-[90px] rounded-lg border p-4 text-center text-sm text-muted-foreground">
          Advertisement
        </div>
      </div>
    </main>
  );
}

