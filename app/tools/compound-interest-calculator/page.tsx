"use client";

import { useMemo, useState } from "react";

export default function CompoundInterestCalculatorPage() {
  const [initial, setInitial] = useState("10000");
  const [monthly, setMonthly] = useState("200");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("10");
  const [frequency, setFrequency] = useState("12");

  const result = useMemo(() => {
    const principal = Number(initial);
    const monthlyContribution = Number(monthly);
    const annualRate = Number(rate);
    const termYears = Number(years);
    const compoundsPerYear = Number(frequency);

    if (
      principal < 0 ||
      monthlyContribution < 0 ||
      annualRate < 0 ||
      termYears <= 0 ||
      compoundsPerYear <= 0
    ) {
      return null;
    }

    const periods = Math.round(termYears * compoundsPerYear);
    const periodicRate = annualRate / 100 / compoundsPerYear;

    let balance = principal;

    for (let period = 1; period <= periods; period++) {
      balance *= 1 + periodicRate;

      if (compoundsPerYear === 12) {
        balance += monthlyContribution;
      } else if (period % (compoundsPerYear / 12) === 0) {
        balance += monthlyContribution;
      }
    }

    const totalContributions =
      principal + monthlyContribution * Math.round(termYears * 12);
    const interestEarned = balance - totalContributions;

    return {
      finalBalance: balance,
      totalContributions,
      interestEarned,
    };
  }, [initial, monthly, rate, years, frequency]);

  const formatMoney = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Compound Interest Calculator
          </h1>
          <p className="mt-2 text-muted-foreground">
            Calculate how your money can grow with compound interest and
            regular contributions.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold">Investment Details</h2>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Initial Investment
                </label>
                <input
                  type="number"
                  min="0"
                  value={initial}
                  onChange={(e) => setInitial(e.target.value)}
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Monthly Contribution
                </label>
                <input
                  type="number"
                  min="0"
                  value={monthly}
                  onChange={(e) => setMonthly(e.target.value)}
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Annual Interest Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Investment Period (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Compounding Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="1">Annually</option>
                  <option value="2">Semi-annually</option>
                  <option value="4">Quarterly</option>
                  <option value="12">Monthly</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold">Growth Summary</h2>

            {result ? (
              <div className="space-y-4">
                <div className="rounded-xl bg-primary/10 p-5">
                  <p className="text-sm text-muted-foreground">
                    Future Value
                  </p>
                  <p className="mt-1 text-3xl font-bold">
                    {formatMoney(result.finalBalance)}
                  </p>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span className="text-muted-foreground">
                    Total Contributions
                  </span>
                  <span className="font-medium">
                    {formatMoney(result.totalContributions)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Interest Earned
                  </span>
                  <span className="font-semibold">
                    {formatMoney(result.interestEarned)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Enter valid investment details to see your results.
              </p>
            )}
          </section>
        </div>

        <div className="mt-8 rounded-2xl border bg-card p-6">
          <h2 className="text-lg font-semibold">How it works</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Compound interest allows your investment to earn returns on both
            the original amount and previously accumulated interest. Regular
            contributions can further increase the final value over time.
          </p>
        </div>
      </div>
    </main>
  );
}
