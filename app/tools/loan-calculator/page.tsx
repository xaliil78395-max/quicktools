"use client";

import { useMemo, useState } from "react";

export default function LoanCalculatorPage() {
  const [amount, setAmount] = useState("10000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("5");

  const result = useMemo(() => {
    const principal = Number(amount);
    const annualRate = Number(rate);
    const termYears = Number(years);

    if (!principal || principal <= 0 || termYears <= 0 || annualRate < 0) {
      return null;
    }

    const monthlyRate = annualRate / 100 / 12;
    const months = termYears * 12;

    const monthlyPayment =
      monthlyRate === 0
        ? principal / months
        : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);

    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - principal;

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      months,
    };
  }, [amount, rate, years]);

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
          <h1 className="text-3xl font-bold tracking-tight">Loan Calculator</h1>
          <p className="mt-2 text-muted-foreground">
            Calculate your monthly loan payment, total interest, and total cost.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold">Loan Details</h2>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Loan Amount
                </label>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
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
                  Loan Term (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold">Loan Summary</h2>

            {result ? (
              <div className="space-y-4">
                <div className="rounded-xl bg-primary/10 p-5">
                  <p className="text-sm text-muted-foreground">
                    Monthly Payment
                  </p>
                  <p className="mt-1 text-3xl font-bold">
                    {formatMoney(result.monthlyPayment)}
                  </p>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span className="text-muted-foreground">Loan Amount</span>
                  <span className="font-medium">
                    {formatMoney(Number(amount))}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span className="text-muted-foreground">Total Interest</span>
                  <span className="font-medium">
                    {formatMoney(result.totalInterest)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Payment</span>
                  <span className="font-semibold">
                    {formatMoney(result.totalPayment)}
                  </span>
                </div>

                <p className="pt-3 text-sm text-muted-foreground">
                  {result.months} monthly payments over {years} years.
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Enter valid loan details to see your results.
              </p>
            )}
          </section>
        </div>

        <div className="mt-8 rounded-2xl border bg-card p-6">
          <h2 className="text-lg font-semibold">How it works</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            This calculator uses the standard amortizing loan formula to
            estimate your monthly payment and total interest. Results are
            estimates and may differ from your lender&apos;s actual terms.
          </p>
        </div>
      </div>
    </main>
  );
}
