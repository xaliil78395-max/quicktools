"use client";

import { useMemo, useState } from "react";

export default function TimeCardCalculatorPage() {
  const [clockIn, setClockIn] = useState("09:00");
  const [clockOut, setClockOut] = useState("17:00");
  const [breakMinutes, setBreakMinutes] = useState("60");
  const [hourlyRate, setHourlyRate] = useState("20");
  const [overtimeAfter, setOvertimeAfter] = useState("8");

  const result = useMemo(() => {
    const start = clockIn.split(":").map(Number);
    const end = clockOut.split(":").map(Number);
    const breakTime = Number(breakMinutes);
    const rate = Number(hourlyRate);
    const overtimeLimit = Number(overtimeAfter);

    if (
      start.length !== 2 ||
      end.length !== 2 ||
      !Number.isFinite(breakTime) ||
      !Number.isFinite(rate) ||
      !Number.isFinite(overtimeLimit) ||
      breakTime < 0 ||
      rate < 0 ||
      overtimeLimit <= 0 ||
      start.some((n) => !Number.isFinite(n)) ||
      end.some((n) => !Number.isFinite(n)) ||
      start[0] < 0 ||
      start[0] > 23 ||
      end[0] < 0 ||
      end[0] > 23 ||
      start[1] < 0 ||
      start[1] > 59 ||
      end[1] < 0 ||
      end[1] > 59
    ) {
      return null;
    }

    let startMinutes = start[0] * 60 + start[1];
    let endMinutes = end[0] * 60 + end[1];

    if (endMinutes <= startMinutes) {
      endMinutes += 24 * 60;
    }

    const grossMinutes = endMinutes - startMinutes;
    const workedMinutes = Math.max(0, grossMinutes - breakTime);
    const workedHours = workedMinutes / 60;

    const regularHours = Math.min(workedHours, overtimeLimit);
    const overtimeHours = Math.max(0, workedHours - overtimeLimit);

    const regularPay = regularHours * rate;
    const overtimePay = overtimeHours * rate * 1.5;
    const totalPay = regularPay + overtimePay;

    const hours = Math.floor(workedMinutes / 60);
    const minutes = workedMinutes % 60;

    return {
      workedHours,
      overtimeHours,
      regularPay,
      overtimePay,
      totalPay,
      formatted: `${hours}h ${minutes}m`,
    };
  }, [clockIn, clockOut, breakMinutes, hourlyRate, overtimeAfter]);

  const money = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Time Card Calculator
        </h1>
        <p className="mt-2 text-gray-600">
          Calculate work hours, overtime, and earnings from your time card.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Work Details</h2>

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Clock In
              </span>
              <input
                type="time"
                value={clockIn}
                onChange={(e) => setClockIn(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Clock Out
              </span>
              <input
                type="time"
                value={clockOut}
                onChange={(e) => setClockOut(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Unpaid Break (minutes)
              </span>
              <input
                type="number"
                min="0"
                value={breakMinutes}
                onChange={(e) => setBreakMinutes(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Hourly Rate ($)
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Overtime After (hours)
              </span>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={overtimeAfter}
                onChange={(e) => setOvertimeAfter(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Your Results</h2>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-xl border p-5">
                <p className="text-sm text-gray-500">Total Work Time</p>
                <p className="mt-1 text-4xl font-bold">
                  {result.formatted}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border p-4">
                  <p className="text-sm text-gray-500">Regular Hours</p>
                  <p className="mt-1 text-xl font-semibold">
                    {result.workedHours >= Number(overtimeAfter)
                      ? Number(overtimeAfter).toFixed(2)
                      : result.workedHours.toFixed(2)}
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-sm text-gray-500">Overtime Hours</p>
                  <p className="mt-1 text-xl font-semibold">
                    {result.overtimeHours.toFixed(2)}
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-sm text-gray-500">Regular Pay</p>
                  <p className="mt-1 text-xl font-semibold">
                    {money(result.regularPay)}
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-sm text-gray-500">Overtime Pay</p>
                  <p className="mt-1 text-xl font-semibold">
                    {money(result.overtimePay)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="mt-1 text-3xl font-bold">
                  {money(result.totalPay)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">
              Enter valid work details to calculate your time card.
            </p>
          )}
        </section>
      </div>

      <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">How It Works</h2>
        <p className="mt-3 leading-7 text-gray-600">
          Enter your clock-in and clock-out times, subtract any unpaid break,
          and the calculator determines your total working time. If your
          working hours exceed the overtime threshold, the extra hours are
          calculated separately at 1.5 times the regular hourly rate.
        </p>
      </section>
    </main>
  );
}
