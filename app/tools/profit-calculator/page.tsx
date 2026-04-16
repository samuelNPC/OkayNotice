import { Metadata } from "next";
import ProfitCalculator from "@/components/tools/ProfitCalculator";
import { TrendingUp, ShieldCheck, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "E-commerce Profit Calculator | OkayNotice Tools",
  description: "Calculate your net profit, margins, and markups for your products. Perfect for Kabale Online vendors and Ugandan entrepreneurs.",
  openGraph: {
    title: "E-commerce Profit Calculator | OkayNotice",
    description: "Free tool to calculate Ugandan business profits including shipping and marketing costs.",
    type: "website",
  }
};

export default function ProfitCalculatorPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-12 md:pt-20">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
            Profit <span className="text-blue-700">Calculator</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Stop guessing your earnings. Enter your costs below to see exactly how much you make on every sale after shipping and fees.
          </p>
        </div>

        <ProfitCalculator />

        {/* SEO/Content Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-slate-100">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Analyze Margins</h4>
            <p className="text-sm text-slate-500">Understand the difference between your markup and actual profit margin.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-slate-100">
              <Zap className="text-blue-600" size={24} />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Optimize Ads</h4>
            <p className="text-sm text-slate-500">Calculate how much you can spend on Facebook/Google ads while staying profitable.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-slate-100">
              <ShieldCheck className="text-blue-600" size={24} />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Factor Logistics</h4>
            <p className="text-sm text-slate-500">Uganda-specific costs like Boda delivery and Mobile Money withdraw fees.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
