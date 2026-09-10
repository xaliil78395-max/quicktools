"use client";


import AdsterraAd from "@/components/AdsterraAd";
import Link from "next/link";
import { useState } from "react";

export default function JsonFormatter() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(text);
      setText(JSON.stringify(parsed, null, 2));
      setError("");
    } catch {
      setError("Invalid JSON. Please check your input.");
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(text);
      setText(JSON.stringify(parsed));
      setError("");
    } catch {
      setError("Invalid JSON. Please check your input.");
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
            JSON Formatter
          </h1>

          <p className="mt-3 text-muted-foreground">
            Format and validate JSON instantly.
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
            placeholder="Paste your JSON here..."
            className="min-h-[350px] w-full resize-y rounded-xl border bg-background p-4 font-mono text-sm outline-none transition focus:ring-2 focus:ring-primary"
            aria-label="JSON input"
          />

          {error && (
            <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={formatJson}
              className="rounded-xl border px-4 py-3 font-medium transition hover:bg-muted"
            >
              Format JSON
            </button>

            <button
              type="button"
              onClick={minifyJson}
              className="rounded-xl border px-4 py-3 font-medium transition hover:bg-muted"
            >
              Minify JSON
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
            Free online JSON formatter
          </h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            Use this free JSON formatter to format, minify, validate, and copy
            JSON data directly in your browser. Paste your JSON above and
            choose the action you need.
          </p>
        </section>
      </div>
    </main>
  );
}


