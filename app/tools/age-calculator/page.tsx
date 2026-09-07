"use client";

import Link from "next/link";
import { useState } from "react";

type AgeResult = {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  nextBirthdayDays: number;
};

export default function AgeCalculatorPage() {
  const [birthDate, setBirthDate] = useState("");
  const [asOfDate, setAsOfDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState("");

  function calculateAge() {
    setError("");
    setResult(null);

    if (!birthDate || !asOfDate) {
      setError("Please enter both dates.");
      return;
    }

    const birth = parseDate(birthDate);
    const current = parseDate(asOfDate);

    if (!birth || !current) {
      setError("Please enter valid dates.");
      return;
    }

    if (birth > current) {
      setError("Birth date cannot be after the selected date.");
      return;
    }

    let years = current.getFullYear() - birth.getFullYear();
    let months = current.getMonth() - birth.getMonth();
    let days = current.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const previousMonth = new Date(
        current.getFullYear(),
        current.getMonth(),
        0,
      );
      days += previousMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.floor(
      (current.getTime() - birth.getTime()) / 86400000,
    );

    const nextBirthday = getNextBirthday(birth, current);
    const nextBirthdayDays = Math.ceil(
      (nextBirthday.getTime() - current.getTime()) / 86400000,
    );

    setResult({
      years,
      months,
      days,
      totalDays,
      nextBirthdayDays,
    });
  }

  function clearAll() {
    setBirthDate("");
    setAsOfDate(new Date().toISOString().split("T")[0]);
    setResult(null);
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
              Age Calculator
            </h1>
            <p className="mt-2 text-slate-600">
              Calculate your exact age in years, months, and days, and find out
              how many days remain until your next birthday.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Date of Birth
                </span>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(event) => setBirthDate(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Calculate Age On
                </span>
                <input
                  type="date"
                  value={asOfDate}
                  onChange={(event) => setAsOfDate(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-4 font-medium text-red-700">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-5 rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
              <div className="text-sm font-semibold text-indigo-700">
                Your Exact Age
              </div>

              <div className="mt-2 text-3xl font-bold text-indigo-700">
                {result.years} years, {result.months} months, {result.days}{" "}
                days
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-4">
                  <div className="text-sm font-semibold text-slate-600">
                    Total days lived
                  </div>
                  <div className="mt-1 text-xl font-bold text-slate-900">
                    {formatNumber(result.totalDays)}
                  </div>
                </div>

                <div className="rounded-xl bg-white p-4">
                  <div className="text-sm font-semibold text-slate-600">
                    Days until next birthday
                  </div>
                  <div className="mt-1 text-xl font-bold text-slate-900">
                    {result.nextBirthdayDays}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={calculateAge}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Calculate Age
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </button>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold">Calculate Your Age Online</h2>

          <p className="mt-3 leading-7 text-slate-600">
            This free age calculator calculates your exact age between two
            dates. Enter your date of birth and choose the date on which you
            want to calculate your age. You can use it to find your age in
            years, months, and days or calculate the number of days until your
            next birthday.
          </p>
        </section>
      </div>
    </main>
  );
}

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function getNextBirthday(birth: Date, current: Date) {
  let year = current.getFullYear();
  let birthday = new Date(year, birth.getMonth(), birth.getDate());

  if (birthday < current) {
    year += 1;
    birthday = new Date(year, birth.getMonth(), birth.getDate());
  }

  return birthday;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}
