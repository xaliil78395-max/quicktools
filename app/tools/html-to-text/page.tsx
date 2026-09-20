"use client";

import { useState } from "react";

function htmlToText(html: string) {
  if (!html.trim()) {
    throw new Error("Please enter HTML code.");
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(html, "text/html");

  document
    .querySelectorAll("script, style, noscript, template")
    .forEach((element) => element.remove());

  const blockTags =
    "address,article,aside,blockquote,div,dl,dt,dd,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hr,li,main,nav,ol,p,pre,section,table,tr,td,th,ul";

  document.querySelectorAll(blockTags).forEach((element) => {
    element.insertAdjacentText("beforebegin", "\n");
    element.insertAdjacentText("afterend", "\n");
  });

  document.querySelectorAll("br").forEach((element) => {
    element.replaceWith("\n");
  });

  const text = document.body.textContent ?? "";

  const cleaned = text
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!cleaned) {
    throw new Error("No readable text was found in the HTML.");
  }

  return cleaned;
}

export default function HtmlToTextPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setOutput(htmlToText(input));
      setError("");
    } catch (err) {
      setOutput("");
      setError(
        err instanceof Error ? err.message : "Unable to convert HTML."
      );
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  const downloadText = () => {
    if (!output) return;

    const blob = new Blob([output], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <a
            href="/"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            ← Back
          </a>

          <a
            href="/"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Home
          </a>
        </div>

        <h1 className="mb-3 text-center text-3xl font-bold">
          HTML to Plain Text Converter
        </h1>

        <p className="mb-8 text-center text-muted-foreground">
          Remove HTML tags and convert HTML into clean plain text.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">HTML Input</label>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`<h1>QuickHub</h1>
<p>We have <strong>100</strong> useful tools.</p>
<ul>
  <li>JSON Tools</li>
  <li>CSV Tools</li>
</ul>`}
              className="min-h-[320px] w-full rounded-lg border bg-background p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Plain Text Output
            </label>

            <textarea
              value={output}
              readOnly
              placeholder="Plain text output will appear here..."
              className="min-h-[320px] w-full rounded-lg border bg-muted/30 p-4 text-sm outline-none"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm font-medium text-destructive">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={convert}
            className="rounded-md border border-primary bg-primary px-5 py-2.5 font-medium text-primary-foreground"
          >
            Convert
          </button>

          <button
            onClick={copyOutput}
            className="rounded-md border px-5 py-2.5 font-medium hover:bg-muted"
          >
            Copy
          </button>

          <button
            onClick={downloadText}
            className="rounded-md border px-5 py-2.5 font-medium hover:bg-muted"
          >
            Download TXT
          </button>

          <button
            onClick={clearAll}
            className="rounded-md border px-5 py-2.5 font-medium hover:bg-muted"
          >
            Clear
          </button>
        </div>

        <div className="mt-10 rounded-lg border p-4 text-center text-sm text-muted-foreground">
          Advertisement
        </div>
      </div>
    </main>
  );
}
