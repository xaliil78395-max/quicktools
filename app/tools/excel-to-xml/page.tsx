"use client";

import { useState } from "react";
import Link from "next/link";
import * as XLSX from "xlsx";
import RelatedTools from "@/components/RelatedTools";

const escapeXml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export default function ExcelToXmlPage() {
  const [xml, setXml] = useState("");
  const [error, setError] = useState("");

  const convertFile = async (file: File) => {
    setError("");
    setXml("");

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];

      if (!firstSheetName) {
        setError("No worksheet found in the Excel file.");
        return;
      }

      const worksheet = workbook.Sheets[firstSheetName];

      const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
        header: 1,
        defval: "",
      });

      if (rows.length === 0) {
        setError("The Excel worksheet is empty.");
        return;
      }

      const headerRow = rows[0] as unknown[];
      const dataRows = rows.slice(1) as unknown[][];

      const headers = headerRow.map((header, index) => {
        const value = String(header ?? "").trim();
        return value || `Column${index + 1}`;
      });

      const root =
        firstSheetName
          .replace(/[^A-Za-z0-9_-]/g, "_")
          .replace(/^[^A-Za-z_]/, "_") || "Sheet1";

      const lines: string[] = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        `<${root}>`,
      ];

      dataRows.forEach((row) => {
        lines.push("  <row>");

        headers.forEach((header, index) => {
          const tag =
            header
              .replace(/[^A-Za-z0-9_-]/g, "_")
              .replace(/^[^A-Za-z_]/, "_") || `Column${index + 1}`;

          lines.push(
            `    <${tag}>${escapeXml(row[index])}</${tag}>`
          );
        });

        lines.push("  </row>");
      });

      lines.push(`</${root}>`);
      setXml(lines.join("\n"));
    } catch {
      setError("Unable to convert the Excel file to XML.");
    }
  };

  const copyXml = async () => {
    if (!xml) return;
    await navigator.clipboard.writeText(xml);
  };

  const downloadXml = () => {
    if (!xml) return;

    const blob = new Blob([xml], {
      type: "application/xml",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "quickhub-excel-to-xml.xml";
    link.click();

    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setXml("");
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
        <h1 className="text-3xl font-bold">Excel to XML Converter</h1>
        <p className="mt-2 text-muted-foreground">
          Convert Excel XLSX or XLS files to XML directly in your browser.
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

        {xml && (
          <div>
            <label className="mb-2 block text-sm font-medium">
              XML Output
            </label>

            <textarea
              value={xml}
              readOnly
              className="min-h-[400px] w-full rounded-lg border border-border bg-background p-4 font-mono text-sm outline-none"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={copyXml}
            disabled={!xml}
            className="rounded-lg border border-primary bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Copy XML
          </button>

          <button
            onClick={downloadXml}
            disabled={!xml}
            className="rounded-lg border border-primary bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Download XML
          </button>

          <button
            onClick={clearAll}
            className="rounded-lg border border-border px-5 py-2.5 font-medium hover:bg-muted"
          >
            Clear
          </button>
        </div>

        <RelatedTools currentTool="excel-to-xml" />

        <div className="mt-10 min-h-[90px] rounded-lg border border-border p-4 text-center text-sm text-muted-foreground">
          Advertisement
        </div>
      </div>
    </main>
  );
}
