"use client";


import AdsterraAd from "@/components/AdsterraAd";
import Link from "next/link";
import { useState } from "react";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let characters = "";

    if (includeUppercase) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) characters += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) characters += "0123456789";
    if (includeSymbols) characters += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!characters) {
      setPassword("");
      return;
    }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    let result = "";

    for (let i = 0; i < length; i++) {
      result += characters[array[i] % characters.length];
    }

    setPassword(result);
    setCopied(false);
  };

  const copyPassword = async () => {
    if (!password) return;

    await navigator.clipboard.writeText(password);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const clearPassword = () => {
    setPassword("");
    setCopied(false);
  };

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            ← Back
          </Link>

          <Link
            href="/"
            className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Home
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Password Generator
          </h1>

          <p className="mt-3 text-muted-foreground">
            Generate strong and secure passwords instantly.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="rounded-xl border bg-background p-4">
            <div className="break-all font-mono text-lg">
              {password || "Your password will appear here"}
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center justify-between text-sm font-medium">
              <span>Password Length</span>
              <span>{length}</span>
            </label>

            <input
              type="range"
              min="6"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="mt-3 w-full"
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-xl border p-3">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
              />
              <span>Uppercase Letters</span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border p-3">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
              />
              <span>Lowercase Letters</span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border p-3">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
              />
              <span>Numbers</span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border p-3">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
              />
              <span>Symbols</span>
            </label>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={generatePassword}
              className="rounded-xl border px-4 py-3 font-medium transition hover:bg-muted"
            >
              Generate
            </button>

            <button
              type="button"
              onClick={copyPassword}
              className="rounded-xl border px-4 py-3 font-medium transition hover:bg-muted"
            >
              {copied ? "Copied!" : "Copy"}
            </button>

            <button
              type="button"
              onClick={clearPassword}
              className="rounded-xl border px-4 py-3 font-medium transition hover:bg-muted"
            >
              Clear
            </button>
          </div>
        </div>


        <AdsterraAd />
        <section className="mt-12">
          <h2 className="text-2xl font-bold">
            Free online password generator
          </h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            Use this free password generator to create strong passwords with
            uppercase letters, lowercase letters, numbers, and symbols. Your
            password is generated directly in your browser.
          </p>
        </section>
      </div>
    </main>
  );
}


