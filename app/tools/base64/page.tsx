"use client";


import AdsterraAd from "@/components/AdsterraAd";
import Link from "next/link";
import { useState } from "react";

export default function Base64Tool() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const encodeBase64 = () => {
    try {
      const encoded = btoa(
        String.fromCharCode(...new TextEncoder().encode(text))
      );

      setText(encoded);
      setError("");
      setCopied(false);
    } catch {
      setError("Unable to encode this text.");
    }
  };

  const decodeBase64 = () => {
    try {
      const bytes = Uint8Array.from(atob(text), (char) => char.charCodeAt(0));
      const decoded = new TextDecoder().decode(bytes);

      setText(decoded);
      setError("");
      setCopied(false);
    } catch {
      setError("Invalid Base64. Please check your input.");
    }
  };

  const copyText = async () => {
    if (!text) return;

    await navigator.clipboard.writeText(text);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const clearText = () => {
    setText("");
    setError("");
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
            Base64 Encoder
          </h1>

          <p className="mt-3 text-muted-foreground">
            Encode and decode Base64 text instantly.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError("");
              setCopied(false);
            }}
            placeholder="Type or paste your text here..."
            className="min-h-[350px] w-full resize-y rounded-xl border bg-background p-4 font-mono text-sm outline-none transition focus:ring-2 focus:ring-primary"
            aria-label="Base64 text"
          />

          {error && (
            <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={encodeBase64}
              className="rounded-xl border px-4 py-3 font-medium transition hover:bg-muted"
            >
              Encode
            </button>

            <button
              type="button"
              onClick={decodeBase64}
              className="rounded-xl border px-4 py-3 font-medium transition hover:bg-muted"
            >
              Decode
            </button>

            <button
              type="button"
              onClick={copyText}
              className="rounded-xl border px-4 py-3 font-medium transition hover:bg-muted"
            >
              {copied ? "Copied!" : "Copy"}
            </button>

            <button
              type="button"
              onClick={clearText}
              className="rounded-xl border px-4 py-3 font-medium transition hover:bg-muted"
            >
              Clear
            </button>
          </div>
        </div>


        <AdsterraAd />
        <section className="mt-12">
          <h2 className="text-2xl font-bold">
            Free online Base64 encoder and decoder
          </h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            Use this free Base64 tool to encode text into Base64 or decode
            Base64 back into readable text. The tool works directly in your
            browser and supports Unicode text.
          </p>
        </section>
      </div>
    </main>
  );
}


