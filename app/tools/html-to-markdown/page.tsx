"use client";
import RelatedTools from "@/components/RelatedTools";

import { useState } from "react";

function escapeMarkdown(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/([*_`[\]])/g, "\\$1")
    .replace(/\r?\n/g, " ");
}

function convertNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? "";
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const element = node as HTMLElement;
  const tag = element.tagName.toLowerCase();
  const content = Array.from(element.childNodes)
    .map(convertNode)
    .join("");

  switch (tag) {
    case "h1":
      return `# ${content.trim()}\n\n`;
    case "h2":
      return `## ${content.trim()}\n\n`;
    case "h3":
      return `### ${content.trim()}\n\n`;
    case "h4":
      return `#### ${content.trim()}\n\n`;
    case "h5":
      return `##### ${content.trim()}\n\n`;
    case "h6":
      return `###### ${content.trim()}\n\n`;

    case "strong":
    case "b":
      return `**${content.trim()}**`;

    case "em":
    case "i":
      return `*${content.trim()}*`;

    case "del":
    case "s":
    case "strike":
      return `~~${content.trim()}~~`;

    case "code":
      return `\`${content.trim()}\``;

    case "pre": {
      const code = element.textContent ?? "";
      return `\`\`\`\n${code.trim()}\n\`\`\`\n\n`;
    }

    case "a": {
      const href = element.getAttribute("href") ?? "";
      const text = content.trim() || href;
      return href ? `[${text}](${href})` : text;
    }

    case "img": {
      const src = element.getAttribute("src") ?? "";
      const alt = element.getAttribute("alt") ?? "";
      return src ? `![${alt}](${src})` : "";
    }

    case "br":
      return "\n";

    case "p":
      return `${content.trim()}\n\n`;

    case "blockquote":
      return content
        .trim()
        .split(/\r?\n/)
        .map((line) => `> ${line}`)
        .join("\n") + "\n\n";

    case "hr":
      return "---\n\n";

    case "ul":
      return (
        Array.from(element.children)
          .filter((child) => child.tagName.toLowerCase() === "li")
          .map((child) => `- ${convertNode(child).trim()}`)
          .join("\n") + "\n\n"
      );

    case "ol":
      return (
        Array.from(element.children)
          .filter((child) => child.tagName.toLowerCase() === "li")
          .map((child, index) => `${index + 1}. ${convertNode(child).trim()}`)
          .join("\n") + "\n\n"
      );

    case "li":
      return content.replace(/\n+/g, " ").trim();

    case "table": {
      const rows = Array.from(element.querySelectorAll("tr"));

      if (rows.length === 0) return "";

      const data = rows.map((row) =>
        Array.from(row.children).map((cell) =>
          escapeMarkdown(cell.textContent?.trim() ?? "")
        )
      );

      const columnCount = Math.max(...data.map((row) => row.length));

      const normalized = data.map((row) =>
        Array.from({ length: columnCount }, (_, index) => row[index] ?? "")
      );

      const header = `| ${normalized[0].join(" | ")} |`;
      const separator = `| ${normalized[0].map(() => "---").join(" | ")} |`;

      const body = normalized
        .slice(1)
        .map((row) => `| ${row.join(" | ")} |`)
        .join("\n");

      return `${header}\n${separator}${body ? `\n${body}` : ""}\n\n`;
    }

    case "script":
    case "style":
    case "noscript":
      return "";

    case "div":
    case "section":
    case "article":
    case "main":
    case "header":
    case "footer":
    case "nav":
      return `${content.trim()}\n\n`;

    default:
      return content;
  }
}

function htmlToMarkdown(html: string) {
  if (!html.trim()) {
    throw new Error("Please enter HTML code.");
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(html, "text/html");

  const markdown = Array.from(document.body.childNodes)
    .map(convertNode)
    .join("")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!markdown) {
    throw new Error("No convertible HTML content was found.");
  }

  return markdown;
}

export default function HtmlToMarkdownPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setOutput(htmlToMarkdown(input));
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

  const downloadMarkdown = () => {
    if (!output) return;

    const blob = new Blob([output], {
      type: "text/markdown;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.md";
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
          HTML to Markdown Converter
        </h1>

        <p className="mb-8 text-center text-muted-foreground">
          Convert HTML code into clean Markdown format.
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
              Markdown Output
            </label>

            <textarea
              value={output}
              readOnly
              placeholder="Markdown output will appear here..."
              className="min-h-[320px] w-full rounded-lg border bg-muted/30 p-4 font-mono text-sm outline-none"
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
            onClick={downloadMarkdown}
            className="rounded-md border px-5 py-2.5 font-medium hover:bg-muted"
          >
            Download Markdown
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
    <RelatedTools currentTool="html-to-markdown" />
</main>
  );
}


