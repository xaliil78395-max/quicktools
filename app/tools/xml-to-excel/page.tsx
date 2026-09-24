"use client";

import { useState } from "react";
import Link from "next/link";
import * as XLSX from "xlsx";
import RelatedTools from "@/components/RelatedTools";

export default function XmlToExcelPage() {
  const [xmlText, setXmlText] = useState("");
  const [status, setStatus] = useState("");

  const escapeXml = (value: string) =>
    value
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");

  const convertToExcel = () => {
    setStatus("");

    if (!xmlText.trim()) {
      setStatus("Please enter XML data.");
      return;
    }

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "application/xml");

      if (xmlDoc.querySelector("parsererror")) {
        setStatus("Invalid XML. Please check your XML data.");
        return;
      }

      const root = xmlDoc.documentElement;
      const rows = Array.from(root.children);

      if (rows.length === 0) {
        setStatus("No data rows found in the XML.");
        return;
      }

      const firstRowChildren = Array.from(rows[0].children);

      if (firstRowChildren.length === 0) {
        setStatus("No columns found in the XML.");
        return;
      }

      const headers = firstRowChildren.map(
        (child, index) => child.tagName || `Column${index + 1}`
      );

      const data = rows.map((row) => {
        const values = headers.map((header) => {
          const child = Array.from(row.children).find(
            (element) => element.tagName === header
          );

          return child ? (child.textContent ?? "") : "";
        });

        return values;
      });

      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
      XLSX.writeFile(workbook, "quickhub-xml-to-excel.xlsx");

      setStatus("Excel file created successfully.");
    } catch {
      setStatus("Unable to convert the XML.");
    }
  };

  const clearAll = () => {
    setXmlText("");
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

        <h1 className="mb-2 text-3xl font-bold">XML to Excel Converter</h1>
        <p className="mb-6 text-muted-foreground">
          Convert XML data into an Excel spreadsheet directly in your browser.
        </p>

        <textarea
          value={xmlText}
          onChange={(e) => setXmlText(e.target.value)}
          placeholder={`<Table_1>
  <row>
    <Name>Ali</Name>
    <Age>25</Age>
    <City>Dakar</City>
  </row>
  <row>
    <Name>John</Name>
    <Age>30</Age>
    <City>London</City>
  </row>
</Table_1>`}
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

        <RelatedTools currentTool="xml-to-excel" />

        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          Advertisement
        </div>
      </div>
    </main>
  );
}

