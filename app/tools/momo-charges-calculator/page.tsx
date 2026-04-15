import { Metadata } from "next";
import MoMoCalculator from "@/components/tools/MoMoCalculator";

export const metadata: Metadata = {
  title: "MTN & Airtel MoMo Charges Calculator Uganda",
  description: "Instantly calculate Mobile Money sending and withdrawal fees for MTN MoMo and Airtel Money in Uganda.",
};

export default function MoMoPage() {
  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">MoMo Charges Calculator</h1>
        <p className="text-slate-600">Know exactly how much you need to send or withdraw without the guesswork.</p>
      </div>
      
      <MoMoCalculator />

      {/* AdSense Slot Placeholder */}
      <div className="w-full h-24 bg-slate-200 flex items-center justify-center text-slate-400 rounded-lg mt-12 text-sm">
        [AdSense Banner Slot]
      </div>
    </div>
  );
}
