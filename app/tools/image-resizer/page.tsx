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

export default function ImageResizer() {
  const [image, setImage] = useState<ImageInfo | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockRatio, setLockRatio] = useState(true);
  const [outputFormat, setOutputFormat] = useState("image/webp");
  const [resizedUrl, setResizedUrl] = useState("");
  const [resizedSize, setResizedSize] = useState(0);
  const [isResizing, setIsResizing] = useState(false);
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
    setResizedSize(0);

    if (resizedUrl) {
      URL.revokeObjectURL(resizedUrl);
      setResizedUrl("");
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

      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
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

  const handleWidthChange = (value: number) => {
    if (!image) return;

    setWidth(value);

    if (lockRatio && image.width > 0 && value > 0) {
      setHeight(Math.round((value / image.width) * image.height));
    }
  };

  const handleHeightChange = (value: number) => {
    if (!image) return;

    setHeight(value);

    if (lockRatio && image.height > 0 && value > 0) {
      setWidth(Math.round((value / image.height) * image.width));
    }
  };

  const resizeImage = () => {
    if (!image) return;

    if (width < 1 || height < 1) {
      setError("Please enter valid width and height values.");
      return;
    }

    if (width > 10000 || height > 10000) {
      setError("Maximum dimensions are 10,000 Ã— 10,000 pixels.");
      return;
    }

    setIsResizing(true);
    setError("");

    const img = new Image();

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Canvas is not supported.");
        }

        if (outputFormat === "image/jpeg") {
          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, width, height);
        }

        context.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setError("Resizing failed. Please try again.");
              setIsResizing(false);
              return;
            }

            const url = URL.createObjectURL(blob);

            setResizedUrl((oldUrl) => {
              if (oldUrl) {
                URL.revokeObjectURL(oldUrl);
              }

              return url;
            });

            setResizedSize(blob.size);
            setIsResizing(false);
          },
          outputFormat,
          0.9
        );
      } catch {
        setError("Resizing failed. Please try again.");
        setIsResizing(false);
      }
    };

    img.onerror = () => {
      setError("The selected image could not be processed.");
      setIsResizing(false);
    };

    img.src = image.previewUrl;
  };

  const reset = () => {
    if (image?.previewUrl) {
      URL.revokeObjectURL(image.previewUrl);
    }

    if (resizedUrl) {
      URL.revokeObjectURL(resizedUrl);
    }

    setImage(null);
    setWidth(0);
    setHeight(0);
    setResizedUrl("");
    setResizedSize(0);
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
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            â† Back to QuickTools
          </Link>

          <div className="mt-8 inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
            Image Tool
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            Image Resizer
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Resize your images to exact dimensions directly in your browser.
            Your images are not uploaded to our server.
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
                â†‘
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                Choose an image
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                JPG, PNG, WebP and other common image formats Â· Max 25 MB
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
                        {image.width} Ã— {image.height}px
                      </span>

                      <span className="text-slate-500">
                        {image.file.type || "Image"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    Resize settings
                  </h2>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="width"
                        className="text-sm font-medium text-slate-700"
                      >
                        Width
                      </label>

                      <input
                        id="width"
                        type="number"
                        min="1"
                        max="10000"
                        value={width}
                        onChange={(event) =>
                          handleWidthChange(Number(event.target.value))
                        }
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="height"
                        className="text-sm font-medium text-slate-700"
                      >
                        Height
                      </label>

                      <input
                        id="height"
                        type="number"
                        min="1"
                        max="10000"
                        value={height}
                        onChange={(event) =>
                          handleHeightChange(Number(event.target.value))
                        }
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                  </div>

                  <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={lockRatio}
                      onChange={(event) =>
                        setLockRatio(event.target.checked)
                      }
                      className="h-4 w-4 accent-indigo-600"
                    />

                    <span className="text-sm font-medium text-slate-700">
                      Lock aspect ratio
                    </span>
                  </label>

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
                    onClick={resizeImage}
                    disabled={isResizing}
                    className="mt-7 w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isResizing ? "Resizing..." : "Resize Image"}
                  </button>

                  {resizedUrl && (
                    <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-emerald-800">
                            Resize complete
                          </p>

                          <p className="mt-1 text-sm text-emerald-700">
                            {width} Ã— {height}px Â·{" "}
                            {formatBytes(resizedSize)}
                          </p>
                        </div>

                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
                          Ready
                        </span>
                      </div>

                      <a
                        href={resizedUrl}
                        download={`quicktools-resized.${extension}`}
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
          <h2 className="text-xl font-bold">Free image resizing</h2>

          <p className="mt-3 leading-7 text-slate-600">
            QuickTools resizes your image directly on your device. Your
            original image does not need to be uploaded to a remote server.
          </p>

          <p className="mt-3 leading-7 text-slate-600">
            Enter the exact dimensions you need, keep the aspect ratio locked
            when desired, choose an output format, and download the resized
            image.
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

