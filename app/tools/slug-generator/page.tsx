"use client";


import AdsterraAd from "@/components/AdsterraAd";
import Link from "next/link";
import { useState } from "react";

function generateSlug(text: string) {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function SlugGeneratorPage() {
  const [text, setText] = useState("");
  const [slug, setSlug] = useState("");

  function handleGenerate() {
    setSlug(generateSlug(text));
  }

  function clearAll() {
    setText("");
    setSlug("");
  }

  async function copySlug() {
    if (!slug) return;
    await navigator.clipboard.writeText(slug);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Back to QuickTools
        </Link>


        <AdsterraAd />
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              URL Slug Generator
            </h1>
            <p className="mt-2 text-slate-600">
              Create clean, SEO-friendly URL slugs from text instantly.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Text or Title
            </label>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="How to Learn Arabic in 2026!"
              rows={5}
              className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="mt-4 text-sm text-slate-500">
            {text.length} characters
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!text.trim()}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Generate Slug
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </button>

            {slug && (
              <button
                type="button"
                onClick={copySlug}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Copy Slug
              </button>
            )}
          </div>

          {slug && (
            <div className="mt-8">
              <label className="mb-2 block text-sm font-semibold">
                Generated Slug
              </label>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <code className="break-all text-sm text-slate-900">
                  {slug}
                </code>
              </div>
            </div>
          )}
        </section>


<section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold">
            What is a URL Slug?
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            A URL slug is the readable part of a web address that identifies a
            page. Clean slugs make URLs easier to read, share, and understand.
            This tool converts titles into lowercase, hyphen-separated slugs
            suitable for web pages and blog posts.
          </p>
        </section>
      </div>
    </main>
  );
}



