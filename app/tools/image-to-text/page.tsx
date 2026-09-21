"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { createWorker } from "tesseract.js";
import RelatedTools from "@/components/RelatedTools";

const languages = [
  { code: "eng", name: "English" },
  { code: "fra", name: "French" },
  { code: "ara", name: "Arabic" },
  { code: "spa", name: "Spanish" },
  { code: "deu", name: "German" },
  { code: "por", name: "Portuguese" },
  { code: "ita", name: "Italian" },
  { code: "jpn", name: "Japanese" },
  { code: "chi_sim", name: "Chinese (Simplified)" },
  { code: "chi_tra", name: "Chinese (Traditional)" },
  { code: "kor", name: "Korean" },
  { code: "rus", name: "Russian" },
];

export default function ImageToTextPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [language, setLanguage] = useState("eng");
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File | undefined) => {
    if (!selectedFile || !selectedFile.type.startsWith("image/")) {
      setStatus("Please select a valid image file.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setText("");
    setProgress(0);
    setStatus("");
  };

  const extractText = async () => {
    if (!file) {
      setStatus("Please select an image first.");
      return;
    }

    setProcessing(true);
    setText("");
    setProgress(0);
    setStatus("Preparing OCR...");

    let worker;

    try {
      worker = await createWorker(language, 1, {
        logger: (message) => {
          if (typeof message.progress === "number") {
            setProgress(Math.round(message.progress * 100));
          }

          if (message.status) {
            setStatus(message.status);
          }
        },
      });

      const result = await worker.recognize(file);
      setText(result.data.text.trim());
      setProgress(100);
      setStatus("Text extraction complete.");
    } catch (error) {
      console.error(error);
      setStatus("Could not extract text from this image. Please try another image.");
    } finally {
      if (worker) {
        await worker.terminate();
      }
      setProcessing(false);
    }
  };

  const copyText = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setStatus("Text copied to clipboard.");
  };

  const downloadText = () => {
    if (!text) return;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "extracted-text.txt";
    link.click();

    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setFile(null);
    setPreview("");
    setText("");
    setProgress(0);
    setStatus("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Back
          </Link>

          <Link
            href="/"
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Home
          </Link>
        </div>

        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <h1 className="text-2xl font-bold">Image to Text</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Extract text from images directly in your browser.
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Image
              </label>

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={(event) => handleFile(event.target.files?.[0])}
                className="block w-full rounded-lg border p-3 text-sm"
              />

              {preview && (
                <div className="mt-4 overflow-hidden rounded-lg border">
                  <img
                    src={preview}
                    alt="Selected image"
                    className="max-h-96 w-full object-contain"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Language
              </label>

              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                disabled={processing}
                className="w-full rounded-lg border bg-background p-3 text-sm"
              >
                {languages.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </select>

              <button
                onClick={extractText}
                disabled={!file || processing}
                className="mt-4 w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processing ? "Extracting Text..." : "Extract Text"}
              </button>

              {processing && (
                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                    <span>{status}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <label className="mb-2 block text-sm font-medium">
              Extracted Text
            </label>

            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Extracted text will appear here..."
              className="min-h-64 w-full rounded-lg border bg-background p-4 text-sm"
            />

            <div className="mt-3 flex flex-wrap gap-3">
              <button
                onClick={copyText}
                disabled={!text}
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
              >
                Copy
              </button>

              <button
                onClick={downloadText}
                disabled={!text}
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
              >
                Download TXT
              </button>

              <button
                onClick={clearAll}
                disabled={!file && !text}
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
              >
                Clear
              </button>
            </div>

            {status && !processing && (
              <p className="mt-3 text-sm text-muted-foreground">{status}</p>
            )}
          </div>
        </div>

        <RelatedTools currentTool="image-to-text" />

        <div className="mt-8 rounded-lg border p-4 text-center text-sm text-muted-foreground">
          Advertisement
        </div>
      </div>
    </main>
  );
}
