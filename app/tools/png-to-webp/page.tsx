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

export default function PngToWebp() {
  const [image, setImage] = useState<ImageInfo | null>(null);
  const [convertedUrl, setConvertedUrl] = useState("");
  const [convertedSize, setConvertedSize] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (image?.previewUrl) {
        URL.revokeObjectURL(image.previewUrl);
      }

      if (convertedUrl) {
        URL.revokeObjectURL(convertedUrl);
      }
    };
  }, [image?.previewUrl, convertedUrl]);

  const handleFile = (file: File) => {
    setError("");
    setConvertedSize(0);

    if (convertedUrl) {
      URL.revokeObjectURL(convertedUrl);
      setConvertedUrl("");
    }

    if (file.type !== "image/png") {
      setError("Please select a PNG image.");
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

  const convertToWebp = () => {
    if (!image) return;

    setIsConverting(true);
    setError("");

    const img = new Image();

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Canvas is not supported.");
        }

        context.drawImage(img, 0, 0, image.width, image.height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setError("Conversion failed. Please try again.");
              setIsConverting(false);
              return;
            }

            const url = URL.createObjectURL(blob);

            setConvertedUrl((oldUrl) => {
              if (oldUrl) {
                URL.revokeObjectURL(oldUrl);
              }

              return url;
            });

            setConvertedSize(blob.size);
            setIsConverting(false);
          },
          "image/webp",
          0.9
        );
      } catch {
        setError("Conversion failed. Please try again.");
        setIsConverting(false);
      }
    };

    img.onerror = () => {
      setError("The selected image could not be processed.");
      setIsConverting(false);
    };

    img.src = image.previewUrl;
  };

  const reset = () => {
    if (image?.previewUrl) {
      URL.revokeObjectURL(image.previewUrl);
    }

    if (convertedUrl) {
      URL.revokeObjectURL(convertedUrl);
    }

    setImage(null);
    setConvertedUrl("");
    setConvertedSize(0);
    setError("");
    setIsConverting(false);

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

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">

        <AdsterraAd />
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Back to QuickTools
          </Link>

          <div className="mt-8 inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
            Image Tool
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            PNG to WebP Converter
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Convert PNG images to WebP directly in your browser. Your images
            are not uploaded to our server.
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
                Choose a PNG image
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                PNG · Max 25 MB
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
                      alt="Selected PNG preview"
                      className="max-h-[420px] w-full object-contain"
                    />
                  </div>

                  <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                    <div className="flex flex-wrap justify-between gap-3 text-sm">
                      <span className="font-medium text-slate-700">
                        Original PNG
                      </span>

                      <span className="text-slate-500">
                        {formatBytes(image.file.size)}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap justify-between gap-3 text-sm">
                      <span className="text-slate-500">
                        {image.width} × {image.height}px
                      </span>

                      <span className="text-slate-500">PNG</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    Convert to WebP
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Your image will keep its original dimensions and preserve
                    transparent areas.
                  </p>

                  <button
                    type="button"
                    onClick={convertToWebp}
                    disabled={isConverting}
                    className="mt-7 w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isConverting ? "Converting..." : "Convert to WebP"}
                  </button>

                  {convertedUrl && (
                    <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-emerald-800">
                            Conversion complete
                          </p>

                          <p className="mt-1 text-sm text-emerald-700">
                            WebP · {image.width} × {image.height}px ·{" "}
                            {formatBytes(convertedSize)}
                          </p>
                        </div>

                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
                          Ready
                        </span>
                      </div>

                      <a
                        href={convertedUrl}
                        download="quicktools-converted.webp"
                        className="mt-4 flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                      >
                        Download WebP
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
          <h2 className="text-xl font-bold">Free PNG to WebP conversion</h2>

          <p className="mt-3 leading-7 text-slate-600">
            QuickTools converts your PNG image directly on your device. Your
            original image does not need to be uploaded to a remote server.
          </p>

          <p className="mt-3 leading-7 text-slate-600">
            The converted WebP keeps the original dimensions and supports
            transparent areas.
          </p>
        </div>
      </section>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,.png"
        onChange={handleInputChange}
        className="hidden"
      />
    </main>
  );
}


