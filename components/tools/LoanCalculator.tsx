"use client";

import { useState } from "react";

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  const calculateLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100 / 12; // Monthly interest rate
    const n = parseFloat(months);

    if (p > 0 && r > 0 && n > 0) {
      // Standard Amortization Formula
      const payment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setMonthlyPayment(payment);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Loan Calculator</h2>
      
      <form onSubmit={calculateLoan} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Loan Amount (UGX)</label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} required
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Interest Rate (%)</label>
            <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Period (Months)</label>
            <input type="number" value={months} onChange={(e) => setMonths(e.target.value)} required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>
        </div>
        
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
          Calculate Monthly Repayment
        </button>
      </form>

      {monthlyPayment && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100 text-center">
          <p className="text-sm text-green-800 mb-1">Estimated Monthly Payment</p>
          <p className="text-2xl font-bold text-green-700">UGX {Math.round(monthlyPayment).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
