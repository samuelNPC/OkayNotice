import { Metadata } from "next";
import LoanCalculator from "@/components/tools/LoanCalculator";

export const metadata: Metadata = {
  title: "Uganda Loan Repayment Calculator",
  description: "Calculate your monthly loan repayments, interest rates, and total payment amounts easily with our free Uganda Loan Calculator.",
};

export default function LoanPage() {
  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Loan Calculator</h1>
        <p className="text-slate-600">Plan your finances by estimating your monthly loan repayments before you borrow.</p>
      </div>
      
      <LoanCalculator />

      {/* AdSense Slot Placeholder */}
      <div className="w-full h-24 bg-slate-200 flex items-center justify-center text-slate-400 rounded-lg mt-12 text-sm">
        [AdSense Banner Slot]
      </div>
    </div>
  );
}
