"use client";

import Link from "next/link";
import { useState } from "react";
import RelatedTools from "@/components/RelatedTools";
import AdsterraAd from "@/components/AdsterraAd";

function formatYamlValue(value: unknown): string {
  if (typeof value === "string") {
    if (
      value === "" ||
      /[:#{}\[\],&*!|>'"%@`]/.test(value) ||
      /^(true|false|null|yes|no|on|off)$/i.test(value) ||
      /^-?\d+(?:\.\d+)?$/.test(value) ||
      value.trim() !== value ||
      value.includes("\n")
    ) {
      return JSON.stringify(value);
    }

    return value;
  }

  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);

  return JSON.stringify(value);
}

function objectToYaml(value: unknown, indent = 0): string {
  const spaces = " ".repeat(indent);

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return `${spaces}[]`;
    }

    return value
      .map((item) => {
        if (
          item !== null &&
          typeof item === "object" &&
          !Array.isArray(item)
        ) {
          const entries = Object.entries(item as Record<string, unknown>);

          if (entries.length === 0) {
            return `${spaces}- {}`;
          }

          const [firstKey, firstValue] = entries[0];
          let result = `${spaces}- ${firstKey}:`;

          if (
            firstValue !== null &&
            typeof firstValue === "object"
          ) {
            result += `\n${objectToYaml(firstValue, indent + 4)}`;
          } else {
            result += ` ${formatYamlValue(firstValue)}`;
          }

          for (const [key, childValue] of entries.slice(1)) {
            if (
              childValue !== null &&
              typeof childValue === "object"
            ) {
              result += `\n${" ".repeat(indent + 2)}${key}:\n${objectToYaml(
                childValue,
                indent + 4
              )}`;
            } else {
              result += `\n${" ".repeat(indent + 2)}${key}: ${formatYamlValue(
                childValue
              )}`;
            }
          }

          return result;
        }

        if (item !== null && typeof item === "object") {
          return `${spaces}-\n${objectToYaml(item, indent + 2)}`;
        }

        return `${spaces}- ${formatYamlValue(item)}`;
      })
      .join("\n");
  }

  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);

    if (entries.length === 0) {
      return `${spaces}{}`;
    }

    return entries
      .map(([key, childValue]) => {
        if (
          childValue !== null &&
          typeof childValue === "object"
        ) {
          return `${spaces}${key}:\n${objectToYaml(
            childValue,
            indent + 2
          )}`;
        }

        return `${spaces}${key}: ${formatYamlValue(childValue)}`;
      })
      .join("\n");
  }

  return `${spaces}${formatYamlValue(value)}`;
}

function convertJsonToYaml(input: string): string {
  const parsed = JSON.parse(input);
  return objectToYaml(parsed);
}

export default function JsonToYamlPage() {
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
      setOutput(convertJsonToYaml(input));
    } catch {
      setOutput("");
      setError("Invalid JSON. Please check your input.");
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  const downloadYaml = () => {
    if (!output) return;

    const blob = new Blob([output], {
      type: "text/yaml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "quickhub-output.yaml";
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

        <h1 className="mb-2 text-3xl font-bold">JSON to YAML Converter</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Convert JSON data to YAML directly in your browser.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <section>
            <label className="mb-2 block font-semibold">JSON Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"name":"QuickHub","tools":100,"active":true}'
              className="h-80 w-full rounded-xl border border-gray-300 bg-gray-50 p-4 font-mono text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
            />
          </section>

          <section>
            <label className="mb-2 block font-semibold">YAML Output</label>
            <textarea
              value={output}
              readOnly
              placeholder="YAML output will appear here..."
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
            onClick={downloadYaml}
            disabled={!output}
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Download YAML
          </button>

          <button
            onClick={clearAll}
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Clear
          </button>
        </div>

        <div className="mt-10">
          <RelatedTools currentTool="json-to-yaml" />


          <AdsterraAd />
        </div>
      </div>
    </main>
  );
}

