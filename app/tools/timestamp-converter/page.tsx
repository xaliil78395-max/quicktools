"use client";
import RelatedTools from "@/components/RelatedTools";

import Link from "next/link";
import { useState } from "react";
import AdsterraAd from "@/components/AdsterraAd";

function formatDate(date: Date) {
  if (Number.isNaN(date.getTime())) return "";

  const pad = (value: number) => String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;
}

export default function TimestampConverterPage() {
  const [timestamp, setTimestamp] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [timestampResult, setTimestampResult] = useState("");
  const [dateResult, setDateResult] = useState("");
  const [copied, setCopied] = useState("");

  const timestampToDate = () => {
    const value = Number(timestamp);

    if (!Number.isFinite(value)) {
      setDateResult("Invalid timestamp");
      return;
    }

    const milliseconds =
      Math.abs(value) >= 100000000000 ? value : value * 1000;

    const date = new Date(milliseconds);

    if (Number.isNaN(date.getTime())) {
      setDateResult("Invalid timestamp");
      return;
    }

    setDateResult(formatDate(date));
  };

  const dateToTimestamp = () => {
    const date = new Date(dateTime);

    if (Number.isNaN(date.getTime())) {
      setTimestampResult("Invalid date");
      return;
    }

    setTimestampResult(String(Math.floor(date.getTime() / 1000)));
  };

  const copyText = async (text: string, type: string) => {
    if (!text || text.startsWith("Invalid")) return;

    await navigator.clipboard.writeText(text);
    setCopied(type);

    setTimeout(() => setCopied(""), 1500);
  };

  const clearAll = () => {
    setTimestamp("");
    setDateTime("");
    setTimestampResult("");
    setDateResult("");
    setCopied("");
  };

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="rounded-xl border border-slate-300 px-4 py-2 font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            ← Back
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-slate-300 px-4 py-2 font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Home
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-3xl font-bold">Timestamp Converter</h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Convert Unix timestamps to dates and dates to Unix timestamps.
          </p>

          <div className="mt-8">
            <h2 className="text-xl font-bold">Unix Timestamp → Date</h2>

            <input
              type="text"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder="Example: 1758196800"
              className="mt-3 w-full rounded-xl border border-slate-300 bg-white p-4 outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950"
            />

            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={timestampToDate}
                className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900"
              >
                Convert to Date
              </button>

              <button
                type="button"
                onClick={() => copyText(dateResult, "date")}
                disabled={!dateResult || dateResult === "Invalid timestamp"}
                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                {copied === "date" ? "Copied!" : "Copy"}
              </button>
            </div>

            {dateResult && (
              <div className="mt-4 rounded-xl bg-slate-100 p-4 font-mono dark:bg-slate-800">
                {dateResult}
              </div>
            )}
          </div>

          <div className="my-10 border-t border-slate-200 dark:border-slate-800" />

          <div>
            <h2 className="text-xl font-bold">Date → Unix Timestamp</h2>

            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="mt-3 w-full rounded-xl border border-slate-300 bg-white p-4 outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950"
            />

            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={dateToTimestamp}
                className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900"
              >
                Convert to Timestamp
              </button>

              <button
                type="button"
                onClick={() => copyText(timestampResult, "timestamp")}
                disabled={
                  !timestampResult || timestampResult === "Invalid date"
                }
                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                {copied === "timestamp" ? "Copied!" : "Copy"}
              </button>
            </div>

            {timestampResult && (
              <div className="mt-4 rounded-xl bg-slate-100 p-4 font-mono dark:bg-slate-800">
                {timestampResult}
              </div>
            )}
          </div>

          <div className="mt-8">
            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Clear
            </button>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold">How to use</h2>

            <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-600 dark:text-slate-400">
              <li>Enter a Unix timestamp and convert it to a date.</li>
              <li>Choose a date and time to convert it to a Unix timestamp.</li>
              <li>Use Copy to copy the result.</li>
              <li>Use Clear to reset the converter.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <AdsterraAd />
        </div>
      </div>
            <RelatedTools currentTool="timestamp-converter" />
      </main>
  );
}

