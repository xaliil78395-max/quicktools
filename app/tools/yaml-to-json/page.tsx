"use client";

import Link from "next/link";
import { useState } from "react";
import RelatedTools from "@/components/RelatedTools";
import AdsterraAd from "@/components/AdsterraAd";

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

function parseScalar(value: string): JsonValue {
  const v = value.trim();

  if (!v) return {};

  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    return v.slice(1, -1);
  }

  if (v === "true") return true;
  if (v === "false") return false;
  if (v === "null" || v === "~") return null;

  if (/^-?\d+(?:\.\d+)?$/.test(v)) {
    return Number(v);
  }

  if (v.startsWith("[") && v.endsWith("]")) {
    return v
      .slice(1, -1)
      .split(",")
      .map((item) => parseScalar(item.trim()));
  }

  if (v.startsWith("{") && v.endsWith("}")) {
    const object: JsonObject = {};
    const content = v.slice(1, -1).trim();

    if (!content) return object;

    for (const part of content.split(",")) {
      const index = part.indexOf(":");
      if (index === -1) continue;

      const key = part.slice(0, index).trim().replace(/^["']|["']$/g, "");
      const val = part.slice(index + 1).trim();
      object[key] = parseScalar(val);
    }

    return object;
  }

  return v;
}

function parseYaml(yaml: string): JsonValue {
  const lines = yaml
    .split(/\r?\n/)
    .map((line) => line.replace(/\t/g, "  "))
    .filter((line) => {
      const trimmed = line.trim();
      return trimmed !== "" && !trimmed.startsWith("#");
    });

  if (!lines.length) {
    throw new Error("Empty YAML");
  }

  const root: JsonObject = {};
  const stack: { indent: number; value: JsonObject | JsonValue[] }[] = [
    { indent: -1, value: root },
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const indent = line.match(/^ */)?.[0].length ?? 0;
    const trimmed = line.trim();

    while (
      stack.length > 1 &&
      indent <= stack[stack.length - 1].indent
    ) {
      stack.pop();
    }

    const parent = stack[stack.length - 1].value;

    if (trimmed.startsWith("- ")) {
      if (!Array.isArray(parent)) {
        throw new Error("Invalid YAML list structure.");
      }

      const content = trimmed.slice(2).trim();

      if (!content) {
        const next = lines[i + 1];
        if (next && (next.match(/^ */)?.[0].length ?? 0) > indent) {
          const nextTrimmed = next.trim();

          if (nextTrimmed.startsWith("- ")) {
            const arr: JsonValue[] = [];
            parent.push(arr);
            stack.push({ indent, value: arr });
          } else {
            const obj: JsonObject = {};
            parent.push(obj);
            stack.push({ indent, value: obj });
          }
        } else {
          parent.push(null);
        }

        continue;
      }

      const colonIndex = content.indexOf(":");

      if (colonIndex > 0 && !content.startsWith("[") && !content.startsWith("{")) {
        const key = content.slice(0, colonIndex).trim();
        const value = content.slice(colonIndex + 1).trim();
        const obj: JsonObject = {};

        if (value) {
          obj[key] = parseScalar(value);
        } else {
          const next = lines[i + 1];
          const nextIndent = next
            ? next.match(/^ */)?.[0].length ?? 0
            : -1;
          const nextTrimmed = next?.trim() ?? "";

          if (nextIndent > indent && nextTrimmed.startsWith("- ")) {
            const arr: JsonValue[] = [];
            obj[key] = arr;
            parent.push(obj);
            stack.push({ indent, value: obj });
            stack.push({ indent: nextIndent - 1, value: arr });
            continue;
          }

          const child: JsonObject = {};
          obj[key] = child;
          parent.push(obj);
          stack.push({ indent, value: obj });
          stack.push({ indent: nextIndent - 1, value: child });
          continue;
        }

        parent.push(obj);
        continue;
      }

      parent.push(parseScalar(content));
      continue;
    }

    const colonIndex = trimmed.indexOf(":");

    if (colonIndex === -1) {
      throw new Error(`Invalid YAML line: ${trimmed}`);
    }

    const key = trimmed
      .slice(0, colonIndex)
      .trim()
      .replace(/^["']|["']$/g, "");

    const value = trimmed.slice(colonIndex + 1).trim();

    if (Array.isArray(parent)) {
      throw new Error("Invalid YAML object structure.");
    }

    if (value) {
      parent[key] = parseScalar(value);
      continue;
    }

    const next = lines[i + 1];
    const nextIndent = next
      ? next.match(/^ */)?.[0].length ?? 0
      : -1;
    const nextTrimmed = next?.trim() ?? "";

    if (nextIndent > indent && nextTrimmed.startsWith("- ")) {
      const arr: JsonValue[] = [];
      parent[key] = arr;
      stack.push({ indent, value: arr });
    } else {
      const child: JsonObject = {};
      parent[key] = child;
      stack.push({ indent, value: child });
    }
  }

  return root;
}

export default function YamlToJsonPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    setError("");

    if (!input.trim()) {
      setOutput("");
      setError("Please enter YAML data.");
      return;
    }

    try {
      const result = parseYaml(input);
      setOutput(JSON.stringify(result, null, 2));
    } catch {
      setOutput("");
      setError("Invalid or unsupported YAML. Please check your input.");
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

        <h1 className="mb-2 text-3xl font-bold">YAML to JSON Converter</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Convert YAML data to JSON directly in your browser.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <section>
            <label className="mb-2 block font-semibold">YAML Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={'name: QuickHub\ntools: 100\nactive: true'}
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
          <RelatedTools currentTool="yaml-to-json" />


          <AdsterraAd />
        </div>
      </div>
    </main>
  );
}

