"use client";

import Link from "next/link";
import { useState } from "react";

type UnitSystem = "metric" | "imperial";

export default function BmiCalculatorPage() {
  const [unit, setUnit] = useState<UnitSystem>("metric");
  const [weight, setWeight] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [result, setResult] = useState<{
    bmi: number;
    category: string;
    minWeight: number;
    maxWeight: number;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    setResult(null);

    const weightValue = Number(weight);

    if (!Number.isFinite(weightValue) || weightValue <= 0) {
      setError("Please enter a valid weight.");
      return;
    }

    let bmi: number;
    let heightMeters: number;

    if (unit === "metric") {
      const height = Number(heightCm);

      if (!Number.isFinite(height) || height <= 0) {
        setError("Please enter a valid height.");
        return;
      }

      heightMeters = height / 100;
      bmi = weightValue / (heightMeters * heightMeters);
    } else {
      const feetValue = Number(feet);
      const inchesValue = Number(inches || "0");

      if (
        !Number.isFinite(feetValue) ||
        feetValue < 0 ||
        !Number.isFinite(inchesValue) ||
        inchesValue < 0 ||
        feetValue === 0 && inchesValue === 0
      ) {
        setError("Please enter a valid height.");
        return;
      }

      const totalInches = feetValue * 12 + inchesValue;
      bmi = (weightValue / (totalInches * totalInches)) * 703;
      heightMeters = totalInches * 0.0254;
    }

    if (!Number.isFinite(bmi) || bmi <= 0) {
      setError("Unable to calculate BMI.");
      return;
    }

    const category =
      bmi < 18.5
        ? "Underweight"
        : bmi < 25
          ? "Healthy weight"
          : bmi < 30
            ? "Overweight"
            : "Obesity";

    const minWeight = 18.5 * heightMeters * heightMeters;
    const maxWeight = 24.9 * heightMeters * heightMeters;

    setResult({
      bmi,
      category,
      minWeight,
      maxWeight,
    });
  }

  function clearAll() {
    setWeight("");
    setHeightCm("");
    setFeet("");
    setInches("");
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
              BMI Calculator
            </h1>
            <p className="mt-2 text-slate-600">
              Calculate your Body Mass Index (BMI) and see your BMI category
              and healthy weight range.
            </p>
          </div>

          <div className="mb-6 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setUnit("metric");
                setResult(null);
                setError("");
              }}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                unit === "metric"
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Metric
            </button>

            <button
              type="button"
              onClick={() => {
                setUnit("imperial");
                setResult(null);
                setError("");
              }}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                unit === "imperial"
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Imperial
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Weight ({unit === "metric" ? "kg" : "lb"})
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  value={weight}
                  onChange={(event) => setWeight(event.target.value)}
                  placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              {unit === "metric" ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Height (cm)
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    inputMode="decimal"
                    value={heightCm}
                    onChange={(event) => setHeightCm(event.target.value)}
                    placeholder="e.g. 175"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>
              ) : (
                <>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Height (ft)
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      inputMode="numeric"
                      value={feet}
                      onChange={(event) => setFeet(event.target.value)}
                      placeholder="e.g. 5"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Height (in)
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      inputMode="decimal"
                      value={inches}
                      onChange={(event) => setInches(event.target.value)}
                      placeholder="e.g. 9"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </label>
                </>
              )}
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
                Your BMI
              </div>

              <div className="mt-1 text-4xl font-bold text-indigo-700">
                {result.bmi.toFixed(1)}
              </div>

              <div className="mt-2 text-lg font-semibold text-slate-800">
                {result.category}
              </div>

              <div className="mt-5 rounded-xl bg-white p-4">
                <div className="text-sm font-semibold text-slate-700">
                  Healthy weight range
                </div>
                <div className="mt-1 text-xl font-bold text-slate-900">
                  {formatNumber(result.minWeight)}–{formatNumber(result.maxWeight)}{" "}
                  kg
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={calculate}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Calculate BMI
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
          <h2 className="text-xl font-bold">BMI Calculator Online</h2>

          <p className="mt-3 leading-7 text-slate-600">
            This free BMI calculator uses your height and weight to calculate
            Body Mass Index. Choose metric or imperial units, enter your
            measurements, and get your BMI result instantly.
          </p>

          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
            <div className="grid grid-cols-2 bg-slate-50 px-4 py-3 text-sm font-bold">
              <span>BMI</span>
              <span>Category</span>
            </div>
            <div className="grid grid-cols-2 border-t border-slate-200 px-4 py-3 text-sm">
              <span>Below 18.5</span>
              <span>Underweight</span>
            </div>
            <div className="grid grid-cols-2 border-t border-slate-200 px-4 py-3 text-sm">
              <span>18.5–24.9</span>
              <span>Healthy weight</span>
            </div>
            <div className="grid grid-cols-2 border-t border-slate-200 px-4 py-3 text-sm">
              <span>25.0–29.9</span>
              <span>Overweight</span>
            </div>
            <div className="grid grid-cols-2 border-t border-slate-200 px-4 py-3 text-sm">
              <span>30.0+</span>
              <span>Obesity</span>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-500">
            BMI is a screening measure and does not directly measure body fat
            or diagnose health conditions.
          </p>
        </section>
      </div>
    </main>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
  }).format(value);
}
