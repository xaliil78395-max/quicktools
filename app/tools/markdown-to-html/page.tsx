"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function inlineMarkdown(value: string) {
  let text = escapeHtml(value);

  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>');
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  text = text.replace(/_([^_]+)_/g, "<em>$1</em>");
  text = text.replace(/~~([^~]+)~~/g, "<del>$1</del>");

  return text;
}

function markdownToHtml(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const output: string[] = [];
  let paragraph: string[] = [];
  let inCodeBlock = false;
  let codeLanguage = "";
  let codeLines: string[] = [];
  let inUl = false;
  let inOl = false;

  const closeLists = () => {
    if (inUl) {
      output.push("</ul>");
      inUl = false;
    }

    if (inOl) {
      output.push("</ol>");
      inOl = false;
    }
  };

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      output.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      if (!inCodeBlock) {
        flushParagraph();
        closeLists();
        inCodeBlock = true;
        codeLanguage = line.trim().slice(3).trim();
        codeLines = [];
      } else {
        const className = codeLanguage ? ` class="language-${escapeHtml(codeLanguage)}"` : "";
        output.push(`<pre><code${className}>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        inCodeBlock = false;
        codeLanguage = "";
        codeLines = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (/^#{1,6}\s+/.test(line)) {
      flushParagraph();
      closeLists();

      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        output.push(`<h${level}>${inlineMarkdown(match[2])}</h${level}>`);
      }
      continue;
    }

    if (/^>\s?/.test(line)) {
      flushParagraph();
      closeLists();
      output.push(`<blockquote>${inlineMarkdown(line.replace(/^>\s?/, ""))}</blockquote>`);
      continue;
    }

    if (/^[-*+]\s+/.test(line)) {
      flushParagraph();

      if (inOl) {
        output.push("</ol>");
        inOl = false;
      }

      if (!inUl) {
        output.push("<ul>");
        inUl = true;
      }

      output.push(`<li>${inlineMarkdown(line.replace(/^[-*+]\s+/, ""))}</li>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      flushParagraph();

      if (inUl) {
        output.push("</ul>");
        inUl = false;
      }

      if (!inOl) {
        output.push("<ol>");
        inOl = true;
      }

      output.push(`<li>${inlineMarkdown(line.replace(/^\d+\.\s+/, ""))}</li>`);
      continue;
    }

    if (/^---+$/.test(line.trim()) || /^\*\*\*+$/.test(line.trim())) {
      flushParagraph();
      closeLists();
      output.push("<hr>");
      continue;
    }

    if (line.trim() === "") {
      flushParagraph();
      closeLists();
      continue;
    }

    closeLists();
    paragraph.push(line.trim());
  }

  if (inCodeBlock) {
    const className = codeLanguage ? ` class="language-${escapeHtml(codeLanguage)}"` : "";
    output.push(`<pre><code${className}>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
  }

  flushParagraph();
  closeLists();

  return output.join("\n");
}

export default function MarkdownToHtmlPage() {
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = () => {
    setHtml(markdownToHtml(markdown));
    setCopied(false);
  };

  const copyHtml = async () => {
    if (!html) return;

    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadHtml = () => {
    if (!html) return;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "converted.html";
    link.click();

    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setMarkdown("");
    setHtml("");
    setCopied(false);
  };

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium hover:underline">
            ← Back
          </Link>

          <Link href="/" className="text-sm font-medium hover:underline">
            Home
          </Link>
        </div>

        <h1 className="mb-2 text-3xl font-bold">Markdown to HTML Converter</h1>
        <p className="mb-6 text-muted-foreground">
          Convert Markdown into clean HTML directly in your browser.
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          <section>
            <label className="mb-2 block text-sm font-medium">
              Markdown
            </label>

            <textarea
              value={markdown}
              onChange={(event) => setMarkdown(event.target.value)}
              placeholder={`# Hello World

This is **bold** and *italic* text.

- Item one
- Item two

[QuickHub](https://quickhub.world)`}
              className="min-h-[360px] w-full rounded-lg border bg-background p-4 font-mono text-sm outline-none focus:ring-2"
            />
          </section>

          <section>
            <label className="mb-2 block text-sm font-medium">
              HTML Output
            </label>

            <textarea
              value={html}
              readOnly
              placeholder="HTML output will appear here..."
              className="min-h-[360px] w-full rounded-lg border bg-muted/20 p-4 font-mono text-sm outline-none"
            />
          </section>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={convert}
            className="rounded-lg border px-4 py-2 font-medium transition hover:bg-muted"
          >
            Convert
          </button>

          <button
            type="button"
            onClick={copyHtml}
            disabled={!html}
            className="rounded-lg border px-4 py-2 font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? "Copied!" : "Copy"}
          </button>

          <button
            type="button"
            onClick={downloadHtml}
            disabled={!html}
            className="rounded-lg border px-4 py-2 font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Download HTML
          </button>

          <button
            type="button"
            onClick={clearAll}
            className="rounded-lg border px-4 py-2 font-medium transition hover:bg-muted"
          >
            Clear
          </button>
        </div>

        <RelatedTools currentTool="markdown-to-html" />

        <div className="mt-10 min-h-[90px] rounded-lg border p-4 text-center text-sm text-muted-foreground">
          Advertisement
        </div>
      </div>
    </main>
  );
}
