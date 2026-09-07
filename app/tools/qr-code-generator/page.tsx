"use client";

import Link from "next/link";
import QRCode from "qrcode";
import { useState } from "react";

export default function QRCodeGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(300);
  const [qrCode, setQrCode] = useState("");
  const [copied, setCopied] = useState(false);

  const generateQRCode = async () => {
    if (!text.trim()) {
      setQrCode("");
      return;
    }

    const dataUrl = await QRCode.toDataURL(text, {
      width: size,
      margin: 2,
      errorCorrectionLevel: "M",
    });

    setQrCode(dataUrl);
    setCopied(false);
  };

  const downloadQRCode = () => {
    if (!qrCode) return;

    const link = document.createElement("a");
    link.href = qrCode;
    link.download = "quicktools-qr-code.png";
    link.click();
  };

  const copyQRCode = async () => {
    if (!qrCode) return;

    try {
      const response = await fetch(qrCode);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  };

  const clearQRCode = () => {
    setText("");
    setQrCode("");
    setCopied(false);
  };

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            ← Back
          </Link>

          <Link
            href="/"
            className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Home
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            QR Code Generator
          </h1>

          <p className="mt-3 text-muted-foreground">
            Create QR codes for links, text, and more.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setCopied(false);
            }}
            placeholder="Enter a URL or text..."
            className="min-h-[180px] w-full resize-y rounded-xl border bg-background p-4 text-sm outline-none transition focus:ring-2 focus:ring-primary"
            aria-label="QR code text"
          />

          <div className="mt-6">
            <label className="flex items-center justify-between text-sm font-medium">
              <span>QR Code Size</span>
              <span>{size}px</span>
            </label>

            <input
              type="range"
              min="150"
              max="600"
              step="50"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="mt-3 w-full"
            />
          </div>

          {qrCode && (
            <div className="mt-6 flex justify-center rounded-xl border bg-white p-6">
              <img
                src={qrCode}
                alt="Generated QR code"
                className="max-w-full"
              />
            </div>
          )}

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={generateQRCode}
              className="rounded-xl border px-4 py-3 font-medium transition hover:bg-muted"
            >
              Generate QR Code
            </button>

            <button
              type="button"
              onClick={downloadQRCode}
              disabled={!qrCode}
              className="rounded-xl border px-4 py-3 font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Download
            </button>

            <button
              type="button"
              onClick={copyQRCode}
              disabled={!qrCode}
              className="rounded-xl border px-4 py-3 font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied ? "Copied!" : "Copy"}
            </button>

            <button
              type="button"
              onClick={clearQRCode}
              className="rounded-xl border px-4 py-3 font-medium transition hover:bg-muted"
            >
              Clear
            </button>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">
            Free online QR code generator
          </h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            Create QR codes for websites, text, and other information directly
            in your browser. Generate, download, or copy your QR code instantly.
          </p>
        </section>
      </div>
    </main>
  );
}
