"use client";

import Link from "next/link";
import { useState } from "react";

function generateRandomNumbers(
  min: number,
  max: number,
  count: number,
  allowDuplicates: boolean,
) {
  const results: number[] = [];

  if (!allowDuplicates && count > max - min + 1) {
    return [];
  }

  while (results.length < count) {
    const value = Math.floor(Math.random() * (max - min + 1)) + min;

    if (allowDuplicates || !results.includes(value)) {
      results.push(value);
    }
  }

  return results;
}

export default function RandomNumberGenerator() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [results, setResults] = useState<number[]>([]);
  const [error, setError] = useState("");

  const handleGenerate = () => {
    const minimum = Number(min);
    const maximum = Number(max);
    const quantity = Number(count);

    if (
      !Number.isInteger(minimum) ||
      !Number.isInteger(maximum) ||
      !Number.isInteger(quantity)
    ) {
      setError("Please enter whole numbers only.");
      return;
    }

    if (minimum > maximum) {
      setError("Minimum must be less than or equal to maximum.");
      return;
    }

    if (quantity < 1 || quantity > 1000) {
      setError("Number of results must be between 1 and 1000.");
      return;
    }

    if (!allowDuplicates && quantity > maximum - minimum + 1) {
      setError(
        "There are not enough unique numbers in this range for the requested quantity.",
      );
      return;
    }

    setError("");
    setResults(
      generateRandomNumbers(minimum, maximum, quantity, allowDuplicates),
    );
  };

  const handleCopy = async () => {
    if (results.length === 0) return;
    await navigator.clipboard.writeText(results.join("\n"));
  };

  const handleClear = () => {
    setResults([]);
    setError("");
  };

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Quick<span className="text-indigo-600">Tools</span>
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            Back to Tools
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
            Utilities
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Random Number Generator
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Generate random numbers instantly with custom ranges and quantity.
          </p>
        </div>

        <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label
                htmlFor="minimum"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Minimum
              </label>
              <input
                id="minimum"
                type="number"
                value={min}
                onChange={(event) => setMin(event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="maximum"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Maximum
              </label>
              <input
                id="maximum"
                type="number"
                value={max}
                onChange={(event) => setMax(event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="quantity"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Number of results
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                max="1000"
                value={count}
                onChange={(event) => setCount(event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </div>
          </div>

          <label className="mt-6 flex cursor-pointer items-center gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={allowDuplicates}
              onChange={(event) => setAllowDuplicates(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600"
            />
            Allow duplicate numbers
          </label>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleGenerate}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Generate Numbers
            </button>

            <button
              type="button"
              onClick={handleCopy}
              disabled={results.length === 0}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Copy Results
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </button>
          </div>

          <div className="mt-7">
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="results"
                className="text-sm font-semibold text-slate-700"
              >
                Results
              </label>
              <span className="text-xs text-slate-500">
                {results.length} {results.length === 1 ? "number" : "numbers"}
              </span>
            </div>

            <textarea
              id="results"
              readOnly
              value={results.join("\n")}
              placeholder="Generated numbers will appear here..."
              className="min-h-52 w-full resize-y rounded-2xl border border-slate-300 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none"
            />
          </div>
        </div>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-lg font-bold text-slate-900">
            About Random Number Generator
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Generate one or more random whole numbers between any minimum and
            maximum value. You can also disable duplicates when you need a set
            of unique random numbers.
          </p>
        </section>
      </section>
    </main>
  );
}



