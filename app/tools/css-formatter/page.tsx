"use client";

import Link from "next/link";
import { useState } from "react";
import RelatedTools from "@/components/RelatedTools";
import AdsterraAd from "@/components/AdsterraAd";

function beautifyCss(css: string) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, (match) => `\n${match}\n`)
    .replace(/\s*{\s*/g, " {\n")
    .replace(/\s*}\s*/g, "\n}\n")
    .replace(/;\s*/g, ";\n")
    .replace(/:\s*/g, ": ")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (line === "}") {
        return line;
      }

      return line;
    })
    .join("\n")
    .replace(
      /(^|\n)([^{}\n]+) \{\n([\s\S]*?)\n\}/g,
      (_, start, selector, declarations) => {
        const formattedDeclarations = declarations
          .split("\n")
          .map((line: string) => `  ${line.trim()}`)
          .join("\n");

        return `${start}${selector.trim()} {\n${formattedDeclarations}\n}`;
      },
    );
}

export default function CssFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function formatCssContent() {
    setError("");
    setCopied(false);

    if (!input.trim()) {
      setOutput("");
      setError("Please paste CSS before formatting.");
      return;
    }

    try {
      const style = document.createElement("style");
      style.textContent = input;

      document.head.appendChild(style);

      const rules = Array.from(style.sheet?.cssRules ?? []);
      const hasRules = rules.length > 0;

      style.remove();

      if (!hasRules) {
        setOutput("");
        setError("Unable to parse this CSS. Please check your CSS syntax.");
        return;
      }

      setOutput(beautifyCss(input));
    } catch {
      setOutput("");
      setError("Invalid CSS. Please check your CSS syntax and try again.");
    }
  }

  async function copyOutput() {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Unable to copy automatically. Please copy the result manually.");
    }
  }

  function clearAll() {
    setInput("");
    setOutput("");
    setError("");
    setCopied(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex w-full items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            ← Back
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            Home
          </Link>
        </div>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Developer Tools
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
            CSS Formatter
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Format and beautify CSS online with clean indentation and readable
            structure. Fast, private, and processed directly in your browser.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label
            htmlFor="css-input"
            className="mb-3 block text-sm font-semibold text-slate-800"
          >
            CSS Input
          </label>

          <textarea
            id="css-input"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError("");
            }}
            placeholder="Paste your CSS here..."
            className="min-h-[300px] w-full resize-y rounded-xl border border-slate-300 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            spellCheck={false}
          />

          {error && (
            <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={formatCssContent}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Format CSS
            </button>

            <button
              type="button"
              onClick={copyOutput}
              disabled={!output}
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied ? "Copied!" : "Copy"}
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Clear
            </button>
          </div>

          {output && (
            <div className="mt-8">
              <label
                htmlFor="css-output"
                className="mb-3 block text-sm font-semibold text-slate-800"
              >
                Formatted CSS
              </label>

              <textarea
                id="css-output"
                value={output}
                readOnly
                className="min-h-[300px] w-full resize-y rounded-xl border border-slate-300 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none"
                spellCheck={false}
              />
            </div>
          )}
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            How to format CSS
          </h2>

          <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-600">
            <li>Paste your CSS into the input box.</li>
            <li>Click “Format CSS” to beautify the structure.</li>
            <li>Review the formatted CSS output.</li>
            <li>Click “Copy” to copy the result.</li>
          </ol>

          <p className="mt-5 text-sm leading-6 text-slate-500">
            Your CSS is processed directly in your browser. It is not uploaded
            to a conversion server.
          </p>
        </section>

        <RelatedTools currentTool="css-formatter" />



        <AdsterraAd />
      </div>
    </main>
  );
}

