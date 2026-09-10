"use client";


import AdsterraAd from "@/components/AdsterraAd";
import Link from "next/link";
import { useState } from "react";

type Mode =
  | "percentOf"
  | "whatPercent"
  | "change"
  | "increase"
  | "decrease"
  | "discount"
  | "tip";

const modes: { id: Mode; label: string }[] = [
  { id: "percentOf", label: "Percentage of a Number" },
  { id: "whatPercent", label: "What Percentage?" },
  { id: "change", label: "Percentage Change" },
  { id: "increase", label: "Percentage Increase" },
  { id: "decrease", label: "Percentage Decrease" },
  { id: "discount", label: "Discount Calculator" },
  { id: "tip", label: "Tip Calculator" },
];

export default function PercentageCalculatorPage() {
  const [mode, setMode] = useState<Mode>("percentOf");
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");
  const [result, setResult] = useState("");

  function calculate() {
    const a = Number(first);
    const b = Number(second);
    const c = Number(third);

    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      setResult("Please enter valid numbers.");
      return;
    }

    let value: number;
    let label: string;

    switch (mode) {
      case "percentOf":
        value = (a / 100) * b;
        label = `${formatNumber(a)}% of ${formatNumber(b)} =`;
        break;

      case "whatPercent":
        if (b === 0) {
          setResult("The second number cannot be zero.");
          return;
        }
        value = (a / b) * 100;
        label = `${formatNumber(a)} is`;
        break;

      case "change":
        if (a === 0) {
          setResult("The original value cannot be zero.");
          return;
        }
        value = ((b - a) / Math.abs(a)) * 100;
        label = "Percentage change =";
        break;

      case "increase":
        value = a + (a * b) / 100;
        label = `${formatNumber(a)} increased by ${formatNumber(b)}% =`;
        break;

      case "decrease":
        value = a - (a * b) / 100;
        label = `${formatNumber(a)} decreased by ${formatNumber(b)}% =`;
        break;

      case "discount":
        if (b < 0 || b > 100) {
          setResult("Discount percentage must be between 0 and 100.");
          return;
        }
        value = a - (a * b) / 100;
        label = `Final price after ${formatNumber(b)}% discount =`;
        break;

      case "tip":
        if (b < 0) {
          setResult("Tip percentage cannot be negative.");
          return;
        }
        value = (a * b) / 100;
        label = `Tip amount at ${formatNumber(b)}% =`;
        break;

      default:
        return;
    }

    if (!Number.isFinite(value)) {
      setResult("Unable to calculate the result.");
      return;
    }

    if (mode === "whatPercent") {
      setResult(`${label} ${formatNumber(value)}%`);
    } else if (mode === "change") {
      const direction =
        value > 0 ? "increase" : value < 0 ? "decrease" : "no change";
      setResult(`${label} ${formatNumber(Math.abs(value))}% (${direction})`);
    } else if (mode === "tip") {
      const total = a + value;
      setResult(`${label} ${formatNumber(value)} • Total = ${formatNumber(total)}`);
    } else if (mode === "discount") {
      const savings = (a * b) / 100;
      setResult(
        `${label} ${formatNumber(value)} • You save ${formatNumber(savings)}`,
      );
    } else {
      setResult(`${label} ${formatNumber(value)}`);
    }
  }

  function clearAll() {
    setFirst("");
    setSecond("");
    setThird("");
    setResult("");
  }

  const fields = getFields(mode);

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
              Percentage Calculator
            </h1>
            <p className="mt-2 text-slate-600">
              Calculate percentages, percentage change, discounts, increases,
              decreases, and tips quickly and easily.
            </p>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {modes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setMode(item.id);
                  setResult("");
                }}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  mode === item.id
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <label key={field.key} className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    {field.label}
                  </span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={
                      field.key === "first"
                        ? first
                        : field.key === "second"
                          ? second
                          : third
                    }
                    onChange={(event) => {
                      if (field.key === "first") setFirst(event.target.value);
                      if (field.key === "second") setSecond(event.target.value);
                      if (field.key === "third") setThird(event.target.value);
                    }}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>
              ))}
            </div>
          </div>

          {result && (
            <div className="mt-5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-4 text-lg font-semibold text-indigo-700">
              {result}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={calculate}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Calculate
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
          <h2 className="text-xl font-bold">
            Calculate Percentages Online
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            Use this free percentage calculator to find a percentage of a
            number, determine what percentage one number is of another,
            calculate percentage changes, and work out increases, decreases,
            discounts, and tips. Everything runs directly in your browser.
          </p>
        </section>
      </div>
    </main>
  );
}

function getFields(mode: Mode) {
  switch (mode) {
    case "percentOf":
      return [
        {
          key: "first",
          label: "Percentage",
          placeholder: "e.g. 20",
        },
        {
          key: "second",
          label: "Number",
          placeholder: "e.g. 150",
        },
      ];

    case "whatPercent":
      return [
        {
          key: "first",
          label: "Part",
          placeholder: "e.g. 30",
        },
        {
          key: "second",
          label: "Whole",
          placeholder: "e.g. 150",
        },
      ];

    case "change":
      return [
        {
          key: "first",
          label: "Original Value",
          placeholder: "e.g. 100",
        },
        {
          key: "second",
          label: "New Value",
          placeholder: "e.g. 125",
        },
      ];

    case "increase":
      return [
        {
          key: "first",
          label: "Original Number",
          placeholder: "e.g. 100",
        },
        {
          key: "second",
          label: "Increase %",
          placeholder: "e.g. 20",
        },
      ];

    case "decrease":
      return [
        {
          key: "first",
          label: "Original Number",
          placeholder: "e.g. 100",
        },
        {
          key: "second",
          label: "Decrease %",
          placeholder: "e.g. 20",
        },
      ];

    case "discount":
      return [
        {
          key: "first",
          label: "Original Price",
          placeholder: "e.g. 200",
        },
        {
          key: "second",
          label: "Discount %",
          placeholder: "e.g. 15",
        },
      ];

    case "tip":
      return [
        {
          key: "first",
          label: "Bill Amount",
          placeholder: "e.g. 50",
        },
        {
          key: "second",
          label: "Tip %",
          placeholder: "e.g. 15",
        },
      ];
  }
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 10,
  }).format(value);
}



