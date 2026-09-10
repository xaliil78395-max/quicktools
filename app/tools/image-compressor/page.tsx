"use client";


import AdsterraAd from "@/components/AdsterraAd";
import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";

type ImageInfo = {
  file: File;
  previewUrl: string;
  width: number;
  height: number;
};

export default function ImageCompressor() {
  const [image, setImage] = useState<ImageInfo | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [outputFormat, setOutputFormat] = useState("image/webp");
  const [compressedUrl, setCompressedUrl] = useState("");
  const [compressedSize, setCompressedSize] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (image?.previewUrl) {
        URL.revokeObjectURL(image.previewUrl);
      }
    };
  }, [image?.previewUrl]);

  const handleFile = (file: File) => {
    setError("");
    setCompressedSize(0);

    if (compressedUrl) {
      URL.revokeObjectURL(compressedUrl);
      setCompressedUrl("");
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError("Please select an image smaller than 25 MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      setImage({
        file,
        previewUrl,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      setError("This image could not be loaded.");
    };

    img.src = previewUrl;
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const compressImage = () => {
    if (!image) return;

    setIsCompressing(true);
    setError("");

    const img = new Image();

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Canvas is not supported.");
        }

        context.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setError("Compression failed. Please try again.");
              setIsCompressing(false);
              return;
            }

            if (blob.size >= image.file.size) {
              if (compressedUrl) {
                URL.revokeObjectURL(compressedUrl);
                setCompressedUrl("");
              }

              setCompressedSize(0);
              setError(
                "This image is already well optimized. The compressed version would be larger than the original."
              );
              setIsCompressing(false);
              return;
            }

            const url = URL.createObjectURL(blob);

            setCompressedUrl((oldUrl) => {
              if (oldUrl) {
                URL.revokeObjectURL(oldUrl);
              }

              return url;
            });

            setCompressedSize(blob.size);
            setIsCompressing(false);
          },
          outputFormat,
          quality
        );
      } catch {
        setError("Compression failed. Please try again.");
        setIsCompressing(false);
      }
    };

    img.onerror = () => {
      setError("The selected image could not be processed.");
      setIsCompressing(false);
    };

    img.src = image.previewUrl;
  };

  const reset = () => {
    if (image?.previewUrl) {
      URL.revokeObjectURL(image.previewUrl);
    }

    if (compressedUrl) {
      URL.revokeObjectURL(compressedUrl);
    }

    setImage(null);
    setCompressedUrl("");
    setCompressedSize(0);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;

    const units = ["KB", "MB", "GB"];
    let value = bytes / 1024;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }

    return `${value.toFixed(value >= 10 ? 1 : 2)} ${units[unitIndex]}`;
  };

  const savings =
    image && compressedSize > 0
      ? Math.max(0, Math.round((1 - compressedSize / image.file.size) * 100))
      : 0;

  const extension =
    outputFormat === "image/png"
      ? "png"
      : outputFormat === "image/jpeg"
        ? "jpg"
        : "webp";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">

        <AdsterraAd />
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <Link href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Back to QuickTools
          </Link>

          <div className="mt-8 inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
            Image Tool
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            Image Compressor
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Compress your images directly in your browser. Your images are not
            uploaded to our server.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          {!image ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full rounded-3xl border-2 border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm transition hover:border-indigo-400 hover:bg-indigo-50/30 sm:px-10"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">
                ↑
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                Choose an image
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                JPG, PNG, WebP and other common image formats · Max 25 MB
              </p>

              <span className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
                Select Image
              </span>
            </button>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <div className="overflow-hidden rounded-2xl bg-slate-100">
                    <img
                      src={image.previewUrl}
                      alt="Selected image preview"
                      className="max-h-[420px] w-full object-contain"
                    />
                  </div>

                  <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                    <div className="flex flex-wrap justify-between gap-3 text-sm">
                      <span className="font-medium text-slate-700">
                        Original
                      </span>
                      <span className="text-slate-500">
                        {formatBytes(image.file.size)}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap justify-between gap-3 text-sm">
                      <span className="text-slate-500">
                        {image.width} × {image.height}px
                      </span>
                      <span className="text-slate-500">
                        {image.file.type || "Image"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    Compression settings
                  </h2>

                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="quality"
                        className="text-sm font-medium text-slate-700"
                      >
                        Quality
                      </label>

                      <span className="text-sm font-semibold text-indigo-600">
                        {Math.round(quality * 100)}%
                      </span>
                    </div>

                    <input
                      id="quality"
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={quality}
                      onChange={(event) =>
                        setQuality(Number(event.target.value))
                      }
                      className="mt-4 w-full accent-indigo-600"
                    />

                    <div className="mt-2 flex justify-between text-xs text-slate-400">
                      <span>Smaller file</span>
                      <span>Higher quality</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label
                      htmlFor="format"
                      className="text-sm font-medium text-slate-700"
                    >
                      Output format
                    </label>

                    <select
                      id="format"
                      value={outputFormat}
                      onChange={(event) =>
                        setOutputFormat(event.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="image/webp">WebP</option>
                      <option value="image/jpeg">JPG</option>
                      <option value="image/png">PNG</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={compressImage}
                    disabled={isCompressing}
                    className="mt-7 w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isCompressing ? "Compressing..." : "Compress Image"}
                  </button>

                  {compressedUrl && (
                    <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-emerald-800">
                            Compression complete
                          </p>

                          <p className="mt-1 text-sm text-emerald-700">
                            {formatBytes(compressedSize)} · {savings}% smaller
                          </p>
                        </div>

                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
                          Ready
                        </span>
                      </div>

                      <a
                        href={compressedUrl}
                        download={`quicktools-compressed.${extension}`}
                        className="mt-4 flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                      >
                        Download Image
                      </a>
                    </div>
                  )}

                  {error && (
                    <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={reset}
                    className="mt-5 w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Choose Another Image
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold">Free image compression</h2>

          <p className="mt-3 leading-7 text-slate-600">
            QuickTools compresses your image directly on your device. This
            means your original image does not need to be uploaded to a remote
            server before compression.
          </p>

          <p className="mt-3 leading-7 text-slate-600">
            Choose your preferred quality and output format, compress the
            image, then download the result immediately.
          </p>
        </div>
      </section>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </main>
  );
}







