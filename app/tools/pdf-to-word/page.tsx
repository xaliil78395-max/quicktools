"use client";


import AdsterraAd from "@/components/AdsterraAd";
import Link from "next/link";
import { useState } from "react";

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] || null;

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setFile(null);
      setMessage("Please select a PDF file.");
      return;
    }

    setMessage("");
    setFile(selectedFile);
  }

  async function convertPdf() {
    if (!file) return;

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/pdf-to-word", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Unable to convert this PDF.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = file.name.replace(/\.pdf$/i, "") + ".docx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setMessage("PDF converted successfully. Your Word file is downloading.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to convert this PDF. Please try another file.",
      );
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setFile(null);
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
              PDF to Word Converter
            </h1>
            <p className="mt-2 text-slate-600">
              Convert PDF files into editable Word documents quickly and easily.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <label className="block cursor-pointer">
              <div className="text-lg font-semibold text-slate-800">
                {file ? file.name : "Choose a PDF file"}
              </div>

              <p className="mt-2 text-sm text-slate-500">
                {file
                  ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                  : "Upload your PDF document to convert it to Word"}
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
              onClick={convertPdf}
              disabled={!file || loading}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Converting..." : "Convert to Word"}
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
          <h2 className="text-xl font-bold">
            Convert PDF to Word Online
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            Convert PDF documents into editable Word files. This tool is
            designed to make it easier to edit, reuse, and organize content
            from PDF documents.
          </p>
        </section>
      </div>
    </main>
  );
}



