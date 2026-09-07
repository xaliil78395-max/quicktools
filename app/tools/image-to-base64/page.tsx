"use client";

import Link from "next/link";
import { ChangeEvent, useRef, useState } from "react";

type ImageInfo = {
  file: File;
  previewUrl: string;
};

export default function ImageToBase64() {
  const [image, setImage] = useState<ImageInfo | null>(null);
  const [base64, setBase64] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError("");
    setCopied(false);
    setBase64("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError("Please select an image smaller than 25 MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        setError("The image could not be converted.");
        URL.revokeObjectURL(previewUrl);
        return;
      }

      setImage({
        file,
        previewUrl,
      });

      setBase64(result);
    };

    reader.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      setError("The image could not be converted.");
    };

    reader.readAsDataURL(file);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const copyBase64 = async () => {
    if (!base64) return;

    try {
      await navigator.clipboard.writeText(base64);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Copy failed. Please copy the text manually.");
    }
  };

  const reset = () => {
    if (image?.previewUrl) {
      URL.revokeObjectURL(image.previewUrl);
    }

    setImage(null);
    setBase64("");
    setCopied(false);
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

  const base64Only = base64.includes(",")
    ? base64.substring(base64.indexOf(",") + 1)
    : base64;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
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
            Image to Base64
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Convert an image to Base64 directly in your browser. Your image is
            never uploaded to our server.
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
                JPG, PNG, WebP, GIF and other common image formats · Max 25 MB
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
                        File
                      </span>
                      <span className="max-w-[65%] truncate text-slate-500">
                        {image.file.name}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap justify-between gap-3 text-sm">
                      <span className="text-slate-500">
                        {formatBytes(image.file.size)}
                      </span>
                      <span className="text-slate-500">
                        {image.file.type || "Image"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    Base64 result
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    This Data URL can be used directly in HTML, CSS, or
                    JavaScript.
                  </p>

                  <textarea
                    value={base64}
                    readOnly
                    spellCheck={false}
                    className="mt-5 h-56 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-6 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                  <div className="mt-3 rounded-2xl bg-slate-50 p-4">
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="font-medium text-slate-700">
                        Base64 length
                      </span>
                      <span className="text-slate-500">
                        {base64Only.length.toLocaleString()} characters
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={copyBase64}
                    className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    {copied ? "Copied!" : "Copy Base64"}
                  </button>

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
          <h2 className="text-xl font-bold">Free Image to Base64 Converter</h2>

          <p className="mt-3 leading-7 text-slate-600">
            QuickTools converts your image to a Base64 Data URL directly on
            your device. Your image does not need to be uploaded to a remote
            server.
          </p>

          <p className="mt-3 leading-7 text-slate-600">
            Copy the generated Base64 value and use it in HTML, CSS,
            JavaScript, emails, or other projects that support Data URLs.
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
