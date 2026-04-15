"use client";

import { useState } from "react";

export default function MoMoCalculator() {
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<{ fee: number; total: number } | null>(null);

  const calculateFee = (val: number) => {
    // Basic placeholder tiers (You can update these exact figures later!)
    if (val <= 5000) return 330;
    if (val <= 60000) return 1000;
    if (val <= 125000) return 1925;
    if (val <= 500000) return 3575;
    return 7000; // Max tier example
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseInt(amount.replace(/,/g, ""));
    if (!numericAmount || numericAmount <= 0) return;

    const fee = calculateFee(numericAmount);
    setResult({ fee, total: numericAmount + fee });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Estimate MoMo Charges</h2>
      
      <form onSubmit={handleCalculate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Amount (UGX)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 50000"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
            required
          />
        </div>
        
        <button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Calculate
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
          <div className="flex justify-between text-slate-600">
            <span>Transaction Fee:</span>
            <span className="font-semibold text-red-500">UGX {result.fee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-900 font-bold text-lg border-t pt-3">
            <span>Total Needed:</span>
            <span>UGX {result.total.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
