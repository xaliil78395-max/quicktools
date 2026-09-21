"use client";

import Link from 'next/link';

import { useState } from "react";
import RelatedTools from "@/components/RelatedTools";
import AdsterraAd from "@/components/AdsterraAd";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export default function PDFToTextPage() {
  const [fileName, setFileName] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setError("");
    setText("");
    setFileName("");

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a PDF file.");
      return;
    }

    try {
      setLoading(true);

      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const pages: string[] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();

        const pageText = content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();

        pages.push(`--- Page ${pageNumber} ---\n${pageText}`);
      }

      setFileName(file.name);
      setText(pages.join("\n\n"));
    } catch {
      setError(
        "The PDF could not be read. It may be damaged, encrypted, or unsupported."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyText = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
  };

  const downloadText = () => {
    if (!text) return;

    const blob = new Blob([text], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${fileName.replace(/\.pdf$/i, "")}.txt`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setFileName("");
    setText("");
    setError("");
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-white"><div className="flex items-center justify-between w-full mb-8"><Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">← Back</Link><Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Home</Link></div>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            PDF to Text
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Extract text from PDF files directly in your browser.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 p-10 text-center transition hover:border-indigo-500 dark:border-slate-700 dark:hover:border-indigo-400">
            <input
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleFile(file);
              }}
            />

            <div className="text-lg font-semibold">Choose PDF File</div>
            <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Select a PDF from your computer
            </div>
          </label>

          {loading && (
            <div className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
              Extracting text...
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </div>
          )}

          {fileName && !loading && !error && (
            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800">
              <div className="font-medium">{fileName}</div>
              <div className="mt-1 text-slate-500 dark:text-slate-400">
                Text extracted successfully.
              </div>
            </div>
          )}

          {text && (
            <>
              <textarea
                value={text}
                readOnly
                className="mt-5 min-h-[420px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 outline-none dark:border-slate-700 dark:bg-slate-950"
              />

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={copyText}
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700"
                >
                  Copy Text
                </button>

                <button
                  type="button"
                  onClick={downloadText}
                  className="rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Download TXT
                </button>

                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Clear
                </button>
              </div>
            </>
          )}

          <p className="mt-6 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Text extraction works best with PDFs that contain selectable text.
            Scanned PDFs and image-only documents may not produce text.
          </p>
        </div>
      </div>        <RelatedTools currentTool="pdf-to-text" />

        <AdsterraAd />
      </main>
  );
}
















