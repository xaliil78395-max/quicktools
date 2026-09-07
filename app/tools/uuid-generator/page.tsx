"use client";

import Link from "next/link";
import { useState } from "react";

function generateUuidV4() {
  return crypto.randomUUID();
}

function generateUuidV1Like() {
  const uuidEpochOffset = 12219292800000;
  const timestamp = BigInt(Date.now() + uuidEpochOffset) * BigInt(10000);
  const timestampHex = timestamp.toString(16).padStart(16, "0");

  const timeLow = timestampHex.slice(8);
  const timeMid = timestampHex.slice(4, 8);
  const timeHigh = (parseInt(timestampHex.slice(0, 4), 16) | 0x1000)
    .toString(16)
    .padStart(4, "0");

  const randomBytes = new Uint8Array(8);
  crypto.getRandomValues(randomBytes);

  randomBytes[0] = (randomBytes[0] & 0x3f) | 0x80;

  const clockSequence = Array.from(randomBytes.slice(0, 2))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  const node = Array.from(randomBytes.slice(2))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return `${timeLow}-${timeMid}-${timeHigh}-${clockSequence}-${node}`;
}

export default function UuidGenerator() {
  const [version, setVersion] = useState<"v4" | "v1">("v4");
  const [quantity, setQuantity] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateUuids = () => {
    const count = Math.min(100, Math.max(1, quantity));

    const generated = Array.from({ length: count }, () =>
      version === "v4" ? generateUuidV4() : generateUuidV1Like(),
    );

    setUuids(generated);
    setCopied(false);
  };

  const copyResult = async () => {
    if (!uuids.length) return;

    try {
      await navigator.clipboard.writeText(uuids.join("\n"));
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  const clearAll = () => {
    setUuids([]);
    setCopied(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            ← Back to QuickTools
          </Link>

          <div className="mt-8 inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
            Developer Tool
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            UUID Generator
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Generate random UUIDs instantly for development, databases, APIs,
            and other projects.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  UUID Version
                </label>

                <select
                  value={version}
                  onChange={(event) => {
                    setVersion(event.target.value as "v4" | "v1");
                    setUuids([]);
                    setCopied(false);
                  }}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="v4">UUID v4 — Random</option>
                  <option value="v1">UUID v1 — Time-based</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Number of UUIDs
                </label>

                <input
                  type="number"
                  min={1}
                  max={100}
                  value={quantity}
                  onChange={(event) => {
                    const value = Number(event.target.value);

                    if (Number.isNaN(value)) {
                      setQuantity(1);
                      return;
                    }

                    setQuantity(Math.min(100, Math.max(1, value)));
                  }}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={generateUuids}
              className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Generate UUID{quantity === 1 ? "" : "s"}
            </button>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-4">
                <label className="text-lg font-semibold">Generated UUIDs</label>

                <span className="text-sm text-slate-500">
                  {uuids.length} {uuids.length === 1 ? "UUID" : "UUIDs"}
                </span>
              </div>

              <textarea
                value={uuids.join("\n")}
                readOnly
                placeholder="Your UUIDs will appear here..."
                spellCheck={false}
                className="mt-4 h-72 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-7 text-slate-700 outline-none"
              />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={copyResult}
                disabled={!uuids.length}
                className="rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copied ? "Copied!" : "Copy UUIDs"}
              </button>

              <button
                type="button"
                onClick={clearAll}
                className="rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold">Free UUID Generator</h2>

          <p className="mt-3 leading-7 text-slate-600">
            Generate unique identifiers for applications, databases, APIs,
            sessions, and other development projects. You can generate up to
            100 UUIDs at once.
          </p>

          <p className="mt-3 leading-7 text-slate-600">
            UUID v4 uses secure browser randomness through the Web Crypto API.
            The generated UUIDs are created directly in your browser and are
            not uploaded to a server.
          </p>
        </div>
      </section>
    </main>
  );
}


