"use client";

import Link from "next/link";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PdfMergerPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []).filter(
      (file) => file.type === "application/pdf",
    );

    if (selected.length === 0) {
      setFiles([]);
      setMessage("Please select one or more PDF files.");
      return;
    }

    setFiles(selected);
    setMessage("");
  }

  async function mergePdfs() {
    if (files.length < 2) {
      setMessage("Please select at least two PDF files to merge.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

        pages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as BlobPart], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "quicktools-merged.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setMessage(
        `${files.length} PDF files merged successfully. Your merged PDF is downloading.`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to merge the PDF files. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setFiles([]);
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

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              PDF Merger
            </h1>
            <p className="mt-2 text-slate-600">
              Merge multiple PDF files into one document quickly and easily.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <label className="block cursor-pointer">
              <div className="text-lg font-semibold text-slate-800">
                {files.length > 0
                  ? `${files.length} PDF files selected`
                  : "Choose PDF files"}
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Select two or more PDF files to combine them into one PDF
              </p>

              <input
                type="file"
                accept=".pdf,application/pdf"
                multiple
                onChange={handleFiles}
                className="hidden"
              />

              <span className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700">
                {files.length > 0 ? "Choose Other PDFs" : "Choose PDF Files"}
              </span>
            </label>
          </div>

          {files.length > 0 && (
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Selected PDF files
              </p>

              <div className="space-y-1 text-sm text-slate-600">
                {files.map((file, index) => (
                  <div key={`${file.name}-${file.size}-${index}`}>
                    {index + 1}. {file.name}
                  </div>
                ))}
              </div>
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
              onClick={mergePdfs}
              disabled={files.length < 2 || loading}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Merging..." : "Merge PDFs"}
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
          <h2 className="text-xl font-bold">Merge PDF Files Online</h2>

          <p className="mt-3 leading-7 text-slate-600">
            Combine multiple PDF documents into a single PDF file directly in
            your browser. Your selected files are processed locally without
            uploading them to a server.
          </p>
        </section>
      </div>
    </main>
  );
}
