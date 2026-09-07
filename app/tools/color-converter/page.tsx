"use client";

import Link from "next/link";
import { useState } from "react";

type ColorValues = {
  hex: string;
  rgb: string;
  hsl: string;
};

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "").trim();

  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;

  const value = parseInt(clean, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    switch (max) {
      case r:
        h = 60 * (((g - b) / delta) % 6);
        break;
      case g:
        h = 60 * ((b - r) / delta + 2);
        break;
      case b:
        h = 60 * ((r - g) / delta + 4);
        break;
    }
  }

  if (h < 0) h += 360;

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function convertColor(value: string): ColorValues | null {
  const rgb = hexToRgb(value);

  if (!rgb) return null;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  return {
    hex: `#${value.replace("#", "").toUpperCase()}`,
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
  };
}

export default function ColorConverterPage() {
  const [hex, setHex] = useState("#4F46E5");
  const [color, setColor] = useState<ColorValues | null>(
    convertColor("#4F46E5"),
  );
  const [error, setError] = useState("");

  function handleConvert() {
    const result = convertColor(hex);

    if (!result) {
      setError("Please enter a valid 6-digit HEX color.");
      setColor(null);
      return;
    }

    setError("");
    setColor(result);
  }

  function handleColorPicker(value: string) {
    setHex(value.toUpperCase());
    setError("");
    setColor(convertColor(value));
  }

  async function copyValue(value: string) {
    await navigator.clipboard.writeText(value);
  }

  function clearAll() {
    setHex("");
    setColor(null);
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
              Color Converter
            </h1>
            <p className="mt-2 text-slate-600">
              Convert HEX colors to RGB and HSL instantly.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr_180px]">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                HEX Color
              </label>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={hex}
                  onChange={(e) => setHex(e.target.value)}
                  placeholder="#4F46E5"
                  className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 font-mono uppercase outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <input
                  type="color"
                  value={/^#[0-9A-Fa-f]{6}$/.test(hex) ? hex : "#4F46E5"}
                  onChange={(e) => handleColorPicker(e.target.value)}
                  className="h-12 w-14 cursor-pointer rounded-xl border border-slate-300 bg-white p-1"
                  aria-label="Choose a color"
                />
              </div>

              {error && (
                <p className="mt-2 text-sm font-medium text-red-600">
                  {error}
                </p>
              )}
            </div>

            <div
              className="min-h-28 rounded-2xl border border-slate-200"
              style={{
                backgroundColor: color?.hex || "#ffffff",
              }}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleConvert}
              disabled={!hex.trim()}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Convert Color
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </button>
          </div>

          {color && (
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { label: "HEX", value: color.hex },
                { label: "RGB", value: color.rgb },
                { label: "HSL", value: color.hsl },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-600">
                      {item.label}
                    </span>

                    <button
                      type="button"
                      onClick={() => copyValue(item.value)}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      Copy
                    </button>
                  </div>

                  <code className="break-all text-sm text-slate-900">
                    {item.value}
                  </code>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold">
            HEX, RGB and HSL Color Formats
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            HEX, RGB, and HSL are common color formats used in web design and
            development. Use this tool to quickly convert a HEX color into its
            RGB and HSL equivalents.
          </p>
        </section>
      </div>
    </main>
  );
}
