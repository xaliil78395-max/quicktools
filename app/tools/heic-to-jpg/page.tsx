"use client";

import Link from 'next/link';

import { DragEvent, useState } from "react";
import AdsterraAd from "@/components/AdsterraAd";
import JSZip from "jszip";
import { heicTo } from "heic-to";

type ConvertedFile = {
  id: string;
  originalName: string;
  originalSize: number;
  blob: Blob;
  url: string;
  outputName: string;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getFileType(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (extension === "heic" || extension === "heif") {
    return "HEIC/HEIF";
  }

  if (extension === "jpg" || extension === "jpeg") {
    return "JPG/JPEG";
  }

  if (extension === "png") {
    return "PNG";
  }

  return "unsupported";
}

export default function HeicToJpgPage() {
  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const [quality, setQuality] = useState(0.9);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [pngDetected, setPngDetected] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function convertFiles(selectedFiles: File[]) {
    const heicFiles = selectedFiles.filter(
      (file) => getFileType(file) === "HEIC/HEIF"
    );

    const jpgFiles = selectedFiles.filter(
      (file) => getFileType(file) === "JPG/JPEG"
    );

    const pngFiles = selectedFiles.filter(
      (file) => getFileType(file) === "PNG"
    );

    const unsupportedFiles = selectedFiles.filter(
      (file) => getFileType(file) === "unsupported"
    );

    setError("");
    setInfo("");

    if (!selectedFiles.length) {
      setError("No image files were selected.");
      return;
    }

    const messages: string[] = [];

    if (jpgFiles.length) {
      messages.push(
        `${jpgFiles.length} JPG/JPEG image${jpgFiles.length === 1 ? "" : "s"} already use the JPG format and do not need conversion.`
      );
    }

    if (pngFiles.length) {
      messages.push(
        `${pngFiles.length} PNG image${pngFiles.length === 1 ? "" : "s"} detected. PNG files are not HEIC/HEIF images, so they were not converted by this tool.`
      );
    }

    if (unsupportedFiles.length) {
      messages.push(
        `${unsupportedFiles.length} unsupported file${unsupportedFiles.length === 1 ? "" : "s"} skipped. Please select HEIC, HEIF, JPG, JPEG, or PNG images.`
      );
    }

    if (messages.length) {
      setInfo(messages.join(" "));
    }

    if (!heicFiles.length) {
      if (jpgFiles.length || pngFiles.length || unsupportedFiles.length) {
        return;
      }

      setError("Please select one or more HEIC or HEIF images.");
      return;
    }

    setIsConverting(true);

    try {
      const converted: ConvertedFile[] = [];

      for (const file of heicFiles) {
        try {
          const jpeg = await heicTo({
            blob: file,
            type: "image/jpeg",
            quality,
          });

          const baseName = file.name.replace(/\.(heic|heif)$/i, "");
          const outputName = `${baseName || "converted-image"}.jpg`;

          converted.push({
            id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
            originalName: file.name,
            originalSize: file.size,
            blob: jpeg,
            url: URL.createObjectURL(jpeg),
            outputName,
          });
        } catch {
          messages.push(
            `Could not convert "${file.name}". The file may be damaged or may not contain valid HEIC/HEIF image data.`
          );
        }
      }

      if (messages.length) {
        setInfo(messages.join(" "));
      }

      if (!converted.length) {
        setError(
          "None of the selected HEIC/HEIF files could be converted. Please make sure they are valid HEIC or HEIF images."
        );
        return;
      }

      setFiles((previous) => {
        previous.forEach((item) => URL.revokeObjectURL(item.url));
        return converted;
      });
    } finally {
      setIsConverting(false);
    }
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);

    const droppedFiles = Array.from(event.dataTransfer.files);
    void convertFiles(droppedFiles);
  }

  function downloadFile(file: ConvertedFile) {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.outputName;
    link.click();
  }

  async function downloadZip() {
    if (!files.length) return;

    const zip = new JSZip();

    files.forEach((file) => {
      zip.file(file.outputName, file.blob);
    });

    const zipBlob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 6,
      },
    });

    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "quickhub-heic-to-jpg.zip";
    link.click();

    URL.revokeObjectURL(url);
  }

  function clearResults() {
    files.forEach((file) => URL.revokeObjectURL(file.url));
    setFiles([]);
    setError("");
    setInfo("");
  }

  const totalOriginalSize = files.reduce(
    (total, file) => total + file.originalSize,
    0
  );

  const totalJpgSize = files.reduce(
    (total, file) => total + file.blob.size,
    0
  );

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12"><div className="flex items-center justify-between w-full mb-8"><Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">← Back</Link><Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Home</Link></div>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Image Tools
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            HEIC to JPG Converter
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Convert HEIC and HEIF images to JPG quickly and privately in your
            browser. No signup and no watermark.
          </p>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
            <span>✓ No registration</span>
            <span>✓ Free to use</span>
            <span>✓ Batch conversion</span>
            <span>✓ Browser-based</span>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label
            htmlFor="heic-files"
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center transition ${
              dragging
                ? "border-indigo-500 bg-indigo-50"
                : "border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/40"
            }`}
          >
            <span className="text-4xl">🖼️</span>

            <span className="mt-4 text-lg font-semibold text-slate-900">
              {isConverting
                ? "Converting your HEIC images..."
                : "Drop image files here"}
            </span>

            <span className="mt-2 text-sm text-slate-500">
              HEIC / HEIF are converted to JPG. JPG / PNG files are detected
              and explained.
            </span>

            {!isConverting && (
              <span className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white">
                Choose Files
              </span>
            )}

            <input
              id="heic-files"
              type="file"
              accept=".heic,.heif,.jpg,.jpeg,.png,image/heic,image/heif,image/jpeg,image/png"
              multiple
              className="sr-only"
              disabled={isConverting}
              onChange={(event) => {
                const selectedFiles = Array.from(event.target.files ?? []);

                if (selectedFiles.length) {
                  void convertFiles(selectedFiles);
                }

                event.target.value = "";
              }}
            />
          </label>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <label
                htmlFor="quality"
                className="text-sm font-semibold text-slate-900"
              >
                JPG Quality
              </label>

              <span className="text-sm font-semibold text-indigo-600">
                {Math.round(quality * 100)}%
              </span>
            </div>

            <input
              id="quality"
              type="range"
              min="0.5"
              max="1"
              step="0.05"
              value={quality}
              disabled={isConverting}
              onChange={(event) => setQuality(Number(event.target.value))}
              className="mt-3 w-full accent-indigo-600"
            />

            <div className="mt-1 flex justify-between text-xs text-slate-400">
              <span>Smaller file</span>
              <span>Higher quality</span>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Choose the quality before starting a new conversion.
            </p>
          </div>

          {info && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
              {info}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
              {error}
            </div>
          )}

          {files.length > 0 && (
            <div className="mt-6">
              <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">
                    {files.length} image{files.length === 1 ? "" : "s"} converted
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {formatBytes(totalOriginalSize)} →{" "}
                    {formatBytes(totalJpgSize)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={downloadZip}
                    className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Download ZIP
                  </button>

                  <button
                    type="button"
                    onClick={clearResults}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="flex h-32 w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 sm:w-40">
                        <img
                          src={file.url}
                          alt={file.outputName}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <p className="truncate font-semibold text-slate-900">
                            {file.outputName}
                          </p>

                          <div className="mt-2 space-y-1 text-sm text-slate-500">
                            <p>
                              Original: {formatBytes(file.originalSize)}
                            </p>
                            <p>
                              JPG: {formatBytes(file.blob.size)}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => downloadFile(file)}
                          className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:w-fit"
                        >
                          Download JPG
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">
            How to convert HEIC to JPG
          </h2>

          <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-600">
            <li>Drop one or more HEIC or HEIF images into the converter.</li>
            <li>Choose your preferred JPG quality.</li>
            <li>Wait for the images to be converted in your browser.</li>
            <li>Download individual JPG files or download them all as a ZIP.</li>
          </ol>

          <p className="mt-5 text-sm leading-6 text-slate-500">
            The conversion is performed directly in your browser. Your images
            do not need to be uploaded to a conversion server.
          </p>
        </section>
      </div>        <AdsterraAd />
      </main>
  );
}


















