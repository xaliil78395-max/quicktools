"use client";

import Link from 'next/link';

import { DragEvent, useState } from "react";
import AdsterraAd from "@/components/AdsterraAd";
import JSZip from "jszip";

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
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function WebpToJpgPage() {
  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const [quality, setQuality] = useState(0.9);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [dragging, setDragging] = useState(false);

  async function convertFiles(selectedFiles: File[]) {
    const webpFiles = selectedFiles.filter((file) =>
      /\.webp$/i.test(file.name)
    );

    const otherFiles = selectedFiles.filter(
      (file) => !/\.webp$/i.test(file.name)
    );

    setError("");
    setInfo("");
    setFiles([]);

    if (!selectedFiles.length) {
      setError("Please select one or more WebP images.");
      return;
    }

    if (otherFiles.length > 0) {
      setInfo(
        `${otherFiles.length} non-WebP image${otherFiles.length === 1 ? "" : "s"} detected. Only WebP images are converted by this tool.`
      );
    }

    if (!webpFiles.length) {
      return;
    }

    setIsConverting(true);

    try {
      const converted: ConvertedFile[] = [];

      for (const file of webpFiles) {
        const imageUrl = URL.createObjectURL(file);

        try {
          const blob = await new Promise<Blob>((resolve, reject) => {
            const image = new Image();

            image.onload = () => {
              const canvas = document.createElement("canvas");
              canvas.width = image.naturalWidth;
              canvas.height = image.naturalHeight;

              const context = canvas.getContext("2d");

              if (!context) {
                reject(new Error("Canvas is not supported."));
                return;
              }

              context.drawImage(image, 0, 0);

              canvas.toBlob(
                (result) => {
                  if (result) {
                    resolve(result);
                  } else {
                    reject(new Error("JPG conversion failed."));
                  }
                },
                "image/jpeg",
                quality
              );
            };

            image.onerror = () => {
              reject(new Error("The WebP image could not be loaded."));
            };

            image.src = imageUrl;
          });

          const baseName = file.name.replace(/\.webp$/i, "");

          converted.push({
            id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
            originalName: file.name,
            originalSize: file.size,
            blob,
            url: URL.createObjectURL(blob),
            outputName: `${baseName}.jpg`,
          });
        } finally {
          URL.revokeObjectURL(imageUrl);
        }
      }

      setFiles(converted);
    } catch {
      setError(
        "Some WebP files could not be converted. Please make sure the files are valid WebP images and try again."
      );
    } finally {
      setIsConverting(false);
    }
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    void convertFiles(Array.from(event.dataTransfer.files));
  }

  function downloadFile(file: ConvertedFile) {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.outputName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function downloadZip() {
    if (!files.length) return;

    const zip = new JSZip();

    files.forEach((file) => {
      zip.file(file.outputName, file.blob);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "quickhub-webp-to-jpg.zip";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  function clearResults() {
    files.forEach((file) => URL.revokeObjectURL(file.url));
    setFiles([]);
    setError("");
    setInfo("");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white"><div className="flex items-center justify-between w-full mb-8"><Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">← Back</Link><Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Home</Link></div>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-400">
            QuickHub Image Tools
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            WebP to JPG Converter
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Convert WebP images to JPG directly in your browser.
            No upload or account is required.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <label
            htmlFor="webp-files"
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center transition ${
              dragging
                ? "border-indigo-400 bg-indigo-500/10"
                : "border-slate-700 bg-slate-950/50 hover:border-indigo-500"
            }`}
          >
            <div className="mb-4 text-5xl">🖼️</div>

            <span className="text-lg font-semibold">
              {isConverting
                ? "Converting your images..."
                : "Drop WebP files here"}
            </span>

            <span className="mt-2 text-sm text-slate-400">
              or click to choose one or more WebP images
            </span>

            <input
              id="webp-files"
              type="file"
              accept="image/*,.webp"
              multiple
              className="hidden"
              onChange={(event) => {
                void convertFiles(Array.from(event.target.files ?? []));
                event.currentTarget.value = "";
              }}
            />
          </label>

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-300">
                JPG quality
              </span>

              <span className="text-sm font-semibold text-indigo-400">
                {Math.round(quality * 100)}%
              </span>
            </div>

            <input
              type="range"
              min="0.5"
              max="1"
              step="0.05"
              value={quality}
              onChange={(event) => setQuality(Number(event.target.value))}
              className="mt-3 w-full accent-indigo-500"
            />

            <p className="mt-2 text-xs text-slate-500">
              Higher quality preserves more image detail.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {info && (
            <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-200">
              {info}
            </div>
          )}

          {files.length > 0 && (
            <div className="mt-8">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">
                  Converted Images ({files.length})
                </h2>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={downloadZip}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold transition hover:bg-indigo-500"
                  >
                    Download ZIP
                  </button>

                  <button
                    type="button"
                    onClick={clearResults}
                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center"
                  >
                    <img
                      src={file.url}
                      alt={file.outputName}
                      className="h-24 w-24 rounded-lg object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{file.originalName}</p>

                      <p className="mt-1 text-sm text-slate-500">
                        {formatBytes(file.originalSize)} → JPG
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => downloadFile(file)}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold transition hover:bg-indigo-500"
                    >
                      Download JPG
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">
            How to convert WebP to JPG
          </h2>

          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-400">
            <li>Select one or more WebP images.</li>
            <li>QuickHub converts the images to JPG in your browser.</li>
            <li>Preview your converted JPG images.</li>
            <li>Download individual JPG files or download them all as a ZIP.</li>
          </ol>
        </section>
      </div>`r`n        <AdsterraAd />
      </main>
  );
}













