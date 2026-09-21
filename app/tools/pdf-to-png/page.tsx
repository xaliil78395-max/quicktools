"use client";
import RelatedTools from "@/components/RelatedTools";

import Link from 'next/link';

import AdsterraAd from "@/components/AdsterraAd";

import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

type PagePreview = {
  page: number;
  url: string;
};

export default function PDFToPNGPage() {
  const [fileName, setFileName] = useState("");
  const [pages, setPages] = useState<PagePreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setError("");
    setPages([]);
    setFileName("");

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a PDF file.");
      return;
    }

    try {
      setLoading(true);

      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const generated: PagePreview[] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Canvas is not supported.");
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvas,
            canvasContext: context,
            viewport,
          }).promise;

        generated.push({
          page: pageNumber,
          url: canvas.toDataURL("image/png"),
        });
      }

      setFileName(file.name);
      setPages(generated);
    } catch {
      setError(
        "The PDF could not be converted. The file may be damaged, encrypted, or unsupported."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadPage = (item: PagePreview) => {
    const link = document.createElement("a");
    link.href = item.url;
    link.download = `${fileName.replace(/\.pdf$/i, "")}-page-${item.page}.png`;
    link.click();
  };

  const downloadAll = () => {
    pages.forEach((page, index) => {
      setTimeout(() => downloadPage(page), index * 150);
    });
  };

  const clearAll = () => {
    setFileName("");
    setPages([]);
    setError("");
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-white"><div className="flex items-center justify-between w-full mb-8"><Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">← Back</Link><Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Home</Link></div>
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            PDF to PNG
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Convert PDF pages to high-quality PNG images directly in your browser.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFile(file);
            }}
            className="block w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-950"
          />

          {loading && (
            <div className="mt-5 rounded-xl bg-slate-100 p-4 text-sm dark:bg-slate-800">
              Converting PDF pages to PNG...
            </div>
          )}

          {fileName && pages.length > 0 && !loading && (
            <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="break-all font-semibold">{fileName}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {pages.length} {pages.length === 1 ? "page" : "pages"} converted.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          {pages.length > 0 && !loading && (
            <>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={downloadAll}
                  className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
                >
                  Download All PNG
                </button>

                <button
                  type="button"
                  onClick={clearAll}
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

              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pages.map((item) => (
                  <div
                    key={item.page}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950"
                  >
                    <div className="bg-slate-100 p-3 dark:bg-slate-800">
                      <img
                        src={item.url}
                        alt={`PDF page ${item.page} preview`}
                        className="mx-auto max-h-96 w-full object-contain"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 p-4">
                      <span className="font-semibold">
                        Page {item.page}
                      </span>

                      <button
                        type="button"
                        onClick={() => downloadPage(item)}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                      >
                        Download PNG
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-7 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <p className="font-semibold text-slate-800 dark:text-white">
              Privacy & quality
            </p>
            <p className="mt-1">
              Your PDF is processed directly in your browser. It is not uploaded
              to a QuickHub server. Each page is rendered as a PNG image at 2×
              resolution for clearer results.
            </p>
            <p className="mt-2">
              Password-protected or damaged PDFs may not be supported.
            </p>
          </div>
        </div>
      </div>
        <AdsterraAd />
              <RelatedTools currentTool="pdf-to-png" />
      </main>
  );
}














