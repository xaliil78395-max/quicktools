"use client";


import AdsterraAd from "@/components/AdsterraAd";
import { useMemo, useState } from "react";

type Row = {
  payment: number;
  principal: number;
  interest: number;
  balance: number;
};

export default function AmortizationCalculator() {
  const [amount, setAmount] = useState("250000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");

  const result = useMemo(() => {
    const principal = Number(amount);
    const annualRate = Number(rate);
    const termYears = Number(years);

    if (
      !Number.isFinite(principal) ||
      !Number.isFinite(annualRate) ||
      !Number.isFinite(termYears) ||
      principal <= 0 ||
      annualRate < 0 ||
      termYears <= 0
    ) {
      return null;
    }

    const totalMonths = Math.round(termYears * 12);
    const monthlyRate = annualRate / 100 / 12;

    const monthlyPayment =
      monthlyRate === 0
        ? principal / totalMonths
        : (principal * monthlyRate) /
          (1 - Math.pow(1 + monthlyRate, -totalMonths));

    let balance = principal;
    const schedule: Row[] = [];

    for (let month = 1; month <= totalMonths; month++) {
      const interest = monthlyRate === 0 ? 0 : balance * monthlyRate;
      const principalPaid = Math.min(
        monthlyPayment - interest,
        balance
      );

      balance = Math.max(0, balance - principalPaid);

      schedule.push({
        payment: monthlyPayment,
        principal: principalPaid,
        interest,
        balance,
      });
    }

    const totalInterest = schedule.reduce(
      (sum, row) => sum + row.interest,
      0
    );

    return {
      monthlyPayment,
      totalInterest,
      totalPayment: principal + totalInterest,
      totalMonths,
      schedule,
    };
  }, [amount, rate, years]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Amortization Calculator
          </h1>
          <p className="mt-2 text-muted-foreground">
            Calculate monthly loan payments and view a complete
            amortization schedule.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">

        <AdsterraAd />
        <section className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold">Loan Details</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Loan Amount
                </label>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2"
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
                  className="w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Loan Term (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2"
                />
              </div>
            </div>
          </section>


<section className="space-y-6">
            {result ? (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border bg-card p-5">
                    <p className="text-sm text-muted-foreground">
                      Monthly Payment
                    </p>
                    <p className="mt-2 text-2xl font-bold">
                      {formatCurrency(result.monthlyPayment)}
                    </p>
                  </div>

                  <div className="rounded-xl border bg-card p-5">
                    <p className="text-sm text-muted-foreground">
                      Total Interest
                    </p>
                    <p className="mt-2 text-2xl font-bold">
                      {formatCurrency(result.totalInterest)}
                    </p>
                  </div>

                  <div className="rounded-xl border bg-card p-5">
                    <p className="text-sm text-muted-foreground">
                      Total Payment
                    </p>
                    <p className="mt-2 text-2xl font-bold">
                      {formatCurrency(result.totalPayment)}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold">
                        Amortization Schedule
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {result.totalMonths} monthly payments
                      </p>
                    </div>
                  </div>

                  <div className="max-h-[600px] overflow-auto rounded-lg border">
                    <table className="w-full min-w-[650px] text-sm">
                      <thead className="sticky top-0 bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">
                            #
                          </th>
                          <th className="px-4 py-3 text-right font-semibold">
                            Payment
                          </th>
                          <th className="px-4 py-3 text-right font-semibold">
                            Principal
                          </th>
                          <th className="px-4 py-3 text-right font-semibold">
                            Interest
                          </th>
                          <th className="px-4 py-3 text-right font-semibold">
                            Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.schedule.map((row, index) => (
                          <tr
                            key={index}
                            className="border-t"
                          >
                            <td className="px-4 py-3">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {formatCurrency(row.payment)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {formatCurrency(row.principal)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {formatCurrency(row.interest)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {formatCurrency(row.balance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
                Enter valid loan details to calculate your amortization
                schedule.
              </div>
            )}
          </section>
        </div>


<section className="mt-8 rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold">
            What is an Amortization Schedule?
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            An amortization schedule shows how each loan payment is divided
            between principal and interest. Over time, more of each payment
            goes toward the principal while the interest portion decreases.
          </p>
        </section>
      </div>
    </main>
  );
}



