"use client";

import Link from "next/link";
import { useState } from "react";

type Mode = "timestamp" | "date";

function formatDate(date: Date) {
  return {
    local: date.toLocaleString(),
    utc: date.toUTCString(),
    iso: date.toISOString(),
  };
}

export default function TimestampConverterPage() {
  const [mode, setMode] = useState<Mode>("timestamp");
  const [timestamp, setTimestamp] = useState("");
  const [unit, setUnit] = useState<"seconds" | "milliseconds">("seconds");
  const [dateValue, setDateValue] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  function convert() {
    setError("");
    setResult("");

    if (mode === "timestamp") {
      const value = Number(timestamp);

      if (!timestamp.trim() || !Number.isFinite(value)) {
        setError("Please enter a valid timestamp.");
        return;
      }

      const milliseconds =
        unit === "seconds" ? value * 1000 : value;

      const date = new Date(milliseconds);

      if (Number.isNaN(date.getTime())) {
        setError("Invalid timestamp.");
        return;
      }

      const formatted = formatDate(date);

      setResult(
        `Local: ${formatted.local}\nUTC: ${formatted.utc}\nISO 8601: ${formatted.iso}`,
      );
    } else {
      if (!dateValue) {
        setError("Please select a date and time.");
        return;
      }

      const date = new Date(dateValue);

      if (Number.isNaN(date.getTime())) {
        setError("Invalid date.");
        return;
      }

      const milliseconds = date.getTime();
      const seconds = Math.floor(milliseconds / 1000);

      setResult(
        `Seconds: ${seconds}\nMilliseconds: ${milliseconds}`,
      );
    }
  }

  async function copyResult() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
  }

  function clearAll() {
    setTimestamp("");
    setDateValue("");
    setResult("");
    setError("");
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

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Timestamp Converter
            </h1>
            <p className="mt-2 text-slate-600">
              Convert Unix timestamps to dates and dates to Unix timestamps.
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("timestamp");
                setResult("");
                setError("");
              }}
              className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                mode === "timestamp"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Timestamp → Date
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("date");
                setResult("");
                setError("");
              }}
              className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                mode === "date"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Date → Timestamp
            </button>
          </div>

          {mode === "timestamp" ? (
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Unix Timestamp
                </label>
                <input
                  type="number"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  placeholder="e.g. 1756780800"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Timestamp Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) =>
                    setUnit(
                      e.target.value as "seconds" | "milliseconds",
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="seconds">Seconds</option>
                  <option value="milliseconds">Milliseconds</option>
                </select>
              </div>
            </div>
          ) : (
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Date and Time
              </label>
              <input
                type="datetime-local"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={convert}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Convert
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </button>

            {result && (
              <button
                type="button"
                onClick={copyResult}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Copy Result
              </button>
            )}
          </div>

          {result && (
            <div className="mt-8">
              <label className="mb-2 block text-sm font-semibold">
                Result
              </label>
              <textarea
                value={result}
                readOnly
                rows={4}
                className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-mono text-sm outline-none"
              />
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold">About Unix Timestamps</h2>
          <p className="mt-3 leading-7 text-slate-600">
            A Unix timestamp represents the number of seconds or milliseconds
            since January 1, 1970, UTC. It is commonly used by applications,
            APIs, databases, and developers to store and exchange dates.
          </p>
        </section>
      </div>
    </main>
  );
}
