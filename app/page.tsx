"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getTranslation,
  isLanguageCode,
  languageOptions,
  rtlLanguages,
  type LanguageCode,
} from "@/lib/i18n";

const categories = [
  {
    name: "Image Tools",
    description: "Compress, resize, crop and convert images in seconds.",
    icon: "◈",
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
    description: "Write, analyze, transform and clean up your text.",
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
    description: "Practical utilityTools for coding and development.",
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
    name: "utilityTools",
    description: "Everyday helpers, document tools and calculators.",
    icon: "✦",
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
      { name: "GPA Calculator", description: "Calculate semester and cumulative GPA", href: "/tools/gpa-calculator" },
      { name: "Scientific Calculator", description: "Advanced scientific calculator for math and science", href: "/tools/scientific-calculator" },
            { name: "Fraction Calculator", description: "Calculate, simplify, and convert fractions", href: "/tools/fraction-calculator" },
      { name: "Pomodoro Timer", description: "Focus with customizable work and break cycles", href: "/tools/pomodoro-timer" },
    ],
  },
];

const allTools = categories.flatMap((category) =>
  category.tools.map((tool) => ({
    ...tool,
    category: category.name,
  }))
);

const popularTools = [
  allTools.find((tool) => tool.name === "Image Compressor")!,
  allTools.find((tool) => tool.name === "Word Counter")!,
  allTools.find((tool) => tool.name === "QR Code Generator")!,
  allTools.find((tool) => tool.name === "Password Generator")!,
  allTools.find((tool) => tool.name === "JSON Formatter")!,
  allTools.find((tool) => tool.name === "PDF to Word Converter")!,
];

const categoryKeys: Record<string, "imageTools" | "textTools" | "developerTools" | "utilityTools"> = {
  "Image Tools": "imageTools",
  "Text Tools": "textTools",
  "Developer Tools": "developerTools",
  "utilityTools": "utilityTools",
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>("en");

  const t = getTranslation(language);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("quickhub-language");

    if (savedLanguage && isLanguageCode(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("quickhub-language", language);

    const root = document.documentElement;
    root.lang = language;
    root.dir = rtlLanguages.includes(language) ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("quickhub-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;

    setDarkMode(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;

    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("quickhub-theme", next ? "dark" : "light");
  };

  const getToolName = (name: string) =>
    t.toolNames[name] ?? name;

  const getToolDescription = (name: string, fallback: string) =>
    t.toolDescriptions[name] ?? fallback;

  const getCategoryName = (name: string) => {
    const key = categoryKeys[name];
    return key ? t[key] : name;
  };

  const getCategoryDescription = (name: string, fallback: string) => {
    const key = `${categoryKeys[name]}Description` as keyof typeof t;
    const value = t[key];

    return typeof value === "string" ? value : fallback;
  };

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return [];

    return allTools
      .filter((tool) => {
        const name = getToolName(tool.name).toLowerCase();
        const description = getToolDescription(tool.name, tool.description).toLowerCase();
        const category = getCategoryName(tool.category).toLowerCase();

        return (
          name.includes(normalized) ||
          description.includes(normalized) ||
          category.includes(normalized)
        );
      })
      .slice(0, 8);
  }, [query, language, t]);

  const scrollToTools = () => {
    document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
    setMobileMenu(false);
  };

  const changeLanguage = (value: string) => {
    if (isLanguageCode(value)) {
      setLanguage(value);
    }
  };

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-white text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-white"
      dir={rtlLanguages.includes(language) ? "rtl" : "ltr"}
    >
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-black text-white shadow-lg shadow-indigo-500/20 transition group-hover:scale-105">
              Q
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              Quick<span className="text-indigo-600">Hub</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex dark:text-slate-300">
            <a href="#tools" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
              {t.navTools}
            </a>
            <a href="#categories" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
              {t.navCategories}
            </a>
            <a href="#about" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
              {t.navAbout}
            </a>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              aria-label={"Language"}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {languageOptions.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.flag} {item.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={darkMode ? t.lightMode : t.darkMode}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-500 dark:hover:bg-slate-800"
            >
              {darkMode ? "☀" : "☾"}
            </button>

            <button
              type="button"
              onClick={scrollToTools}
              className="ml-1 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500"
            >
              {t.exploreTools}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenu(!mobileMenu)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-xl md:hidden dark:border-slate-700"
            aria-label={mobileMenu ? "Close menu" : "Open menu"}
          >
            {mobileMenu ? "×" : "☰"}
          </button>
        </div>

        {mobileMenu && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden dark:border-slate-800 dark:bg-slate-950">
            <nav className="flex flex-col gap-1">
              <a
                onClick={() => setMobileMenu(false)}
                href="#tools"
                className="rounded-xl px-4 py-3 font-semibold hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                {t.navTools}
              </a>
              <a
                onClick={() => setMobileMenu(false)}
                href="#categories"
                className="rounded-xl px-4 py-3 font-semibold hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                {t.navCategories}
              </a>
              <a
                onClick={() => setMobileMenu(false)}
                href="#about"
                className="rounded-xl px-4 py-3 font-semibold hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                {t.navAbout}
              </a>

              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-200 pt-3 dark:border-slate-800">
                <select
                  value={language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  aria-label={"Language"}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  {languageOptions.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.flag} {item.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  {darkMode ? `☀ ${t.lightMode}` : `☾ ${t.darkMode}`}
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.16),transparent_45%)]" />
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-violet-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              {t.heroBadge}
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
              {t.heroTitle}
              <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent">
                {t.heroTitleAccent}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-300">
              {t.heroDescription}
            </p>

            <div className="relative mx-auto mt-9 max-w-2xl">
              <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/60 ring-1 ring-black/[0.02] transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20">
                <span className="pl-3 text-xl text-slate-400">⌕</span>

                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                  aria-label={t.searchButton}
                />

                <button
                  type="button"
                  onClick={scrollToTools}
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  {t.searchButton}
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 text-left shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                  {searchResults.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={() => setQuery("")}
                      className="flex items-center justify-between rounded-xl px-4 py-3 transition hover:bg-indigo-50 dark:hover:bg-slate-800"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">
                          {getToolName(tool.name)}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {getCategoryName(tool.category)}
                        </p>
                      </div>
                      <span className="ml-3 text-slate-400">→</span>
                    </Link>
                  ))}
                </div>
              )}

              {query.trim() && searchResults.length === 0 && (
                <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 rounded-2xl border border-slate-200 bg-white p-5 text-center text-sm text-slate-500 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                  {t.noToolsFound} “{query}”.
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>✓ {t.trustFree}</span>
              <span>✓ {t.trustFast}</span>
              <span>✓ {t.trustNoSignup}</span>
              <span>✓ {t.trustPrivate}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              {t.popularTitle}
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              {t.popularTitle}
            </h2>
          </div>

          <button
            type="button"
            onClick={scrollToTools}
            className="hidden text-sm font-bold text-indigo-600 hover:text-indigo-700 sm:block dark:text-indigo-400"
          >
            {t.viewAllTools} →
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 dark:hover:shadow-black/20"
            >
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-indigo-500/10 blur-2xl transition group-hover:bg-indigo-500/20" />

              <div className="relative flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {getToolName(tool.name)}
                  </p>
                  <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                    {getToolDescription(tool.name, tool.description)}
                  </p>
                </div>

                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition group-hover:bg-indigo-600 group-hover:text-white dark:bg-slate-800">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="tools"
        className="border-t border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              {t.exploreTitle}
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {t.exploreTitle}
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              {t.exploreDescription}
            </p>
          </div>

          <div id="categories" className="space-y-16">
            {categories.map((category) => (
              <section key={category.name}>
                <div className="mb-6 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-sm font-black text-white shadow-lg shadow-indigo-500/20">
                    {category.icon}
                  </div>

                  <div>
                    <h3 className="text-xl font-black">
                      {getCategoryName(category.name)}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {getCategoryDescription(category.name, category.description)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {category.tools.map((tool) => (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      className="group flex min-h-[126px] flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 dark:hover:shadow-black/20"
                    >
                      <div>
                        <h4 className="font-bold leading-5 transition group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {getToolName(tool.name)}
                        </h4>

                        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                          {getToolDescription(tool.name, tool.description)}
                        </p>
                      </div>

                      <span className="mt-4 text-sm font-bold text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500">
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section
        id="about"
        className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50"
      >
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            ✦
          </div>

          <h2 className="mt-5 text-2xl font-black sm:text-3xl">
            {t.aboutTitle}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600 dark:text-slate-400">
            {t.aboutDescription}
          </p>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Link href="/" className="text-xl font-black text-white">
                Quick<span className="text-indigo-400">Hub</span>
              </Link>

              <p className="mt-3 max-w-sm text-sm leading-6">
                {t.footerTagline}
              </p>
            </div>

            <div className="flex gap-6 text-sm font-medium">
              <Link href="/privacy" className="transition hover:text-white">
                {t.footerPrivacy}
              </Link>
              <Link href="/terms" className="transition hover:text-white">
                {t.footerTerms}
              </Link>
              <Link href="/about" className="transition hover:text-white">
                {t.navAbout}
              </Link>
              <Link href="/contact" className="transition hover:text-white">
                {t.footerContact}
              </Link>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-800 pt-6 text-xs">
            © {new Date().getFullYear()} QuickHub. {t.footerCopyright}
          </div>
        </div>
      </footer>
    </main>
  );
}


