"use client";

import Link from "next/link";
import { useState } from "react";
import RelatedTools from "@/components/RelatedTools";
import AdsterraAd from "@/components/AdsterraAd";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function keyToTag(key: string): string {
  let tag = key.trim().replace(/[^A-Za-z0-9_.-]/g, "_");
  if (!tag) tag = "item";
  if (!/^[A-Za-z_]/.test(tag)) tag = `item_${tag}`;
  return tag;
}

function objectToXml(value: unknown, tagName: string): string {
  const tag = keyToTag(tagName);

  if (value === null) {
    return `<${tag} />`;
  }

  if (Array.isArray(value)) {
    return value.map((item) => objectToXml(item, "item")).join("\n");
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);

    if (entries.length === 0) {
      return `<${tag} />`;
    }

    const children = entries
      .map(([key, child]) => objectToXml(child, key))
      .join("\n");

    return `<${tag}>\n${indentXml(children)}\n</${tag}>`;
  }

  return `<${tag}>${escapeXml(String(value))}</${tag}>`;
}

function indentXml(xml: string): string {
  return xml
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");
}

function convertJsonToXml(input: string): string {
  const parsed = JSON.parse(input);

  if (Array.isArray(parsed)) {
    const items = parsed
      .map((item) => objectToXml(item, "item"))
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${indentXml(items)}\n</root>`;
  }

  if (typeof parsed === "object" && parsed !== null) {
    const entries = Object.entries(parsed);

    const children = entries
      .map(([key, value]) => objectToXml(value, key))
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${indentXml(children)}\n</root>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<root>${escapeXml(String(parsed))}</root>`;
}

export default function JsonToXmlPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    setError("");

    if (!input.trim()) {
      setOutput("");
      setError("Please enter JSON data.");
      return;
    }

    try {
      setOutput(convertJsonToXml(input));
    } catch {
      setOutput("");
      setError("Invalid JSON. Please check your input.");
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  const downloadXml = () => {
    if (!output) return;

    const blob = new Blob([output], { type: "application/xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "quickhub-output.xml";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-gray-900 dark:bg-gray-950 dark:text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            ← Back
          </Link>

          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Home
          </Link>
        </div>

        <h1 className="mb-2 text-3xl font-bold">JSON to XML Converter</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Convert JSON data to XML directly in your browser.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <section>
            <label className="mb-2 block font-semibold">JSON Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='[{"name":"QuickHub","tools":100}]'
              className="h-80 w-full rounded-xl border border-gray-300 bg-gray-50 p-4 font-mono text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
            />
          </section>

          <section>
            <label className="mb-2 block font-semibold">XML Output</label>
            <textarea
              value={output}
              readOnly
              placeholder="XML output will appear here..."
              className="h-80 w-full rounded-xl border border-gray-300 bg-gray-50 p-4 font-mono text-sm outline-none dark:border-gray-700 dark:bg-gray-900"
            />
          </section>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={convert}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Convert
          </button>

          <button
            onClick={copyOutput}
            disabled={!output}
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Copy
          </button>

          <button
            onClick={downloadXml}
            disabled={!output}
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Download XML
          </button>

          <button
            onClick={clearAll}
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Clear
          </button>
        </div>

        <div className="mt-10">
          <RelatedTools currentTool="json-to-xml" />


          <AdsterraAd />
        </div>
      </div>
    </main>
  );
}

