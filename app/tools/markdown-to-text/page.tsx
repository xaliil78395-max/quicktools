"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

function markdownToPlainText(markdown: string): string {
  let text = markdown.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  text = text.replace(/```[\s\S]*?```/g, (match) => {
    return match.replace(/^```[^\n]*\n?/, "").replace(/\n?```$/, "");
  });

  text = text.replace(/`([^`]+)`/g, "$1");

  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1");
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  text = text.replace(/^#{1,6}\s+/gm, "");
  text = text.replace(/^\s{0,3}>\s?/gm, "");

  text = text.replace(/^\s*([-*_])(?:\s*\1){2,}\s*$/gm, "");

  text = text.replace(/^\s*(?:[-+*]|\d+\.)\s+/gm, "");

  text = text.replace(/(\*\*|__)(.*?)\1/g, "$2");
  text = text.replace(/(\*|_)(.*?)\1/g, "$2");
  text = text.replace(/~~(.*?)~~/g, "$1");

  text = text.replace(/^\s*\|?[-:\s|]+\|?\s*$/gm, "");
  text = text.replace(/\|/g, " ");

  text = text.replace(/<[^>]*>/g, "");

  text = text
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return text;
}

export default function MarkdownToTextPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    setOutput(markdownToPlainText(input));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!output) return;

    await navigator.clipboard.writeText(output);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    if (!output) return;

    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "converted-text.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setCopied(false);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
        >
          ← Back
        </Link>

        <Link
          href="/"
          className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
        >
          Home
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Markdown to Plain Text Converter</h1>
        <p className="mt-2 text-muted-foreground">
          Remove Markdown formatting and convert your content to plain text.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <label className="mb-2 block text-sm font-medium">
            Markdown Input
          </label>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="# Hello QuickHub&#10;&#10;This is **bold** and *italic*."
            className="min-h-[360px] w-full rounded-lg border bg-background p-4 font-mono text-sm outline-none focus:ring-2"
          />
        </section>

        <section>
          <label className="mb-2 block text-sm font-medium">
            Plain Text Output
          </label>

          <textarea
            value={output}
            readOnly
            placeholder="Your plain text will appear here..."
            className="min-h-[360px] w-full rounded-lg border bg-background p-4 font-mono text-sm outline-none"
          />
        </section>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={handleConvert}
          className="rounded-md bg-primary px-5 py-2.5 text-primary-foreground hover:opacity-90"
        >
          Convert
        </button>

        <button
          onClick={handleCopy}
          disabled={!output}
          className="rounded-md border px-5 py-2.5 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copied ? "Copied!" : "Copy"}
        </button>

        <button
          onClick={handleDownload}
          disabled={!output}
          className="rounded-md border px-5 py-2.5 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          Download TXT
        </button>

        <button
          onClick={handleClear}
          className="rounded-md border px-5 py-2.5 hover:bg-muted"
        >
          Clear
        </button>
      </div>

      <RelatedTools currentTool="markdown-to-text" />

      <div className="mt-10 rounded-lg border p-4 text-center text-sm text-muted-foreground">
        Advertisement
      </div>
    </main>
  );
}
