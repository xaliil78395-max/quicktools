"use client";

import Link from 'next/link';

import { useState } from "react";
import AdsterraAd from "@/components/AdsterraAd";
import { PDFDocument } from "pdf-lib";

export default function PDFPageExtractorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pages, setPages] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (selectedFile: File) => {
    setError("");
    setFile(null);
    setPageCount(0);
    setPages("");

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a PDF file.");
      return;
    }

    try {
      const bytes = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, {
        ignoreEncryption: false,
      });

      setFile(selectedFile);
      setPageCount(pdf.getPageCount());
    } catch {
      setError(
        "The PDF could not be opened. It may be damaged, encrypted, or unsupported."
      );
    }
  };

  const parsePageSelection = (value: string, total: number) => {
    const selected = new Set<number>();

    for (const part of value.split(",")) {
      const item = part.trim();

      if (!item) continue;

      if (item.includes("-")) {
        const [startText, endText] = item.split("-").map((v) => v.trim());
        const start = Number(startText);
        const end = Number(endText);

        if (
          !Number.isInteger(start) ||
          !Number.isInteger(end) ||
          start < 1 ||
          end < 1 ||
          start > total ||
          end > total ||
          start > end
        ) {
          return null;
        }

        for (let page = start; page <= end; page++) {
          selected.add(page);
        }
      } else {
        const page = Number(item);

        if (
          !Number.isInteger(page) ||
          page < 1 ||
          page > total
        ) {
          return null;
        }

        selected.add(page);
      }
    }

    return Array.from(selected).sort((a, b) => a - b);
  };

  const extractPages = async () => {
    if (!file || !pages.trim()) return;

    try {
      setLoading(true);
      setError("");

      const selectedPages = parsePageSelection(pages, pageCount);

      if (!selectedPages || selectedPages.length === 0) {
        setError(
          `Please enter valid page numbers between 1 and ${pageCount}.`
        );
        return;
      }

      const sourceBytes = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(sourceBytes);

      const outputPdf = await PDFDocument.create();

      const copiedPages = await outputPdf.copyPages(
        sourcePdf,
        selectedPages.map((page) => page - 1)
      );

      copiedPages.forEach((page) => {
        outputPdf.addPage(page);
      });

      const outputBytes = await outputPdf.save();

      const pdfBuffer = new ArrayBuffer(outputBytes.byteLength);
      new Uint8Array(pdfBuffer).set(outputBytes);

      const blob = new Blob([pdfBuffer], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${file.name.replace(/\.pdf$/i, "")}-extracted.pdf`;
      link.click();

      URL.revokeObjectURL(url);
    } catch {
      setError(
        "The selected pages could not be extracted. The PDF may be encrypted or unsupported."
      );
    } finally {
      setLoading(false);
    }
  };

  const extractAll = async () => {
    if (!file || pageCount === 0) return;

    setPages(`1-${pageCount}`);

    try {
      setLoading(true);
      setError("");

      const sourceBytes = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(sourceBytes);
      const outputPdf = await PDFDocument.create();

      const copiedPages = await outputPdf.copyPages(
        sourcePdf,
        Array.from({ length: pageCount }, (_, index) => index)
      );

      copiedPages.forEach((page) => {
        outputPdf.addPage(page);
      });

      const outputBytes = await outputPdf.save();

      const pdfBuffer = new ArrayBuffer(outputBytes.byteLength);
      new Uint8Array(pdfBuffer).set(outputBytes);

      const blob = new Blob([pdfBuffer], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${file.name.replace(/\.pdf$/i, "")}-all-pages.pdf`;
      link.click();

      URL.revokeObjectURL(url);
    } catch {
      setError("The PDF could not be processed.");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setFile(null);
    setPageCount(0);
    setPages("");
    setError("");
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-white"><div className="flex items-center justify-between w-full mb-8"><Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">← Back</Link><Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Home</Link></div>
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            PDF Page Extractor
          </h1>

          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Extract selected pages from a PDF into a new PDF directly in your browser.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 p-10 text-center transition hover:border-indigo-500 dark:border-slate-700 dark:hover:border-indigo-400">
            <input
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(event) => {
                const selectedFile = event.target.files?.[0];

                if (selectedFile) {
                  handleFile(selectedFile);
                }
              }}
            />

            <div className="text-lg font-semibold">
              Choose PDF File
            </div>

            <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Select a PDF from your computer
            </div>
          </label>

          {file && (
            <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
              <div className="font-medium">
                {file.name}
              </div>

              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {pageCount} {pageCount === 1 ? "page" : "pages"} detected
              </div>
            </div>
          )}

          {file && (
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium">
                Pages to extract
              </label>

              <input
                type="text"
                value={pages}
                onChange={(event) => setPages(event.target.value)}
                placeholder="Example: 1,3,5 or 2-4"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
              />

              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Use commas for individual pages and hyphens for ranges.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={extractPages}
                  disabled={loading || !pages.trim()}
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Extracting..." : "Extract Pages"}
                </button>

                <button
                  type="button"
                  onClick={extractAll}
                  disabled={loading}
                  className="rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Download All Pages
                </button>

                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </div>
          )}

          <p className="mt-6 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Your PDF is processed locally in your browser. Password-protected
            or heavily encrypted PDFs may not be supported.
          </p>
        </div>
      </div>`r`n        <AdsterraAd />
      </main>
  );
}
















