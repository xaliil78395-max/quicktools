"use client";

import Link from "next/link";
import { useState } from "react";

type Category = "length" | "weight" | "temperature" | "volume";

const units = {
  length: [
    { value: "meter", label: "Meter" },
    { value: "kilometer", label: "Kilometer" },
    { value: "centimeter", label: "Centimeter" },
    { value: "millimeter", label: "Millimeter" },
    { value: "mile", label: "Mile" },
    { value: "yard", label: "Yard" },
    { value: "foot", label: "Foot" },
    { value: "inch", label: "Inch" },
  ],
  weight: [
    { value: "kilogram", label: "Kilogram" },
    { value: "gram", label: "Gram" },
    { value: "milligram", label: "Milligram" },
    { value: "pound", label: "Pound" },
    { value: "ounce", label: "Ounce" },
  ],
  temperature: [
    { value: "celsius", label: "Celsius" },
    { value: "fahrenheit", label: "Fahrenheit" },
    { value: "kelvin", label: "Kelvin" },
  ],
  volume: [
    { value: "liter", label: "Liter" },
    { value: "milliliter", label: "Milliliter" },
    { value: "gallon", label: "US Gallon" },
    { value: "quart", label: "US Quart" },
    { value: "pint", label: "US Pint" },
    { value: "cup", label: "US Cup" },
  ],
} as const;

function convertValue(
  value: number,
  from: string,
  to: string,
  category: Category,
) {
  if (from === to) return value;

  if (category === "temperature") {
    let celsius = value;

    if (from === "fahrenheit") {
      celsius = (value - 32) * (5 / 9);
    } else if (from === "kelvin") {
      celsius = value - 273.15;
    }

    if (to === "fahrenheit") {
      return celsius * (9 / 5) + 32;
    }

    if (to === "kelvin") {
      return celsius + 273.15;
    }

    return celsius;
  }

  const factors: Record<Category, Record<string, number>> = {
    length: {
      meter: 1,
      kilometer: 1000,
      centimeter: 0.01,
      millimeter: 0.001,
      mile: 1609.344,
      yard: 0.9144,
      foot: 0.3048,
      inch: 0.0254,
    },
    weight: {
      kilogram: 1,
      gram: 0.001,
      milligram: 0.000001,
      pound: 0.45359237,
      ounce: 0.028349523125,
    },
    temperature: {},
    volume: {
      liter: 1,
      milliliter: 0.001,
      gallon: 3.785411784,
      quart: 0.946352946,
      pint: 0.473176473,
      cup: 0.2365882365,
    },
  };

  return (value * factors[category][from]) / factors[category][to];
}

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>("length");
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("meter");
  const [toUnit, setToUnit] = useState("kilometer");

  const availableUnits = units[category];

  const numericValue = Number(value);
  const result =
    value !== "" && Number.isFinite(numericValue)
      ? convertValue(numericValue, fromUnit, toUnit, category)
      : null;

  const formattedResult =
    result === null
      ? ""
      : Number.isInteger(result)
        ? result.toString()
        : result.toFixed(8).replace(/\.?0+$/, "");

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    setFromUnit(units[newCategory][0].value);
    setToUnit(units[newCategory][1].value);
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
            Unit Converter
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Convert length, weight, temperature, and volume units instantly.
          </p>
        </div>

        <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap gap-2">
            {(["length", "weight", "temperature", "volume"] as Category[]).map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleCategoryChange(item)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold capitalize transition ${
                    category === item
                      ? "bg-indigo-600 text-white"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item}
                </button>
              ),
            )}
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
            <div>
              <label
                htmlFor="value"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Value
              </label>
              <input
                id="value"
                type="number"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div className="hidden pb-3 text-xl font-bold text-slate-400 sm:block">
              →
            </div>

            <div>
              <label
                htmlFor="from-unit"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                From
              </label>
              <select
                id="from-unit"
                value={fromUnit}
                onChange={(event) => setFromUnit(event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              >
                {availableUnits.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="to-unit"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              To
            </label>
            <select
              id="to-unit"
              value={toUnit}
              onChange={(event) => setToUnit(event.target.value)}
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            >
              {availableUnits.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-7 rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
            <p className="text-sm font-semibold text-indigo-700">Result</p>
            <p className="mt-2 break-words text-3xl font-bold text-slate-950">
              {formattedResult || "—"}
            </p>
            {result !== null && (
              <p className="mt-2 text-sm text-slate-600">
                {value} {availableUnits.find((unit) => unit.value === fromUnit)?.label}{" "}
                = {formattedResult}{" "}
                {availableUnits.find((unit) => unit.value === toUnit)?.label}
              </p>
            )}
          </div>
        </div>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-lg font-bold text-slate-900">
            About Unit Converter
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Convert common units of length, weight, temperature, and volume
            quickly and accurately. All calculations are performed directly in
            your browser.
          </p>
        </section>
      </section>
    </main>
  );
}
