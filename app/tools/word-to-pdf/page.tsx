"use client";
import RelatedTools from "@/components/RelatedTools";

import Link from 'next/link';

import { useState } from "react";
import AdsterraAd from "@/components/AdsterraAd";
import mammoth from "mammoth";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function WordToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [html, setHtml] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(selectedFile: File | undefined) {
    if (!selectedFile) return;

    setError("");
    setHtml("");
    setFile(null);

    if (!/\.docx$/i.test(selectedFile.name)) {
      setError("Please select a Microsoft Word .docx file.");
      return;
    }

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();

      const result = await mammoth.convertToHtml({
        arrayBuffer,
      });

      if (!result.value.trim()) {
        setError("The Word document appears to be empty.");
        return;
      }

      setFile(selectedFile);
      setHtml(result.value);
    } catch {
      setError(
        "The Word document could not be read. Please make sure it is a valid .docx file."
      );
    }
  }

  async function convertToPdf() {
    if (!html || !file) {
      setError("Please select a Word document first.");
      return;
    }

    setIsConverting(true);
    setError("");

    try {
      const container = document.getElementById("word-preview");

      if (!container) {
        throw new Error("Preview not found.");
      }

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imageData = canvas.toDataURL("image/jpeg", 0.95);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;

      const imageWidth = canvas.width;
      const imageHeight = canvas.height;
      const ratio = contentWidth / imageWidth;

      const scaledHeight = imageHeight * ratio;

      let remainingHeight = scaledHeight;
      let position = margin;

      pdf.addImage(
        imageData,
        "JPEG",
        margin,
        position,
        contentWidth,
        scaledHeight,
        undefined,
        "FAST"
      );

      remainingHeight -= contentHeight;

      while (remainingHeight > 0) {
        position = margin - (scaledHeight - remainingHeight);

        pdf.addPage();

        pdf.addImage(
          imageData,
          "JPEG",
          margin,
          position,
          contentWidth,
          scaledHeight,
          undefined,
          "FAST"
        );

        remainingHeight -= contentHeight;
      }

      const baseName = file.name.replace(/\.docx$/i, "");
      pdf.save(`${baseName}.pdf`);
    } catch {
      setError(
        "The PDF could not be created. Please try another .docx document."
      );
    } finally {
      setIsConverting(false);
    }
  }

  function clearFile() {
    setFile(null);
    setHtml("");
    setError("");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white"><div className="flex items-center justify-between w-full mb-8"><Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">← Back</Link><Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Home</Link></div>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-400">
            QuickHub PDF Tools
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Word to PDF Converter
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Convert Word DOCX documents to PDF directly in your browser.
            No upload, account, or paid API is required.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <label
            htmlFor="word-file"
            className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/50 px-6 text-center transition hover:border-indigo-500"
          >
            <div className="mb-4 text-5xl">📝</div>

            <span className="text-lg font-semibold">
              {file ? file.name : "Drop a Word document here"}
            </span>

            <span className="mt-2 text-sm text-slate-400">
              or click to choose a .docx file
            </span>

            <input
              id="word-file"
              type="file"
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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

          {file && html && (
            <div className="mt-8">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">
                    Document Preview
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {file.name}
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

              <div className="overflow-auto rounded-xl border border-slate-700 bg-slate-200 p-4">
                <div
                  id="word-preview"
                  className="mx-auto min-h-[800px] max-w-[794px] bg-white p-12 text-black shadow-lg"
                  dangerouslySetInnerHTML={{ __html: html }}
                  style={{
                    lineHeight: 1.6,
                    fontFamily: "Arial, sans-serif",
                  }}
                />
              </div>

              <button
                type="button"
                onClick={convertToPdf}
                disabled={isConverting}
                className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isConverting ? "Creating PDF..." : "Convert to PDF"}
              </button>
            </div>
          )}
        </section>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">
            How to convert Word to PDF
          </h2>

          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-400">
            <li>Select a .docx Word document.</li>
            <li>Review the document in the browser.</li>
            <li>Click Convert to PDF.</li>
            <li>The PDF is generated directly on your device.</li>
          </ol>

          <p className="mt-5 text-xs leading-5 text-slate-500">
            Note: This browser-based converter focuses on common DOCX
            formatting. Very complex Word layouts, advanced fonts, tracked
            changes, headers, footers, and some embedded elements may not
            reproduce exactly.
          </p>
        </section>
      </div>`r`n        <AdsterraAd />
              <RelatedTools currentTool="word-to-pdf" />
      </main>
  );
}














