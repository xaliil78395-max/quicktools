"use client";


import AdsterraAd from "@/components/AdsterraAd";
import Link from "next/link";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PdfSplitterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [range, setRange] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] || null;

    if (!selectedFile) {
      setFile(null);
      setPageCount(0);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setFile(null);
      setPageCount(0);
      setMessage("Please select a PDF file.");
      return;
    }

    try {
      const bytes = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      setFile(selectedFile);
      setPageCount(pdf.getPageCount());
      setRange("");
      setMessage("");
    } catch {
      setFile(null);
      setPageCount(0);
      setMessage("Unable to read this PDF file.");
    }
  }

  async function splitPdf() {
    if (!file || !range.trim()) return;

    setLoading(true);
    setMessage("");

    try {
      const sourceBytes = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(sourceBytes);
      const selectedPages = parsePageRange(range, sourcePdf.getPageCount());

      if (selectedPages.length === 0) {
        throw new Error("Please enter a valid page range.");
      }

      const outputPdf = await PDFDocument.create();
      const pages = await outputPdf.copyPages(sourcePdf, selectedPages);

      pages.forEach((page) => outputPdf.addPage(page));

      const pdfBytes = await outputPdf.save();
      const blob = new Blob([pdfBytes as BlobPart], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = file.name.replace(/\.pdf$/i, "") + "-split.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setMessage(
        `${selectedPages.length} page${selectedPages.length > 1 ? "s" : ""} extracted successfully. Your PDF is downloading.`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to split this PDF. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setFile(null);
    setPageCount(0);
    setRange("");
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Back to QuickTools
        </Link>


        <AdsterraAd />
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              PDF Splitter
            </h1>
            <p className="mt-2 text-slate-600">
              Extract selected pages from a PDF into a new document quickly
              and easily.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <label className="block cursor-pointer">
              <div className="text-lg font-semibold text-slate-800">
                {file ? file.name : "Choose a PDF file"}
              </div>

              <p className="mt-2 text-sm text-slate-500">
                {file
                  ? `${(file.size / 1024 / 1024).toFixed(2)} MB • ${pageCount} page${pageCount !== 1 ? "s" : ""}`
                  : "Upload a PDF and choose the pages you want to extract"}
              </p>

              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              <span className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700">
                {file ? "Choose Another PDF" : "Choose PDF"}
              </span>
            </label>
          </div>

          {file && (
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <label
                htmlFor="page-range"
                className="block text-sm font-semibold text-slate-700"
              >
                Pages to extract
              </label>

              <input
                id="page-range"
                type="text"
                value={range}
                onChange={(event) => setRange(event.target.value)}
                placeholder="Examples: 1-3, 5, 7-9"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <p className="mt-2 text-sm text-slate-500">
                Enter individual pages or ranges separated by commas.
              </p>
            </div>
          )}

          {message && (
            <div className="mt-5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
              {message}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={splitPdf}
              disabled={!file || !range.trim() || loading}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Splitting..." : "Split PDF"}
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </button>
          </div>
        </section>


<section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold">Split PDF Online</h2>

          <p className="mt-3 leading-7 text-slate-600">
            Extract specific pages from a PDF and create a new PDF document
            directly in your browser. Your file is processed locally without
            uploading it to a server.
          </p>
        </section>
      </div>
    </main>
  );
}

function parsePageRange(value: string, totalPages: number): number[] {
  const pages = new Set<number>();

  for (const part of value.split(",")) {
    const trimmed = part.trim();

    if (!trimmed) continue;

    if (/^\d+$/.test(trimmed)) {
      const page = Number(trimmed);

      if (page < 1 || page > totalPages) {
        throw new Error(`Page ${page} is outside the PDF page range.`);
      }

      pages.add(page - 1);
      continue;
    }

    const match = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);

    if (!match) {
      throw new Error("Use a format such as 1-3, 5, 7-9.");
    }

    const start = Number(match[1]);
    const end = Number(match[2]);

    if (
      start < 1 ||
      end < 1 ||
      start > totalPages ||
      end > totalPages ||
      start > end
    ) {
      throw new Error("One of the page ranges is invalid.");
    }

    for (let page = start; page <= end; page++) {
      pages.add(page - 1);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}



