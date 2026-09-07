"use client";

import { useMemo, useState } from "react";

export default function MortgageCalculatorPage() {
  const [homePrice, setHomePrice] = useState("350000");
  const [downPayment, setDownPayment] = useState("70000");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanTerm, setLoanTerm] = useState("30");
  const [propertyTax, setPropertyTax] = useState("1.2");
  const [homeInsurance, setHomeInsurance] = useState("150");

  const result = useMemo(() => {
    const price = Number(homePrice);
    const down = Number(downPayment);
    const annualRate = Number(interestRate);
    const years = Number(loanTerm);
    const taxRate = Number(propertyTax);
    const insurance = Number(homeInsurance);

    if (
      !Number.isFinite(price) ||
      !Number.isFinite(down) ||
      !Number.isFinite(annualRate) ||
      !Number.isFinite(years) ||
      !Number.isFinite(taxRate) ||
      !Number.isFinite(insurance) ||
      price <= 0 ||
      down < 0 ||
      down >= price ||
      annualRate < 0 ||
      years <= 0 ||
      taxRate < 0 ||
      insurance < 0
    ) {
      return null;
    }

    const principal = price - down;
    const months = years * 12;
    const monthlyRate = annualRate / 100 / 12;

    const monthlyPayment =
      monthlyRate === 0
        ? principal / months
        : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);

    const monthlyTax = (price * (taxRate / 100)) / 12;
    const totalMonthly = monthlyPayment + monthlyTax + insurance;
    const totalPayments = monthlyPayment * months;
    const totalInterest = totalPayments - principal;
    const totalCost = totalPayments + down;

    return {
      principal,
      months,
      monthlyPayment,
      monthlyTax,
      insurance,
      totalMonthly,
      totalInterest,
      totalCost,
    };
  }, [homePrice, downPayment, interestRate, loanTerm, propertyTax, homeInsurance]);

  const money = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Mortgage Calculator
        </h1>
        <p className="mt-2 text-gray-600">
          Calculate your monthly mortgage payment, interest, taxes, and insurance.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Mortgage Details</h2>

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Home Price ($)
              </span>
              <input
                type="number"
                min="0"
                value={homePrice}
                onChange={(e) => setHomePrice(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Down Payment ($)
              </span>
              <input
                type="number"
                min="0"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Interest Rate (%)
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Loan Term
              </span>
              <select
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
              >
                <option value="10">10 years</option>
                <option value="15">15 years</option>
                <option value="20">20 years</option>
                <option value="25">25 years</option>
                <option value="30">30 years</option>
                <option value="40">40 years</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Property Tax (% per year)
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={propertyTax}
                onChange={(e) => setPropertyTax(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Home Insurance ($/month)
              </span>
              <input
                type="number"
                min="0"
                value={homeInsurance}
                onChange={(e) => setHomeInsurance(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Your Estimate</h2>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-xl border p-5">
                <p className="text-sm text-gray-500">
                  Estimated Monthly Payment
                </p>
                <p className="mt-1 text-4xl font-bold">
                  {money(result.totalMonthly)}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border p-4">
                  <p className="text-sm text-gray-500">Principal & Interest</p>
                  <p className="mt-1 text-xl font-semibold">
                    {money(result.monthlyPayment)}
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-sm text-gray-500">Property Tax</p>
                  <p className="mt-1 text-xl font-semibold">
                    {money(result.monthlyTax)}
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-sm text-gray-500">Home Insurance</p>
                  <p className="mt-1 text-xl font-semibold">
                    {money(result.insurance)}
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-sm text-gray-500">Loan Amount</p>
                  <p className="mt-1 text-xl font-semibold">
                    {money(result.principal)}
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-sm text-gray-500">Total Interest</p>
                  <p className="mt-1 text-xl font-semibold">
                    {money(result.totalInterest)}
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-sm text-gray-500">Total Cost</p>
                  <p className="mt-1 text-xl font-semibold">
                    {money(result.totalCost)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                <p>
                  Loan term: <strong>{loanTerm} years</strong>
                </p>
                <p className="mt-1">
                  Total payments: <strong>{result.months}</strong>
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">
              Enter valid mortgage details to see your estimate.
            </p>
          )}
        </section>
      </div>

      <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">How Mortgage Payments Work</h2>
        <p className="mt-3 leading-7 text-gray-600">
          A mortgage payment typically includes principal and interest.
          Property taxes and homeowners insurance can also be included in the
          estimated monthly housing cost. Your actual payment may vary based
          on your lender, taxes, insurance, fees, and other costs.
        </p>
      </section>
    </main>
  );
}
