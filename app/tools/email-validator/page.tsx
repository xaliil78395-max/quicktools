"use client";

import Link from "next/link";
import { useState } from "react";

type ValidationResult = {
  email: string;
  valid: boolean;
  message: string;
};

function validateEmail(email: string): ValidationResult {
  const value = email.trim();

  if (!value) {
    return {
      email: value,
      valid: false,
      message: "Please enter an email address.",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    return {
      email: value,
      valid: false,
      message: "This is not a valid email address.",
    };
  }

  return {
    email: value,
    valid: true,
    message: "This is a valid email address.",
  };
}

export default function EmailValidatorPage() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);

  function handleValidate() {
    setResult(validateEmail(email));
  }

  function clearAll() {
    setEmail("");
    setResult(null);
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
              Email Validator
            </h1>
            <p className="mt-2 text-slate-600">
              Check whether an email address has a valid format instantly.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleValidate();
                }
              }}
              placeholder="example@email.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleValidate}
              disabled={!email.trim()}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Validate Email
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </button>
          </div>

          {result && (
            <div
              className={`mt-8 rounded-xl border p-5 ${
                result.valid
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold ${
                    result.valid
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {result.valid ? "✓" : "!"}
                </span>

                <div>
                  <p
                    className={`font-semibold ${
                      result.valid ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {result.valid ? "Valid Email" : "Invalid Email"}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {result.message}
                  </p>
                </div>
              </div>

              {result.email && (
                <p className="mt-4 break-all font-mono text-sm text-slate-700">
                  {result.email}
                </p>
              )}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold">
            What Does an Email Validator Check?
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            An email validator checks the basic structure of an email address,
            including the presence of an email name, the @ symbol, and a valid
            domain format. This tool checks the format only and does not send
            an email or verify whether the mailbox actually exists.
          </p>
        </section>
      </div>
    </main>
  );
}
