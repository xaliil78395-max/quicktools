"use client";

import Link from "next/link";
import { useState } from "react";
import AdsterraAd from "@/components/AdsterraAd";

const categories = {
  Length: {
    units: ["m", "km", "cm", "mm", "ft", "in", "mi"],
    toBase: {
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      ft: 0.3048,
      in: 0.0254,
      mi: 1609.344,
    },
  },
  Weight: {
    units: ["kg", "g", "lb", "oz"],
    toBase: {
      kg: 1,
      g: 0.001,
      lb: 0.45359237,
      oz: 0.028349523125,
    },
  },
  Temperature: {
    units: ["°C", "°F", "K"],
    toBase: {},
  },
} as const;

type Category = keyof typeof categories;

export default function UnitConverterPage() {
  const [category, setCategory] = useState<Category>("Length");
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const units = categories[category].units;

  const convertTemperature = (
    input: number,
    from: string,
    to: string
  ): number => {
    let celsius = input;

    if (from === "°F") celsius = (input - 32) * (5 / 9);
    if (from === "K") celsius = input - 273.15;

    if (to === "°C") return celsius;
    if (to === "°F") return celsius * (9 / 5) + 32;
    return celsius + 273.15;
  };

  const convert = () => {
    const input = Number(value);

    if (!Number.isFinite(input)) {
      setResult("Invalid number");
      return;
    }

    let converted: number;

    if (category === "Temperature") {
      converted = convertTemperature(input, fromUnit, toUnit);
    } else {
      const factors = categories[category].toBase;
      const baseValue =
        input * factors[fromUnit as keyof typeof factors];
      converted =
        baseValue / factors[toUnit as keyof typeof factors];
    }

    const rounded = Number(converted.toPrecision(12));
    setResult(String(rounded));
    setCopied(false);
  };

  const copyResult = async () => {
    if (!result || result === "Invalid number") return;

    await navigator.clipboard.writeText(result);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);

    const newUnits = categories[newCategory].units;
    setFromUnit(newUnits[0]);
    setToUnit(newUnits[1] ?? newUnits[0]);
    setValue("");
    setResult("");
    setCopied(false);
  };

  const clear = () => {
    setValue("");
    setResult("");
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
          <h1 className="text-3xl font-bold">Unit Converter</h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Convert length, weight, and temperature units quickly in your browser.
          </p>

          <div className="mt-8">
            <label className="mb-2 block font-semibold">Category</label>

            <select
              value={category}
              onChange={(e) =>
                handleCategoryChange(e.target.value as Category)
              }
              className="w-full rounded-xl border border-slate-300 bg-white p-4 outline-none dark:border-slate-700 dark:bg-slate-950"
            >
              {Object.keys(categories).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block font-semibold">Value</label>

              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter value"
                className="w-full rounded-xl border border-slate-300 bg-white p-4 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">From</label>

              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-4 outline-none dark:border-slate-700 dark:bg-slate-950"
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold">To</label>

              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-4 outline-none dark:border-slate-700 dark:bg-slate-950"
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={convert}
              className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900"
            >
              Convert
            </button>

            <button
              type="button"
              onClick={copyResult}
              disabled={!result || result === "Invalid number"}
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

          {result && (
            <div className="mt-6 rounded-xl bg-slate-100 p-5 dark:bg-slate-800">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Result
              </div>

              <div className="mt-1 break-all font-mono text-2xl font-bold">
                {result} {toUnit}
              </div>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-bold">How to use</h2>

            <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-600 dark:text-slate-400">
              <li>Select a conversion category.</li>
              <li>Enter the value and choose the source unit.</li>
              <li>Choose the target unit and click Convert.</li>
              <li>Use Copy to copy the result.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <AdsterraAd />
        </div>
      </div>
    </main>
  );
}
