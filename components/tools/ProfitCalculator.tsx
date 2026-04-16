"use client";

import React, { useState, useEffect } from "react";
import { Calculator, TrendingUp, DollarSign, Package, Truck, Target } from "lucide-react";

export default function ProfitCalculator() {
  const [values, setValues] = useState({
    sellingPrice: 0,
    costPrice: 0,
    shippingCost: 0,
    marketingCost: 0,
    fees: 0, // e.g., platform or mobile money fees
  });

  const [results, setResults] = useState({
    grossProfit: 0,
    netProfit: 0,
    margin: 0,
    markup: 0,
  });

  useEffect(() => {
    const { sellingPrice, costPrice, shippingCost, marketingCost, fees } = values;
    
    const grossProfit = sellingPrice - costPrice;
    const totalExpenses = shippingCost + marketingCost + fees;
    const netProfit = sellingPrice - costPrice - totalExpenses;
    const margin = sellingPrice > 0 ? (netProfit / sellingPrice) * 100 : 0;
    const markup = costPrice > 0 ? ((sellingPrice - costPrice) / costPrice) * 100 : 0;

    setResults({ grossProfit, netProfit, margin, markup });
  }, [values]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const getHealthColor = (margin: number) => {
    if (margin >= 30) return "text-emerald-600";
    if (margin >= 15) return "text-blue-600";
    if (margin > 0) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white border border-slate-200 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        
        {/* INPUTS */}
        <div className="p-6 md:p-8 border-r border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center">
            <Calculator className="mr-2 text-blue-700" size={20} /> Input Details
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Selling Price (UGX)</label>
              <div className="relative">
                <input 
                  type="number" name="sellingPrice" placeholder="0" onChange={handleInput}
                  className="w-full pl-4 py-3 bg-white border border-slate-200 focus:border-blue-500 outline-none font-bold text-lg transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Cost Price</label>
                <input 
                  type="number" name="costPrice" placeholder="0" onChange={handleInput}
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Platform Fees</label>
                <input 
                  type="number" name="fees" placeholder="0" onChange={handleInput}
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 outline-none font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Shipping Cost</label>
                <input 
                  type="number" name="shippingCost" placeholder="0" onChange={handleInput}
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Marketing/Ads</label>
                <input 
                  type="number" name="marketingCost" placeholder="0" onChange={handleInput}
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 outline-none font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        <div className="p-6 md:p-8 flex flex-col justify-center">
          <div className="text-center mb-8">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Net Profit</p>
            <h3 className={`text-5xl font-black transition-colors ${getHealthColor(results.margin)}`}>
              {results.netProfit.toLocaleString()} <span className="text-xl">UGX</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Profit Margin</p>
              <p className="text-2xl font-black text-slate-900">{results.margin.toFixed(1)}%</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Markup</p>
              <p className="text-2xl font-black text-slate-900">{results.markup.toFixed(1)}%</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Gross Profit</p>
              <p className="text-xl font-bold text-slate-700">{results.grossProfit.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Total Costs</p>
              <p className="text-xl font-bold text-slate-700">
                {(values.costPrice + values.shippingCost + values.marketingCost + values.fees).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-100 text-blue-800 text-sm">
            <p><strong>Note:</strong> A healthy e-commerce margin in Uganda is typically between <strong>15% and 30%</strong> after all logistics.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
