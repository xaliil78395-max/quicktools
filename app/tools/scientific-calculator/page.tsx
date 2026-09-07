"use client";

import { useMemo, useState } from "react";

type AngleMode = "DEG" | "RAD";

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [angleMode, setAngleMode] = useState<AngleMode>("DEG");
  const [memory, setMemory] = useState(0);
  const [justCalculated, setJustCalculated] = useState(false);

  const currentValue = useMemo(() => {
    const value = Number(display);
    return Number.isFinite(value) ? value : 0;
  }, [display]);

  const formatNumber = (value: number) => {
    if (!Number.isFinite(value)) return "Error";
    if (Math.abs(value) < 1e-12) return "0";
    return Number(value.toPrecision(12)).toString();
  };

  const factorial = (n: number): number => {
    if (!Number.isInteger(n) || n < 0 || n > 170) {
      throw new Error("Invalid factorial");
    }

    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const evaluate = (input: string): number => {
    let exp = input
      .replace(/π/g, "Math.PI")
      .replace(/\be\b/g, "Math.E")
      .replace(/\^/g, "**");

    exp = exp.replace(
      /(\d+(?:\.\d+)?)!/g,
      "factorial($1)"
    );

    exp = exp.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");

    exp = exp.replace(
      /sin\(/g,
      angleMode === "DEG"
        ? "Math.sin((Math.PI/180)*("
        : "Math.sin("
    );
    exp = exp.replace(
      /cos\(/g,
      angleMode === "DEG"
        ? "Math.cos((Math.PI/180)*("
        : "Math.cos("
    );
    exp = exp.replace(
      /tan\(/g,
      angleMode === "DEG"
        ? "Math.tan((Math.PI/180)*("
        : "Math.tan("
    );

    exp = exp.replace(/sqrt\(/g, "Math.sqrt(");
    exp = exp.replace(/cbrt\(/g, "Math.cbrt(");
    exp = exp.replace(/log\(/g, "Math.log10(");
    exp = exp.replace(/ln\(/g, "Math.log(");
    exp = exp.replace(/abs\(/g, "Math.abs(");
    exp = exp.replace(/exp\(/g, "Math.exp(");

    try {
      const fn = new Function(
        "factorial",
        `"use strict"; return (${exp});`
      );

      const result = fn(factorial);

      if (typeof result !== "number" || !Number.isFinite(result)) {
        throw new Error("Invalid result");
      }

      return result;
    } catch {
      throw new Error("Invalid expression");
    }
  };

  const calculate = () => {
    if (!expression.trim()) return;

    try {
      const result = evaluate(expression);
      setDisplay(formatNumber(result));
      setExpression("");
      setJustCalculated(true);
    } catch {
      setDisplay("Error");
      setExpression("");
      setJustCalculated(true);
    }
  };

  const addInput = (value: string) => {
    if (display === "Error") {
      setDisplay("0");
    }

    if (justCalculated) {
      setExpression("");
      setDisplay("0");
      setJustCalculated(false);
    }

    setExpression((current) => current + value);
  };

  const clear = () => {
    setDisplay("0");
    setExpression("");
    setJustCalculated(false);
  };

  const backspace = () => {
    if (expression) {
      setExpression((current) => current.slice(0, -1));
    } else {
      setDisplay((current) =>
        current.length > 1 ? current.slice(0, -1) : "0"
      );
    }
  };

  const unary = (type: string) => {
    const value = currentValue;

    try {
      let result = value;

      if (type === "square") result = value ** 2;
      if (type === "sqrt") result = Math.sqrt(value);
      if (type === "cbrt") result = Math.cbrt(value);
      if (type === "reciprocal") result = 1 / value;
      if (type === "factorial") result = factorial(value);
      if (type === "negate") result = -value;
      if (type === "abs") result = Math.abs(value);

      setDisplay(formatNumber(result));
      setExpression("");
      setJustCalculated(true);
    } catch {
      setDisplay("Error");
      setExpression("");
      setJustCalculated(true);
    }
  };

  const memoryAdd = () => setMemory((value) => value + currentValue);
  const memorySubtract = () => setMemory((value) => value - currentValue);
  const memoryRecall = () => {
    setDisplay(formatNumber(memory));
    setExpression("");
    setJustCalculated(true);
  };
  const memoryClear = () => setMemory(0);

  const buttonClass =
    "rounded-lg border bg-card px-3 py-3 text-sm font-medium transition hover:bg-muted active:scale-95";

  const operatorClass =
    "rounded-lg border bg-muted px-3 py-3 text-sm font-semibold transition hover:opacity-80 active:scale-95";

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Scientific Calculator
          </h1>
          <p className="mt-2 text-muted-foreground">
            Perform advanced mathematical calculations with scientific
            functions, powers, roots, and trigonometry.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm sm:p-6">
          <div className="mb-4 rounded-lg border bg-background p-4 text-right">
            <div className="min-h-6 overflow-x-auto text-sm text-muted-foreground">
              {expression || "\u00A0"}
            </div>
            <div className="mt-2 min-h-10 overflow-x-auto text-3xl font-semibold">
              {display}
            </div>
          </div>

          <div className="mb-4 grid grid-cols-4 gap-2">
            <button type="button" onClick={memoryClear} className={buttonClass}>
              MC
            </button>
            <button type="button" onClick={memoryRecall} className={buttonClass}>
              MR
            </button>
            <button type="button" onClick={memoryAdd} className={buttonClass}>
              M+
            </button>
            <button
              type="button"
              onClick={memorySubtract}
              className={buttonClass}
            >
              M−
            </button>
          </div>

          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              Memory: {formatNumber(memory)}
            </div>

            <div className="flex overflow-hidden rounded-lg border">
              {(["DEG", "RAD"] as AngleMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setAngleMode(mode)}
                  className={`px-4 py-2 text-sm font-semibold ${
                    angleMode === mode ? "bg-muted" : "bg-background"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button type="button" onClick={() => unary("square")} className={buttonClass}>
              x²
            </button>
            <button type="button" onClick={() => addInput("^")} className={buttonClass}>
              xʸ
            </button>
            <button type="button" onClick={() => addInput("sqrt(")} className={buttonClass}>
              √x
            </button>
            <button type="button" onClick={() => unary("reciprocal")} className={buttonClass}>
              1/x
            </button>

            <button type="button" onClick={() => addInput("sin(")} className={buttonClass}>
              sin
            </button>
            <button type="button" onClick={() => addInput("cos(")} className={buttonClass}>
              cos
            </button>
            <button type="button" onClick={() => addInput("tan(")} className={buttonClass}>
              tan
            </button>
            <button type="button" onClick={() => addInput("log(")} className={buttonClass}>
              log
            </button>

            <button type="button" onClick={() => addInput("ln(")} className={buttonClass}>
              ln
            </button>
            <button type="button" onClick={() => addInput("abs(")} className={buttonClass}>
              abs
            </button>
            <button type="button" onClick={() => addInput("exp(")} className={buttonClass}>
              eˣ
            </button>
            <button type="button" onClick={() => addInput("cbrt(")} className={buttonClass}>
              ∛x
            </button>

            <button type="button" onClick={() => addInput("π")} className={buttonClass}>
              π
            </button>
            <button type="button" onClick={() => addInput("e")} className={buttonClass}>
              e
            </button>
            <button type="button" onClick={() => addInput("!")} className={buttonClass}>
              x!
            </button>
            <button type="button" onClick={() => addInput("%")} className={buttonClass}>
              %
            </button>

            <button type="button" onClick={clear} className={operatorClass}>
              AC
            </button>
            <button type="button" onClick={backspace} className={operatorClass}>
              ⌫
            </button>
            <button type="button" onClick={() => addInput("(")} className={operatorClass}>
              (
            </button>
            <button type="button" onClick={() => addInput(")")} className={operatorClass}>
              )
            </button>

            {["7", "8", "9"].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => addInput(value)}
                className={buttonClass}
              >
                {value}
              </button>
            ))}
            <button type="button" onClick={() => addInput("/")} className={operatorClass}>
              ÷
            </button>

            {["4", "5", "6"].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => addInput(value)}
                className={buttonClass}
              >
                {value}
              </button>
            ))}
            <button type="button" onClick={() => addInput("*")} className={operatorClass}>
              ×
            </button>

            {["1", "2", "3"].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => addInput(value)}
                className={buttonClass}
              >
                {value}
              </button>
            ))}
            <button type="button" onClick={() => addInput("-")} className={operatorClass}>
              −
            </button>

            <button type="button" onClick={() => unary("negate")} className={buttonClass}>
              ±
            </button>
            <button type="button" onClick={() => addInput("0")} className={buttonClass}>
              0
            </button>
            <button type="button" onClick={() => addInput(".")} className={buttonClass}>
              .
            </button>
            <button type="button" onClick={() => addInput("+")} className={operatorClass}>
              +
            </button>

            <button
              type="button"
              onClick={() => unary("factorial")}
              className={buttonClass}
            >
              n!
            </button>
            <button
              type="button"
              onClick={calculate}
              className="col-span-3 rounded-lg border px-3 py-3 text-sm font-bold transition hover:bg-muted active:scale-[0.99]"
            >
              =
            </button>
          </div>
        </div>

        <section className="mt-8 rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold">
            Scientific Calculator Functions
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Use trigonometric functions in degrees or radians, calculate
            logarithms, powers, roots, factorials, percentages, and common
            mathematical constants. All calculations run directly in your
            browser.
          </p>
        </section>
      </div>
    </main>
  );
}
