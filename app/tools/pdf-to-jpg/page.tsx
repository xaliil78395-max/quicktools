"use client";

import Link from "next/link";
import { useState } from "react";

type PdfJsModule = {
  getDocument: (source: { data: ArrayBuffer }) => {
    promise: Promise<{
      numPages: number;
      getPage: (pageNumber: number) => Promise<{
        getViewport: (options: { scale: number }) => {
          width: number;
          height: number;
        };
        render: (options: {
          canvasContext: CanvasRenderingContext2D;
          viewport: { width: number; height: number };
        }) => { promise: Promise<void> };
      }>;
    }>;
  };
  GlobalWorkerOptions: {
    workerSrc: string;
  };
};

export default function PdfToJpgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
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
      const pdfjs = (await import("pdfjs-dist/legacy/build/pdf.mjs")) as unknown as PdfJsModule;

      pdfjs.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.3.289/pdf.worker.min.mjs";

      const bytes = await selectedFile.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: bytes }).promise;

      setFile(selectedFile);
      setPageCount(pdf.numPages);
      setMessage("");
    } catch {
      setFile(null);
      setPageCount(0);
      setMessage("Unable to read this PDF file.");
    }
  }

  async function convertToJpg() {
    if (!file) return;

    setLoading(true);
    setMessage("");

    try {
      const pdfjs = (await import("pdfjs-dist/legacy/build/pdf.mjs")) as unknown as PdfJsModule;

      pdfjs.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.3.289/pdf.worker.min.mjs";

      const bytes = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: bytes }).promise;

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Unable to create an image canvas.");
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", 0.92),
        );

        if (!blob) {
          throw new Error("Unable to create JPG image.");
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `${file.name.replace(/\.pdf$/i, "")}-page-${pageNumber}.jpg`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      }

      setMessage(
        `${pdf.numPages} JPG image${pdf.numPages > 1 ? "s" : ""} created successfully. Your images are downloading.`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to convert this PDF to JPG. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setFile(null);
    setPageCount(0);
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
              PDF to JPG Converter
            </h1>
            <p className="mt-2 text-slate-600">
              Convert PDF pages into high-quality JPG images quickly and easily.
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
                  : "Upload a PDF and convert its pages into JPG images"}
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

          {message && (
            <div className="mt-5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
              {message}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={convertToJpg}
              disabled={!file || loading}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Converting..." : "Convert to JPG"}
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
          <h2 className="text-xl font-bold">Convert PDF to JPG Online</h2>

          <p className="mt-3 leading-7 text-slate-600">
            Convert every page of a PDF document into a JPG image directly in
            your browser. Your PDF is processed locally without uploading it to
            a server.
          </p>
        </section>
      </div>
    </main>
  );
}
