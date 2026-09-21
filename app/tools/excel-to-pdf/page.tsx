"use client";
import RelatedTools from "@/components/RelatedTools";

import Link from 'next/link';

import { useState } from "react";
import AdsterraAd from "@/components/AdsterraAd";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";

type SheetData = {
  name: string;
  rows: string[][];
};

export default function ExcelToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(selectedFile: File | undefined) {
    if (!selectedFile) return;

    setError("");
    setFile(null);
    setSheets([]);

    if (!/\.(xlsx|xls|csv)$/i.test(selectedFile.name)) {
      setError("Please select an Excel .xlsx, .xls, or CSV file.");
      return;
    }

    try {
      const buffer = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });

      const extractedSheets: SheetData[] = workbook.SheetNames.map(
        (sheetName) => {
          const worksheet = workbook.Sheets[sheetName];

          const rows = XLSX.utils.sheet_to_json<string[]>(worksheet, {
            header: 1,
            raw: false,
            defval: "",
          });

          return {
            name: sheetName,
            rows: rows.map((row) =>
              row.map((cell) => String(cell ?? ""))
            ),
          };
        }
      ).filter((sheet) => sheet.rows.length > 0);

      if (!extractedSheets.length) {
        setError("The spreadsheet appears to be empty.");
        return;
      }

      setFile(selectedFile);
      setSheets(extractedSheets);
    } catch {
      setError(
        "The spreadsheet could not be read. Please make sure it is a valid Excel or CSV file."
      );
    }
  }

  function clearFile() {
    setFile(null);
    setSheets([]);
    setError("");
  }

  function createPdf() {
    if (!file || !sheets.length) {
      setError("Please select an Excel file first.");
      return;
    }

    setIsConverting(true);
    setError("");

    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 10;
      const usableWidth = pageWidth - margin * 2;
      const usableHeight = pageHeight - margin * 2;

      sheets.forEach((sheet, sheetIndex) => {
        if (sheetIndex > 0) {
          pdf.addPage();
        }

        const rows = sheet.rows;
        const maxColumns = Math.max(
          1,
          ...rows.map((row) => row.length)
        );

        const columnWidth = usableWidth / maxColumns;
        const fontSize = maxColumns > 8 ? 6 : maxColumns > 5 ? 7 : 8;
        const rowHeight = Math.max(6, fontSize * 0.9);

        let y = margin + 8;

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(13);
        pdf.text(sheet.name, margin, margin);

        pdf.setFontSize(fontSize);

        rows.forEach((row, rowIndex) => {
          if (y + rowHeight > pageHeight - margin) {
            pdf.addPage();
            y = margin;

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(13);
            pdf.text(`${sheet.name} (continued)`, margin, y);
            y += 8;

            pdf.setFontSize(fontSize);
          }

          const isHeader = rowIndex === 0;

          if (isHeader) {
            pdf.setFillColor(238, 242, 255);
            pdf.rect(
              margin,
              y - rowHeight + 1,
              usableWidth,
              rowHeight,
              "F"
            );
            pdf.setFont("helvetica", "bold");
          } else {
            pdf.setFont("helvetica", "normal");
          }

          for (let columnIndex = 0; columnIndex < maxColumns; columnIndex++) {
            const value = row[columnIndex] ?? "";

            const x = margin + columnIndex * columnWidth;

            pdf.setDrawColor(200, 200, 200);
            pdf.rect(x, y - rowHeight + 1, columnWidth, rowHeight);

            const text = value.length > 35
              ? `${value.slice(0, 32)}...`
              : value;

            pdf.text(text, x + 1.5, y - 2, {
              maxWidth: Math.max(1, columnWidth - 3),
            });
          }

          y += rowHeight;
        });
      });

      const baseName = file.name.replace(
        /\.(xlsx|xls|csv)$/i,
        ""
      );

      pdf.save(`${baseName}.pdf`);
    } catch {
      setError(
        "The PDF could not be created. Please try another spreadsheet."
      );
    } finally {
      setIsConverting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white"><div className="flex items-center justify-between w-full mb-8"><Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">← Back</Link><Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Home</Link></div>
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-400">
            QuickHub PDF Tools
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Excel to PDF Converter
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Convert Excel spreadsheets to PDF directly in your browser.
            No upload, account, or paid API is required.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <label
            htmlFor="excel-file"
            className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/50 px-6 text-center transition hover:border-indigo-500"
          >
            <div className="mb-4 text-5xl">📊</div>

            <span className="text-lg font-semibold">
              {file ? file.name : "Drop an Excel file here"}
            </span>

            <span className="mt-2 text-sm text-slate-400">
              or click to choose XLSX, XLS, or CSV
            </span>

            <input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
              className="hidden"
              onChange={(event) => {
                void handleFile(event.target.files?.[0]);
                event.currentTarget.value = "";
              }}
            />
          </label>

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {file && sheets.length > 0 && (
            <div className="mt-8">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">
                    Spreadsheet Preview
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {file.name} · {sheets.length} sheet
                    {sheets.length === 1 ? "" : "s"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={clearFile}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-6">
                {sheets.map((sheet) => (
                  <div
                    key={sheet.name}
                    className="overflow-hidden rounded-xl border border-slate-700 bg-white text-black"
                  >
                    <div className="border-b border-slate-200 bg-slate-100 px-4 py-3 font-semibold">
                      {sheet.name}
                    </div>

                    <div className="max-h-96 overflow-auto">
                      <table className="w-full border-collapse text-sm">
                        <tbody>
                          {sheet.rows.slice(0, 30).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className={`border border-slate-200 px-3 py-2 ${
                                    rowIndex === 0
                                      ? "bg-indigo-50 font-semibold"
                                      : ""
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {sheet.rows.length > 30 && (
                      <p className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
                        Preview shows the first 30 rows. The PDF includes all
                        rows.
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={createPdf}
                disabled={isConverting}
                className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isConverting
                  ? "Creating PDF..."
                  : "Convert to PDF"}
              </button>
            </div>
          )}
        </section>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">
            How to convert Excel to PDF
          </h2>

          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-400">
            <li>Select an Excel or CSV file.</li>
            <li>Review the spreadsheet before conversion.</li>
            <li>Click Convert to PDF.</li>
            <li>The PDF is generated directly on your device.</li>
          </ol>

          <p className="mt-5 text-xs leading-5 text-slate-500">
            Note: This converter focuses on spreadsheet data and common table
            layouts. Advanced Excel formatting, charts, formulas, macros,
            merged cells, and print settings may not reproduce exactly.
          </p>
        </section>
      </div>`r`n        <AdsterraAd />
              <RelatedTools currentTool="excel-to-pdf" />
      </main>
  );
}














