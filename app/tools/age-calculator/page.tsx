"use client";
import RelatedTools from "@/components/RelatedTools";

import Link from "next/link";
import { useState } from "react";
import AdsterraAd from "@/components/AdsterraAd";

function calculateAge(birthDate: Date, today: Date) {
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;

    const previousMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    );

    days += previousMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function AgeCalculatorPage() {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    formattedBirthDate: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const calculate = () => {
    setError("");
    setResult(null);
    setCopied(false);

    if (!birthDate) {
      setError("Please enter your date of birth.");
      return;
    }

    const [year, month, day] = birthDate.split("-").map(Number);
    const birth = new Date(year, month - 1, day);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (birth > today) {
      setError("Date of birth cannot be in the future.");
      return;
    }

    const age = calculateAge(birth, today);

    setResult({
      ...age,
      formattedBirthDate: formatDate(birth),
    });
  };

  const copyResult = async () => {
    if (!result) return;

    const text = `Age: ${result.years} years, ${result.months} months, ${result.days} days`;

    await navigator.clipboard.writeText(text);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  const clear = () => {
    setBirthDate("");
    setResult(null);
    setError("");
    setCopied(false);
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
          <h1 className="text-3xl font-bold">Age Calculator</h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Calculate your exact age in years, months, and days.
          </p>

          <div className="mt-8">
            <label className="mb-2 block font-semibold">
              Date of Birth
            </label>

            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-4 outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={calculate}
              className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900"
            >
              Calculate Age
            </button>

            <button
              type="button"
              onClick={copyResult}
              disabled={!result}
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              {copied ? "Copied!" : "Copy"}
            </button>

            <button
              type="button"
              onClick={clear}
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Clear
            </button>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-6 rounded-2xl bg-slate-100 p-6 dark:bg-slate-800">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Date of Birth
              </div>

              <div className="mt-1 font-semibold">
                {result.formattedBirthDate}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-white p-5 text-center dark:bg-slate-900">
                  <div className="text-3xl font-bold">{result.years}</div>
                  <div className="mt-1 text-slate-500 dark:text-slate-400">
                    Years
                  </div>
                </div>

                <div className="rounded-xl bg-white p-5 text-center dark:bg-slate-900">
                  <div className="text-3xl font-bold">{result.months}</div>
                  <div className="mt-1 text-slate-500 dark:text-slate-400">
                    Months
                  </div>
                </div>

                <div className="rounded-xl bg-white p-5 text-center dark:bg-slate-900">
                  <div className="text-3xl font-bold">{result.days}</div>
                  <div className="mt-1 text-slate-500 dark:text-slate-400">
                    Days
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-bold">How to use</h2>

            <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-600 dark:text-slate-400">
              <li>Select your date of birth.</li>
              <li>Click “Calculate Age”.</li>
              <li>Your age will be shown in years, months, and days.</li>
              <li>Use Copy to copy the result.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <AdsterraAd />
        </div>
      </div>
            <RelatedTools currentTool="age-calculator" />
      </main>
  );
}

