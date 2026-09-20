"use client";

import Link from "next/link";
import { useState } from "react";
import AdsterraAd from "@/components/AdsterraAd";

function xmlElementToValue(element: Element): unknown {
  const children = Array.from(element.children);

  if (children.length === 0) {
    return element.textContent?.trim() ?? "";
  }

  const result: Record<string, unknown> = {};

  for (const child of children) {
    const key = child.tagName;
    const value = xmlElementToValue(child);

    if (Object.prototype.hasOwnProperty.call(result, key)) {
      if (Array.isArray(result[key])) {
        (result[key] as unknown[]).push(value);
      } else {
        result[key] = [result[key], value];
      }
    } else {
      result[key] = value;
    }
  }

  return result;
}

function convertXmlToJson(input: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, "application/xml");

  const parserError = doc.querySelector("parsererror");

  if (parserError || !doc.documentElement) {
    throw new Error("Invalid XML");
  }

  const root = doc.documentElement;
  const result = xmlElementToValue(root);

  return JSON.stringify(
    {
      [root.tagName]: result,
    },
    null,
    2
  );
}

export default function XmlToJsonPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    setError("");

    if (!input.trim()) {
      setOutput("");
      setError("Please enter XML data.");
      return;
    }

    try {
      setOutput(convertXmlToJson(input));
    } catch {
      setOutput("");
      setError("Invalid XML. Please check your input.");
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  const downloadJson = () => {
    if (!output) return;

    const blob = new Blob([output], {
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "quickhub-output.json";
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

        <h1 className="mb-2 text-3xl font-bold">XML to JSON Converter</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Convert XML data to JSON directly in your browser.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <section>
            <label className="mb-2 block font-semibold">XML Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="<root><name>QuickHub</name></root>"
              className="h-80 w-full rounded-xl border border-gray-300 bg-gray-50 p-4 font-mono text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
            />
          </section>

          <section>
            <label className="mb-2 block font-semibold">JSON Output</label>
            <textarea
              value={output}
              readOnly
              placeholder="JSON output will appear here..."
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
            onClick={downloadJson}
            disabled={!output}
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Download JSON
          </button>

          <button
            onClick={clearAll}
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Clear
          </button>
        </div>

        <div className="mt-10">
          <AdsterraAd />
        </div>
      </div>
    </main>
  );
}
