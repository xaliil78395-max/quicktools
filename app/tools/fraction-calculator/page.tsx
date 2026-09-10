"use client";


import AdsterraAd from "@/components/AdsterraAd";
import { useMemo, useState } from "react";

type Fraction = {
  n: number;
  d: number;
};

type Operation = "+" | "-" | "×" | "÷";

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);

  while (b !== 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }

  return a || 1;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

function simplify(fraction: Fraction): Fraction {
  if (fraction.d === 0) {
    throw new Error("Denominator cannot be zero.");
  }

  if (fraction.n === 0) {
    return { n: 0, d: 1 };
  }

  const sign = fraction.d < 0 ? -1 : 1;
  const divisor = gcd(fraction.n, fraction.d);

  return {
    n: (fraction.n / divisor) * sign,
    d: Math.abs(fraction.d) / divisor,
  };
}

function toMixed(fraction: Fraction) {
  const f = simplify(fraction);
  const sign = f.n < 0 ? -1 : 1;
  const absN = Math.abs(f.n);
  const whole = Math.floor(absN / f.d);
  const remainder = absN % f.d;

  return {
    whole: whole * sign,
    n: remainder,
    d: f.d,
  };
}

function calculate(a: Fraction, b: Fraction, operation: Operation): Fraction {
  switch (operation) {
    case "+":
      return simplify({
        n: a.n * b.d + b.n * a.d,
        d: a.d * b.d,
      });
    case "-":
      return simplify({
        n: a.n * b.d - b.n * a.d,
        d: a.d * b.d,
      });
    case "×":
      return simplify({
        n: a.n * b.n,
        d: a.d * b.d,
      });
    case "÷":
      if (b.n === 0) {
        throw new Error("Cannot divide by zero.");
      }

      return simplify({
        n: a.n * b.d,
        d: a.d * b.n,
      });
  }
}

function fractionText(fraction: Fraction): string {
  const f = simplify(fraction);
  return `${f.n}/${f.d}`;
}

function mixedText(fraction: Fraction): string {
  const mixed = toMixed(fraction);

  if (mixed.n === 0) {
    return `${mixed.whole}`;
  }

  if (mixed.whole === 0) {
    return `${mixed.n}/${mixed.d}`;
  }

  return `${mixed.whole} ${mixed.n}/${mixed.d}`;
}

function decimalText(fraction: Fraction): string {
  const value = fraction.n / fraction.d;

  if (!Number.isFinite(value)) {
    return "Undefined";
  }

  return value.toLocaleString(undefined, {
    maximumFractionDigits: 12,
  });
}

function percentText(fraction: Fraction): string {
  const value = (fraction.n / fraction.d) * 100;

  return `${value.toLocaleString(undefined, {
    maximumFractionDigits: 10,
  })}%`;
}

function parseInteger(value: string, fallback = 0): number {
  if (value.trim() === "") {
    return fallback;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) && Number.isInteger(parsed) ? parsed : fallback;
}

export default function FractionCalculatorPage() {
  const [wholeA, setWholeA] = useState("0");
  const [numeratorA, setNumeratorA] = useState("1");
  const [denominatorA, setDenominatorA] = useState("2");

  const [wholeB, setWholeB] = useState("0");
  const [numeratorB, setNumeratorB] = useState("1");
  const [denominatorB, setDenominatorB] = useState("3");

  const [operation, setOperation] = useState<Operation>("+");
  const [calculated, setCalculated] = useState(true);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (!calculated) {
      return null;
    }

    try {
      const whole1 = parseInteger(wholeA);
      const num1 = parseInteger(numeratorA);
      const den1 = parseInteger(denominatorA, 1);

      const whole2 = parseInteger(wholeB);
      const num2 = parseInteger(numeratorB);
      const den2 = parseInteger(denominatorB, 1);

      if (den1 === 0 || den2 === 0) {
        return null;
      }

      const sign1 = whole1 < 0 ? -1 : 1;
      const sign2 = whole2 < 0 ? -1 : 1;

      const absWhole1 = Math.abs(whole1);
      const absWhole2 = Math.abs(whole2);

      const fraction1: Fraction = {
        n: sign1 * (absWhole1 * Math.abs(den1) + Math.abs(num1)) * (num1 < 0 ? -1 : 1),
        d: Math.abs(den1),
      };

      const fraction2: Fraction = {
        n: sign2 * (absWhole2 * Math.abs(den2) + Math.abs(num2)) * (num2 < 0 ? -1 : 1),
        d: Math.abs(den2),
      };

      return {
        a: simplify(fraction1),
        b: simplify(fraction2),
        result: calculate(fraction1, fraction2, operation),
      };
    } catch {
      return null;
    }
  }, [
    calculated,
    wholeA,
    numeratorA,
    denominatorA,
    wholeB,
    numeratorB,
    denominatorB,
    operation,
  ]);

  const handleCalculate = () => {
    setError("");

    const den1 = parseInteger(denominatorA, 1);
    const den2 = parseInteger(denominatorB, 1);

    if (den1 === 0 || den2 === 0) {
      setError("Denominator cannot be zero.");
      setCalculated(false);
      return;
    }

    if (
      !Number.isSafeInteger(parseInteger(wholeA)) ||
      !Number.isSafeInteger(parseInteger(numeratorA)) ||
      !Number.isSafeInteger(parseInteger(wholeB)) ||
      !Number.isSafeInteger(parseInteger(numeratorB))
    ) {
      setError("Please enter valid whole numbers.");
      setCalculated(false);
      return;
    }

    if (operation === "÷" && parseInteger(numeratorB) === 0) {
      setError("Cannot divide by zero.");
      setCalculated(false);
      return;
    }

    setCalculated(true);
  };

  const handleReset = () => {
    setWholeA("0");
    setNumeratorA("1");
    setDenominatorA("2");
    setWholeB("0");
    setNumeratorB("1");
    setDenominatorB("3");
    setOperation("+");
    setError("");
    setCalculated(true);
  };

  const steps = useMemo(() => {
    if (!result) {
      return [];
    }

    const a = result.a;
    const b = result.b;
    const rawA = `${a.n}/${a.d}`;
    const rawB = `${b.n}/${b.d}`;
    const lines: string[] = [];

    if (operation === "+" || operation === "-") {
      const commonDenominator = lcm(a.d, b.d);
      const scaledA = a.n * (commonDenominator / a.d);
      const scaledB = b.n * (commonDenominator / b.d);
      const numerator =
        operation === "+" ? scaledA + scaledB : scaledA - scaledB;

      lines.push(
        `Find the least common denominator: LCM(${a.d}, ${b.d}) = ${commonDenominator}.`
      );
      lines.push(
        `${rawA} ${operation} ${rawB} = ${scaledA}/${commonDenominator} ${operation} ${scaledB}/${commonDenominator}.`
      );
      lines.push(
        `Combine the numerators: ${scaledA} ${operation} ${scaledB} = ${numerator}.`
      );
      lines.push(`Simplify ${numerator}/${commonDenominator}.`);
    } else if (operation === "×") {
      lines.push(`Multiply the numerators: ${a.n} × ${b.n} = ${a.n * b.n}.`);
      lines.push(`Multiply the denominators: ${a.d} × ${b.d} = ${a.d * b.d}.`);
      lines.push(`Simplify ${a.n * b.n}/${a.d * b.d}.`);
    } else {
      lines.push(`Keep the first fraction: ${rawA}.`);
      lines.push(`Flip the second fraction: ${b.n}/${b.d} → ${b.d}/${b.n}.`);
      lines.push(
        `Multiply: ${a.n}/${a.d} × ${b.d}/${b.n} = ${(a.n * b.d)}/${a.d * b.n}.`
      );
      lines.push(`Simplify the result.`);
    }

    return lines;
  }, [result, operation]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Fraction Calculator
        </h1>
        <p className="mt-2 text-muted-foreground">
          Add, subtract, multiply, and divide fractions with exact results,
          automatic simplification, mixed numbers, decimals, percentages, and
          step-by-step solutions.
        </p>
      </div>


        <AdsterraAd />
        <section className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div>
            <h2 className="mb-3 text-lg font-semibold">First Fraction</h2>

            <div className="grid grid-cols-3 gap-3">
              <label className="text-sm">
                <span className="mb-1 block text-muted-foreground">Whole</span>
                <input
                  type="number"
                  value={wholeA}
                  onChange={(e) => {
                    setWholeA(e.target.value);
                    setCalculated(false);
                  }}
                  className="w-full rounded-lg border bg-background px-3 py-2"
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block text-muted-foreground">Numerator</span>
                <input
                  type="number"
                  value={numeratorA}
                  onChange={(e) => {
                    setNumeratorA(e.target.value);
                    setCalculated(false);
                  }}
                  className="w-full rounded-lg border bg-background px-3 py-2"
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block text-muted-foreground">Denominator</span>
                <input
                  type="number"
                  value={denominatorA}
                  onChange={(e) => {
                    setDenominatorA(e.target.value);
                    setCalculated(false);
                  }}
                  className="w-full rounded-lg border bg-background px-3 py-2"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-4 gap-2">
              {(["+", "-", "×", "÷"] as Operation[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setOperation(item);
                    setCalculated(false);
                  }}
                  className={`rounded-lg border px-4 py-2 font-semibold ${
                    operation === item
                      ? "bg-primary text-primary-foreground"
                      : "bg-background"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold">Second Fraction</h2>

            <div className="grid grid-cols-3 gap-3">
              <label className="text-sm">
                <span className="mb-1 block text-muted-foreground">Whole</span>
                <input
                  type="number"
                  value={wholeB}
                  onChange={(e) => {
                    setWholeB(e.target.value);
                    setCalculated(false);
                  }}
                  className="w-full rounded-lg border bg-background px-3 py-2"
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block text-muted-foreground">Numerator</span>
                <input
                  type="number"
                  value={numeratorB}
                  onChange={(e) => {
                    setNumeratorB(e.target.value);
                    setCalculated(false);
                  }}
                  className="w-full rounded-lg border bg-background px-3 py-2"
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block text-muted-foreground">Denominator</span>
                <input
                  type="number"
                  value={denominatorB}
                  onChange={(e) => {
                    setDenominatorB(e.target.value);
                    setCalculated(false);
                  }}
                  className="w-full rounded-lg border bg-background px-3 py-2"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCalculate}
            className="rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground"
          >
            Calculate
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border px-5 py-2.5 font-semibold"
          >
            Reset
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {result && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">Simplified Fraction</p>
              <p className="mt-1 text-2xl font-bold">{fractionText(result.result)}</p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">Mixed Number</p>
              <p className="mt-1 text-2xl font-bold">{mixedText(result.result)}</p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">Decimal</p>
              <p className="mt-1 text-2xl font-bold">{decimalText(result.result)}</p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">Percentage</p>
              <p className="mt-1 text-2xl font-bold">{percentText(result.result)}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-6 rounded-xl border bg-muted/30 p-5">
            <h2 className="text-lg font-semibold">Step-by-Step Solution</h2>

            <div className="mt-4 space-y-2 text-sm">
              {steps.map((step, index) => (
                <div key={step} className="flex gap-3">
                  <span className="font-semibold">{index + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>


<section className="mt-10 space-y-6">
        <div>
          <h2 className="text-2xl font-bold">How Fraction Calculations Work</h2>
          <p className="mt-2 text-muted-foreground">
            Addition and subtraction use a common denominator. Multiplication
            multiplies the numerators and denominators directly, while division
            multiplies the first fraction by the reciprocal of the second.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border p-5">
            <h3 className="font-semibold">Simplification</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              The numerator and denominator are divided by their greatest
              common divisor (GCD) so the result is in lowest terms.
            </p>
          </article>

          <article className="rounded-xl border p-5">
            <h3 className="font-semibold">Mixed Numbers</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              A mixed number combines a whole number with a proper fraction,
              making improper results easier to read.
            </p>
          </article>

          <article className="rounded-xl border p-5">
            <h3 className="font-semibold">Exact Arithmetic</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Fraction calculations are performed using integer numerators and
              denominators instead of rounding intermediate decimal values.
            </p>
          </article>

          <article className="rounded-xl border p-5">
            <h3 className="font-semibold">Browser-Based</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              All calculations run directly in your browser. No account or
              server-side calculation is required.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}



