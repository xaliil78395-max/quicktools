"use client";

import Link from "next/link";
import { useState } from "react";
import { jsPDF } from "jspdf";

export default function JpgToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []).filter((file) =>
      ["image/jpeg", "image/jpg"].includes(file.type),
    );

    if (selected.length === 0) {
      setFiles([]);
      setMessage("Please select one or more JPG images.");
      return;
    }

    setFiles(selected);
    setMessage("");
  }

  async function convertToPdf() {
    if (files.length === 0) return;

    setLoading(true);
    setMessage("");

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      for (let index = 0; index < files.length; index++) {
        const file = files[index];

        if (index > 0) {
          pdf.addPage();
        }

        const imageUrl = URL.createObjectURL(file);

        await new Promise<void>((resolve, reject) => {
          const image = new Image();

          image.onload = () => {
            const pageWidth = 210;
            const pageHeight = 297;
            const margin = 10;
            const maxWidth = pageWidth - margin * 2;
            const maxHeight = pageHeight - margin * 2;

            const ratio = Math.min(
              maxWidth / image.width,
              maxHeight / image.height,
            );

            const width = image.width * ratio;
            const height = image.height * ratio;

            const x = (pageWidth - width) / 2;
            const y = (pageHeight - height) / 2;

            pdf.addImage(image, "JPEG", x, y, width, height);
            URL.revokeObjectURL(imageUrl);
            resolve();
          };

          image.onerror = () => {
            URL.revokeObjectURL(imageUrl);
            reject(new Error("Unable to process one of the JPG images."));
          };

          image.src = imageUrl;
        });
      }

      pdf.save("quicktools-jpg-to-pdf.pdf");
      setMessage(
        `${files.length} JPG image${files.length > 1 ? "s" : ""} converted successfully. Your PDF is downloading.`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to convert the JPG images.",
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
              JPG to PDF Converter
            </h1>
            <p className="mt-2 text-slate-600">
              Convert JPG images into a PDF document quickly and easily.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <label className="block cursor-pointer">
              <div className="text-lg font-semibold text-slate-800">
                {files.length > 0
                  ? `${files.length} JPG image${files.length > 1 ? "s" : ""} selected`
                  : "Choose JPG images"}
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Select one or multiple JPG images to combine them into a PDF
              </p>

              <input
                type="file"
                accept=".jpg,.jpeg,image/jpeg"
                multiple
                onChange={handleFiles}
                className="hidden"
              />

              <span className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700">
                {files.length > 0 ? "Choose Other Images" : "Choose JPG Images"}
              </span>
            </label>
          </div>

          {files.length > 0 && (
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Selected images
              </p>

              <div className="space-y-1 text-sm text-slate-600">
                {files.map((file) => (
                  <div key={`${file.name}-${file.size}`}>
                    {file.name}
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
              onClick={convertToPdf}
              disabled={files.length === 0 || loading}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating PDF..." : "Convert to PDF"}
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
          <h2 className="text-xl font-bold">Convert JPG to PDF Online</h2>

          <p className="mt-3 leading-7 text-slate-600">
            Convert JPG images into a single PDF document directly in your
            browser. You can select multiple images and create a PDF without
            uploading your images to a server.
          </p>
        </section>
      </div>
    </main>
  );
}
