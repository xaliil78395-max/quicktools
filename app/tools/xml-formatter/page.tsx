"use client";
import RelatedTools from "@/components/RelatedTools";

import Link from "next/link";
import { useState } from "react";
import AdsterraAd from "@/components/AdsterraAd";

function beautifyXml(xml: string) {
  const formatted = xml
    .replace(/(>)(<)(\/*)/g, "$1\n$2$3")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  let depth = 0;

  return formatted
    .map((line) => {
      if (line.startsWith("</")) {
        depth = Math.max(0, depth - 1);
      }

      const result = "  ".repeat(depth) + line;

      if (
        line.startsWith("<") &&
        !line.startsWith("</") &&
        !line.startsWith("<?") &&
        !line.startsWith("<!")
      ) {
        const openingTag = line.match(/^<([A-Za-z_][\w:.-]*)(?:\s[^>]*)?>$/);

        if (openingTag && !line.endsWith("/>")) {
          depth += 1;
        }
      }

      return result;
    })
    .join("\n");
}

export default function XmlFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function formatXmlContent() {
    setError("");
    setCopied(false);

    if (!input.trim()) {
      setOutput("");
      setError("Please paste XML before formatting.");
      return;
    }

    try {
      const parser = new DOMParser();
      const document = parser.parseFromString(input, "application/xml");

      if (document.querySelector("parsererror")) {
        setOutput("");
        setError("Invalid XML. Please check your XML syntax and try again.");
        return;
      }

      const serializer = new XMLSerializer();
      const serialized = serializer.serializeToString(document);

      setOutput(beautifyXml(serialized));
    } catch {
      setOutput("");
      setError("Unable to format this XML. Please check the XML syntax.");
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
            XML Formatter
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Format and beautify XML online with clean indentation and readable
            structure. Fast, private, and processed directly in your browser.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label
            htmlFor="xml-input"
            className="mb-3 block text-sm font-semibold text-slate-800"
          >
            XML Input
          </label>

          <textarea
            id="xml-input"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError("");
            }}
            placeholder="Paste your XML here..."
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
              onClick={formatXmlContent}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Format XML
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
                htmlFor="xml-output"
                className="mb-3 block text-sm font-semibold text-slate-800"
              >
                Formatted XML
              </label>

              <textarea
                id="xml-output"
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
            How to format XML
          </h2>

          <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-600">
            <li>Paste your XML into the input box.</li>
            <li>Click “Format XML” to validate and beautify it.</li>
            <li>Review the formatted XML output.</li>
            <li>Click “Copy” to copy the result.</li>
          </ol>

          <p className="mt-5 text-sm leading-6 text-slate-500">
            Your XML is processed directly in your browser. It is not uploaded
            to a conversion server.
          </p>
        </section>

        <AdsterraAd />
      </div>
            <RelatedTools currentTool="xml-formatter" />
      </main>
  );
}

