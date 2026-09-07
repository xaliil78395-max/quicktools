"use client";

import Link from "next/link";
import { useState } from "react";

function formatSql(sql: string) {
  let formatted = sql
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s*=\s*/g, " = ")
    .replace(/\s*>\s*/g, " > ")
    .replace(/\s*<\s*/g, " < ")
    .trim();

  formatted = formatted
    .replace(/\s+(FROM)\s+/gi, "\nFROM ")
    .replace(/\s+(LEFT JOIN|RIGHT JOIN|INNER JOIN|FULL JOIN|OUTER JOIN|JOIN)\s+/gi, "\n$1 ")
    .replace(/\s+(WHERE)\s+/gi, "\nWHERE ")
    .replace(/\s+(GROUP BY)\s+/gi, "\nGROUP BY ")
    .replace(/\s+(HAVING)\s+/gi, "\nHAVING ")
    .replace(/\s+(ORDER BY)\s+/gi, "\nORDER BY ")
    .replace(/\s+(LIMIT)\s+/gi, "\nLIMIT ")
    .replace(/\s+(OFFSET)\s+/gi, "\nOFFSET ")
    .replace(/\s+(UNION)\s+/gi, "\nUNION ")
    .replace(/\s+(ON)\s+/gi, "\n  ON ")
    .replace(/\s+(AND|OR)\s+/gi, "\n  $1 ")
    .replace(/^SELECT\s+/i, "SELECT\n  ")
    .replace(/,\s*/g, ",\n  ")
    .replace(/\nFROM /g, "\nFROM ")
    .replace(/\nWHERE /g, "\nWHERE ")
    .replace(/\nGROUP BY /g, "\nGROUP BY ")
    .replace(/\nHAVING /g, "\nHAVING ")
    .replace(/\nORDER BY /g, "\nORDER BY ")
    .replace(/\nLIMIT /g, "\nLIMIT ")
    .replace(/\nOFFSET /g, "\nOFFSET ")
    .replace(/\nUNION /g, "\nUNION ")
    .replace(/\s*;\s*$/g, ";");

  return formatted.trim();
}

export default function SqlFormatterPage() {
  const [sql, setSql] = useState("");
  const [formatted, setFormatted] = useState("");

  function handleFormat() {
    if (!sql.trim()) return;
    setFormatted(formatSql(sql));
  }

  function clearAll() {
    setSql("");
    setFormatted("");
  }

  async function copyFormatted() {
    if (!formatted) return;
    await navigator.clipboard.writeText(formatted);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Back to QuickTools
        </Link>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              SQL Formatter
            </h1>
            <p className="mt-2 text-slate-600">
              Format and beautify SQL queries instantly.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              SQL Input
            </label>

            <textarea
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              placeholder={"SELECT users.name, orders.total FROM users JOIN orders ON users.id=orders.user_id WHERE orders.total>100 ORDER BY orders.total DESC;"}
              rows={14}
              className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <span>{sql.length} characters</span>
            <span>{sql.trim() ? sql.trim().split(/\s+/).length : 0} words</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleFormat}
              disabled={!sql.trim()}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Format SQL
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </button>

            {formatted && (
              <button
                type="button"
                onClick={copyFormatted}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Copy SQL
              </button>
            )}
          </div>

          {formatted && (
            <div className="mt-8">
              <label className="mb-2 block text-sm font-semibold">
                Formatted SQL
              </label>

              <textarea
                value={formatted}
                readOnly
                rows={16}
                className="w-full resize-y rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-mono text-sm leading-6 outline-none"
              />
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold">
            What is SQL Formatting?
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            SQL formatting organizes database queries into a clean and readable
            structure. It makes complex queries easier to understand, debug,
            and maintain.
          </p>
        </section>
      </div>
    </main>
  );
}


