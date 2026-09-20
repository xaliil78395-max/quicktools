"use client";

import Link from 'next/link';

import { useState } from "react";
import AdsterraAd from "@/components/AdsterraAd";
import { jsPDF } from "jspdf";

type ImageItem = {
  id: string;
  file: File;
  url: string;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImageToPdfPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");

  function handleFiles(selectedFiles: FileList | null) {
    if (!selectedFiles) return;

    const selected = Array.from(selectedFiles);
    const imageFiles = selected.filter((file) =>
      file.type.startsWith("image/")
    );

    setError("");

    if (!imageFiles.length) {
      setError("Please select one or more image files.");
      return;
    }

    const newImages = imageFiles.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((current) => [...current, ...newImages]);
  }

  function removeImage(id: string) {
    setImages((current) => {
      const item = current.find((image) => image.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return current.filter((image) => image.id !== id);
    });
  }

  function clearImages() {
    images.forEach((image) => URL.revokeObjectURL(image.url));
    setImages([]);
    setError("");
  }

  async function createPdf() {
    if (!images.length) {
      setError("Please select at least one image.");
      return;
    }

    setIsConverting(true);
    setError("");

    try {
      let pdf: jsPDF | null = null;

      for (const image of images) {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => {
            if (typeof reader.result === "string") {
              resolve(reader.result);
            } else {
              reject(new Error("Could not read image."));
            }
          };

          reader.onerror = () => reject(new Error("Could not read image."));
          reader.readAsDataURL(image.file);
        });

        const dimensions = await new Promise<{
          width: number;
          height: number;
        }>((resolve, reject) => {
          const img = new Image();

          img.onload = () => {
            resolve({
              width: img.naturalWidth,
              height: img.naturalHeight,
            });
          };

          img.onerror = () => reject(new Error("Could not load image."));
          img.src = dataUrl;
        });

        const orientation =
          dimensions.width > dimensions.height ? "landscape" : "portrait";

        if (!pdf) {
          pdf = new jsPDF({
            orientation,
            unit: "mm",
            format: "a4",
          });
        } else {
          pdf.addPage("a4", orientation);
        }

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const maxWidth = pageWidth - margin * 2;
        const maxHeight = pageHeight - margin * 2;

        const ratio = Math.min(
          maxWidth / dimensions.width,
          maxHeight / dimensions.height
        );

        const width = dimensions.width * ratio;
        const height = dimensions.height * ratio;

        const x = (pageWidth - width) / 2;
        const y = (pageHeight - height) / 2;

        let imageFormat: "JPEG" | "PNG" = "JPEG";

        if (
          image.file.type === "image/png" ||
          image.file.type === "image/webp"
        ) {
          imageFormat = "PNG";
        }

        pdf.addImage(
          dataUrl,
          imageFormat,
          x,
          y,
          width,
          height,
          undefined,
          "FAST"
        );
      }

      pdf?.save("quickhub-images.pdf");
    } catch {
      setError(
        "Some images could not be added to the PDF. Please make sure the files are valid images and try again."
      );
    } finally {
      setIsConverting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white"><div className="flex items-center justify-between w-full mb-8"><Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">← Back</Link><Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Home</Link></div>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-400">
            QuickHub PDF Tools
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Image to PDF Converter
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Convert one or more images into a single PDF directly in your
            browser. No upload or account is required.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <label
            htmlFor="image-files"
            className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/50 px-6 text-center transition hover:border-indigo-500"
          >
            <div className="mb-4 text-5xl">📄</div>

            <span className="text-lg font-semibold">
              Drop images here
            </span>

            <span className="mt-2 text-sm text-slate-400">
              or click to choose JPG, PNG, WebP and other image files
            </span>

            <input
              id="image-files"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => {
                handleFiles(event.target.files);
                event.currentTarget.value = "";
              }}
            />
          </label>

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {images.length > 0 && (
            <div className="mt-8">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">
                  Selected Images ({images.length})
                </h2>

                <button
                  type="button"
                  onClick={clearImages}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
                >
                  Clear
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950"
                  >
                    <img
                      src={image.url}
                      alt={image.file.name}
                      className="h-48 w-full object-contain bg-slate-900"
                    />

                    <div className="p-4">
                      <p className="truncate text-sm font-medium">
                        {index + 1}. {image.file.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatBytes(image.file.size)}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="mt-3 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/10"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={createPdf}
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
            How to convert images to PDF
          </h2>

          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-400">
            <li>Select one or more images.</li>
            <li>Review the images before conversion.</li>
            <li>Click Convert to PDF.</li>
            <li>Your PDF is generated directly in your browser.</li>
          </ol>
        </section>
      </div>`r`n        <AdsterraAd />
      </main>
  );
}













