"use client";

import Link from 'next/link';

import AdsterraAd from "@/components/AdsterraAd";

import { useRef, useState } from "react";
import { parse, presentationToPrintableHtml } from "@web-ppt/core";

export default function PowerPointToPDFPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [slideCount, setSlideCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setError("");
    setFileName("");
    setSlideCount(null);

    const isPowerPoint =
      file.name.toLowerCase().endsWith(".pptx") ||
      file.name.toLowerCase().endsWith(".ppt");

    if (!isPowerPoint) {
      setError("Please select a PowerPoint file (.pptx or .ppt).");
      return;
    }

    try {
      setLoading(true);
      const presentation = await parse(file);

      setFileName(file.name);
      setSlideCount(presentation.slides.length);
    } catch {
      setError(
        "This PowerPoint file could not be read. It may be damaged or password-protected."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async () => {
    const file = inputRef.current?.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError("");

      const presentation = await parse(file);
      const printableHtml =
        await presentationToPrintableHtml(presentation);

      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        setError("Please allow pop-ups for QuickHub, then try again.");
        return;
      }

      printWindow.document.open();
      printWindow.document.write(printableHtml);
      printWindow.document.close();

      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 700);
    } catch {
      setError("The PowerPoint could not be prepared for PDF conversion.");
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setFileName("");
    setSlideCount(null);
    setError("");
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-white"><div className="flex items-center justify-between w-full mb-8"><Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">← Back</Link><Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Home</Link></div>
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            PowerPoint to PDF
          </h1>

          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Convert PowerPoint presentations to PDF directly in your browser.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <input
            ref={inputRef}
            type="file"
            accept=".pptx,.ppt,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void handleFile(file);
              }
            }}
            className="block w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-950"
          />

          {loading && (
            <div className="mt-5 rounded-xl bg-slate-100 p-4 text-sm dark:bg-slate-800">
              Processing PowerPoint...
            </div>
          )}

          {fileName && slideCount !== null && !loading && (
            <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="break-all font-semibold">{fileName}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {slideCount} {slideCount === 1 ? "slide" : "slides"} detected.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleConvert}
              disabled={!fileName || loading}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Convert to PDF
            </button>

            <button
              type="button"
              onClick={clearFile}
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Back
            </button>

            <a
              href="/"
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Home
            </a>
          </div>

          <div className="mt-7 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <p className="font-semibold text-slate-800 dark:text-white">
              Important
            </p>

            <p className="mt-1">
              Conversion happens in your browser. When you click Convert to
              PDF, your browser&apos;s print dialog will open. Choose
              &quot;Save as PDF&quot; to save the converted presentation.
            </p>

            <p className="mt-2">
              Complex PowerPoint features, animations, fonts, embedded
              objects, or advanced effects may not reproduce exactly.
            </p>
          </div>
        </div>
      </div>
        <AdsterraAd />
      </main>
  );
}










