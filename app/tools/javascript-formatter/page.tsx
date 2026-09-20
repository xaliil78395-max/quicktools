"use client";

import Link from "next/link";
import { useState } from "react";
import AdsterraAd from "@/components/AdsterraAd";

function beautifyJavaScript(code: string) {
  let result = "";
  let indent = 0;
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;
  let escaped = false;

  const addIndent = () => {
    if (result.length > 0 && !result.endsWith("\n")) {
      result += "\n";
    }

    result += "  ".repeat(indent);
  };

  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const next = code[i + 1];

    if (inLineComment) {
      result += char;

      if (char === "\n") {
        inLineComment = false;
        addIndent();
      }

      continue;
    }

    if (inBlockComment) {
      result += char;

      if (char === "*" && next === "/") {
        result += "/";
        i++;
        inBlockComment = false;
      }

      continue;
    }

    if (!inSingleQuote && !inDoubleQuote && !inTemplate) {
      if (char === "/" && next === "/") {
        result = result.trimEnd() + " //";
        i++;
        inLineComment = true;
        continue;
      }

      if (char === "/" && next === "*") {
        result = result.trimEnd() + " /*";
        i++;
        inBlockComment = true;
        continue;
      }
    }

    if (escaped) {
      result += char;
      escaped = false;
      continue;
    }

    if (char === "\\") {
      result += char;
      escaped = true;
      continue;
    }

    if (char === "'" && !inDoubleQuote && !inTemplate) {
      inSingleQuote = !inSingleQuote;
      result += char;
      continue;
    }

    if (char === '"' && !inSingleQuote && !inTemplate) {
      inDoubleQuote = !inDoubleQuote;
      result += char;
      continue;
    }

    if (char === "`" && !inSingleQuote && !inDoubleQuote) {
      inTemplate = !inTemplate;
      result += char;
      continue;
    }

    if (inSingleQuote || inDoubleQuote || inTemplate) {
      result += char;
      continue;
    }

    if (char === "{") {
      result = result.trimEnd() + " {\n";
      indent++;
      result += "  ".repeat(indent);
      continue;
    }

    if (char === "}") {
      indent = Math.max(0, indent - 1);
      result = result.trimEnd() + "\n" + "  ".repeat(indent) + "}";
      if (next && next !== ";" && next !== "," && next !== ")" && next !== "]") {
        result += "\n" + "  ".repeat(indent);
      }
      continue;
    }

    if (char === ";") {
      result = result.trimEnd() + ";\n" + "  ".repeat(indent);
      continue;
    }

    if (char === "\n" || char === "\r" || char === "\t") {
      if (!result.endsWith("\n") && result.trimEnd() !== "") {
        result += " ";
      }
      continue;
    }

    if (char === " ") {
      if (!result.endsWith(" ") && !result.endsWith("\n")) {
        result += " ";
      }
      continue;
    }

    result += char;
  }

  return result
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line, index, lines) => {
      if (line.trim() !== "") return true;
      return index > 0 && lines[index - 1].trim() !== "";
    })
    .join("\n")
    .trim();
}

export default function JavaScriptFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function formatJavaScript() {
    setError("");
    setCopied(false);

    if (!input.trim()) {
      setOutput("");
      setError("Please paste JavaScript before formatting.");
      return;
    }

    try {
      new Function(input);
      setOutput(beautifyJavaScript(input));
    } catch {
      setOutput("");
      setError(
        "Invalid JavaScript syntax. Please check your code and try again.",
      );
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
            JavaScript Formatter
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Format and beautify JavaScript code online with readable
            indentation. Fast, private, and processed directly in your browser.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label
            htmlFor="javascript-input"
            className="mb-3 block text-sm font-semibold text-slate-800"
          >
            JavaScript Input
          </label>

          <textarea
            id="javascript-input"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError("");
            }}
            placeholder="Paste your JavaScript here..."
            className="min-h-[320px] w-full resize-y rounded-xl border border-slate-300 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
              onClick={formatJavaScript}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Format JavaScript
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
                htmlFor="javascript-output"
                className="mb-3 block text-sm font-semibold text-slate-800"
              >
                Formatted JavaScript
              </label>

              <textarea
                id="javascript-output"
                value={output}
                readOnly
                className="min-h-[320px] w-full resize-y rounded-xl border border-slate-300 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none"
                spellCheck={false}
              />
            </div>
          )}
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            How to format JavaScript
          </h2>

          <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-600">
            <li>Paste your JavaScript code into the input box.</li>
            <li>Click “Format JavaScript” to beautify the code.</li>
            <li>Review the formatted JavaScript output.</li>
            <li>Click “Copy” to copy the result.</li>
          </ol>

          <p className="mt-5 text-sm leading-6 text-slate-500">
            Your JavaScript is processed directly in your browser. It is not
            uploaded to a conversion server.
          </p>
        </section>

        <AdsterraAd />
      </div>
    </main>
  );
}
