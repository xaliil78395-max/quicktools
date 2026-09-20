"use client";

import { PDFDocument } from "pdf-lib";
import Link from "next/link";
import { useState } from "react";
import AdsterraAd from "@/components/AdsterraAd";

type CompressionLevel = "low" | "medium" | "high";

const levels: {
  value: CompressionLevel;
  label: string;
  description: string;
}[] = [
  {
    value: "low",
    label: "Low",
    description: "Light optimization with maximum preservation.",
  },
  {
    value: "medium",
    label: "Medium",
    description: "Balanced optimization for everyday PDFs.",
  },
  {
    value: "high",
    label: "High",
    description: "Stronger optimization for smaller files.",
  },
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function PdfCompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<CompressionLevel>("medium");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<{
    blob: Blob;
    originalSize: number;
    compressedSize: number;
    savedPercent: number;
  } | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] || null;

    setResult(null);
    setMessage("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setFile(null);
      setMessage("Please select a PDF file.");
      return;
    }

    setFile(selectedFile);
  }

  async function compressPdf() {
    if (!file) return;

    setLoading(true);
    setMessage("");
    setResult(null);

    try {
      const inputBytes = await file.arrayBuffer();

      const pdfDoc = await PDFDocument.load(inputBytes, {
        ignoreEncryption: false,
        updateMetadata: false,
      });

      const compressionOptions =
        level === "low"
          ? {
              useObjectStreams: true,
              addDefaultPage: false,
              objectsPerTick: 50,
            }
          : level === "medium"
            ? {
                useObjectStreams: true,
                addDefaultPage: false,
                objectsPerTick: 100,
              }
            : {
                useObjectStreams: true,
                addDefaultPage: false,
                objectsPerTick: 200,
              };

      const compressedBytes = await pdfDoc.save(compressionOptions);

      const compressedBuffer = new ArrayBuffer(compressedBytes.byteLength);
      new Uint8Array(compressedBuffer).set(compressedBytes);

      const compressedBlob = new Blob([compressedBuffer], {
        type: "application/pdf",
      });

      const originalSize = file.size;
      const compressedSize = compressedBlob.size;

      if (compressedSize >= originalSize) {
        setMessage(
          "This PDF is already highly optimized. No smaller version was created, so the original file is preserved.",
        );
        return;
      }

      const savedPercent =
        ((originalSize - compressedSize) / originalSize) * 100;

      setResult({
        blob: compressedBlob,
        originalSize,
        compressedSize,
        savedPercent,
      });

      setMessage("PDF compressed successfully.");
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to compress this PDF. Please try another file.",
      );
    } finally {
      setLoading(false);
    }
  }

  function downloadResult() {
    if (!result || !file) return;

    const url = URL.createObjectURL(result.blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = file.name.replace(/\.pdf$/i, "") + "-compressed.pdf";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  function clearAll() {
    setFile(null);
    setResult(null);
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">`r`n        <div className="mb-6 flex items-center justify-between"><a href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">← Back to QuickHub</a><a href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">Home</a></div>
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
              PDF Compressor
            </h1>
            <p className="mt-2 text-slate-600">
              Reduce PDF file size while keeping your document intact.
              Processing happens directly in your browser.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <label className="block cursor-pointer">
              <div className="text-lg font-semibold text-slate-800">
                {file ? file.name : "Choose a PDF file"}
              </div>

              <p className="mt-2 text-sm text-slate-500">
                {file
                  ? formatBytes(file.size)
                  : "Select a PDF to reduce its file size"}
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
            <div className="mt-6">
              <h2 className="mb-3 text-sm font-semibold text-slate-800">
                Compression level
              </h2>

              <div className="grid gap-3 sm:grid-cols-3">
                {levels.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setLevel(item.value)}
                    className={`rounded-xl border p-4 text-left transition ${
                      level === item.value
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 bg-white hover:border-indigo-300"
                    }`}
                  >
                    <div className="font-semibold text-slate-900">
                      {item.label}
                    </div>

                    <div className="mt-1 text-xs leading-5 text-slate-500">
                      {item.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {message && (
            <div className="mt-5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
              {message}
            </div>
          )}

          {result && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Original
                  </div>

                  <div className="mt-1 text-lg font-bold text-slate-900">
                    {formatBytes(result.originalSize)}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Compressed
                  </div>

                  <div className="mt-1 text-lg font-bold text-slate-900">
                    {formatBytes(result.compressedSize)}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Saved
                  </div>

                  <div className="mt-1 text-lg font-bold text-indigo-600">
                    {result.savedPercent.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={compressPdf}
              disabled={!file || loading}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Compressing..." : "Compress PDF"}
            </button>

            {result && (
              <button
                type="button"
                onClick={downloadResult}
                className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                Download PDF
              </button>
            )}

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
          <h2 className="text-xl font-bold">
            Compress PDF Online
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            Reduce the size of PDF documents for easier sharing, storage,
            email attachments, and faster uploads. Your file is processed
            directly in your browser and is not uploaded to a server.
          </p>
        </section>
      </div>
    </main>
  );
}

