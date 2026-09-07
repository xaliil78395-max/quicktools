import Link from "next/link";

const categories = [
  {
    name: "Image Tools",
    description: "Compress, resize and convert your images.",
    icon: "?",
    tools: [
      { name: "Image Compressor", description: "Reduce image file size", href: "/tools/image-compressor" },
      { name: "Image Resizer", description: "Resize images quickly", href: "/tools/image-resizer" },
      { name: "JPG to PNG", description: "Convert JPG images to PNG", href: "/tools/jpg-to-png" },
      { name: "PNG to JPG", description: "Convert PNG images to JPG", href: "/tools/png-to-jpg" },
      { name: "PNG to WebP", description: "Convert PNG images to WebP", href: "/tools/png-to-webp" },
      { name: "Image Cropper", description: "Crop images easily", href: "/tools/image-cropper" },
      { name: "Image to Base64", description: "Convert images to Base64", href: "/tools/image-to-base64" },
    ],
  },
  {
    name: "Text Tools",
    description: "Simple tools for working with text.",
    icon: "Aa",
    tools: [
      { name: "Word Counter", description: "Count words and characters", href: "/tools/word-counter" },
      { name: "Character Counter", description: "Count every character", href: "/tools/character-counter" },
      { name: "Sentence Counter", description: "Count sentences instantly", href: "/tools/sentence-counter" },
      { name: "Paragraph Counter", description: "Count paragraphs instantly", href: "/tools/paragraph-counter" },
      { name: "Remove Duplicate Lines", description: "Remove repeated lines", href: "/tools/remove-duplicate-lines" },
      { name: "Text Sorter", description: "Sort text lines alphabetically", href: "/tools/text-sorter" },
      { name: "URL Encoder / Decoder", description: "Encode and decode URLs", href: "/tools/url-encoder-decoder" },
      { name: "Case Converter", description: "Change text capitalization", href: "/tools/case-converter" },
    ],
  },
  {
    name: "Developer Tools",
    description: "Useful utilities for developers.",
    icon: "{ }",
    tools: [
      { name: "JSON Formatter", description: "Format and validate JSON", href: "/tools/json-formatter" },
      { name: "Base64 Encoder", description: "Encode and decode Base64", href: "/tools/base64" },
      { name: "HTML Formatter", description: "Format and beautify HTML", href: "/tools/html-formatter" },
    { name: "UUID Generator", description: "Generate unique UUIDs", href: "/tools/uuid-generator" },
    { name: "Markdown Formatter", description: "Convert Markdown to HTML", href: "/tools/markdown-formatter" },
    { name: "Color Converter", description: "Convert HEX, RGB and HSL colors", href: "/tools/color-converter" },
    { name: "CSS Formatter", description: "Format and beautify CSS code", href: "/tools/css-formatter" },
    { name: "SQL Formatter", description: "Format and beautify SQL queries", href: "/tools/sql-formatter" },
    { name: "URL Slug Generator", description: "Create SEO-friendly URL slugs", href: "/tools/slug-generator" },
    { name: "HTML Entity Encoder / Decoder", description: "Encode and decode HTML entities", href: "/tools/html-entity-encoder" },
    { name: "HTML Minifier", description: "Minify and compress HTML code", href: "/tools/html-minifier" },
    { name: "JSON Minifier", description: "Minify and compress JSON data", href: "/tools/json-minifier" },
    ],
  },
  {
    name: "Utilities",
    description: "Useful tools for everyday tasks.",
    icon: "?",
    tools: [
      { name: "Password Generator", description: "Create strong passwords", href: "/tools/password-generator" },
      { name: "QR Code Generator", description: "Create reliable QR codes", href: "/tools/qr-code-generator" },
    { name: "Random Number Generator", description: "Generate random numbers", href: "/tools/random-number-generator" },
    { name: "Unit Converter", description: "Convert common units instantly", href: "/tools/unit-converter" },
    { name: "Timestamp Converter", description: "Convert Unix timestamps and dates", href: "/tools/timestamp-converter" },
    { name: "AI Lesson Summarizer", description: "Summarize lessons with AI", href: "/tools/ai-lesson-summarizer" },
    { name: "Email Validator", description: "Validate email address format", href: "/tools/email-validator" },
    { name: "PDF to Word Converter", description: "Convert PDF files to editable Word documents", href: "/tools/pdf-to-word" },
      { name: "JPG to PDF Converter", description: "Convert JPG images to PDF files", href: "/tools/jpg-to-pdf" },
      { name: "PDF Merger", description: "Merge multiple PDF files into one", href: "/tools/pdf-merger" },
      { name: "PDF Splitter", description: "Extract pages from PDF files", href: "/tools/pdf-splitter" },
      { name: "PDF to JPG Converter", description: "Convert PDF pages to JPG images", href: "/tools/pdf-to-jpg" },
      { name: "Loan Calculator", description: "Calculate monthly loan payments and total interest", href: "/tools/loan-calculator" },
      { name: "Amortization Calculator", description: "View loan payments, interest, principal, and balance", href: "/tools/amortization-calculator" },
      { name: "GPA Calculator", description: "Calculate semester and cumulative GPA", href: "/tools/gpa-calculator" },      { name: "Scientific Calculator", description: "Advanced scientific calculator for math and science", href: "/tools/scientific-calculator" },      { name: "Fraction Calculator", description: "Calculate, simplify, and convert fractions", href: "/tools/fraction-calculator" },    ],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Quick<span className="text-indigo-600">Tools</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            <a href="#tools" className="transition hover:text-slate-950">
              Tools
            </a>
            <a href="#categories" className="transition hover:text-slate-950">
              Categories
            </a>
            <a href="#about" className="transition hover:text-slate-950">
              About
            </a>
          </nav>

          <Link
            href="#tools"
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Explore Tools
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
              Free online tools
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Simple tools for everyday tasks.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Fast, free and easy-to-use online tools for images, text,
              developers and everyday tasks.
            </p>

            <div className="mx-auto mt-9 flex max-w-2xl items-center rounded-2xl border border-slate-300 bg-white p-2 shadow-sm transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100">
              <span className="px-3 text-slate-400">?</span>
              <input
                type="search"
                placeholder="Search for a tool..."
                className="h-12 flex-1 bg-transparent px-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                aria-label="Search for a tool"
              />
              <button
                type="button"
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Search
              </button>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
              <span>? No registration</span>
              <span>? Free to use</span>
              <span>? Fast and simple</span>
            </div>
          </div>
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Our tools
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Everything you need, in one place.
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Choose a tool below and get your task done without unnecessary
            steps.
          </p>
        </div>

        <div id="categories" className="space-y-14">
          {categories.map((category) => (
            <section key={category.name}>
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600">
                      {category.icon}
                    </span>
                    <h3 className="text-xl font-bold">{category.name}</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.tools.map((tool) => (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600">
                          {tool.name}
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {tool.description}
                        </p>
                      </div>
                      <span className="text-lg text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500">
                        ?
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section id="about" className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center lg:px-8">
          <h2 className="text-2xl font-bold">Built to be simple.</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            QuickTools is being built as a collection of practical tools that
            work quickly, clearly and without unnecessary complexity.
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>Â© {new Date().getFullYear()} QuickTools. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-slate-900">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-slate-900">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}












































