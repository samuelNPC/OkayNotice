import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about OkayNotice, your premier hub for Uganda tech news, financial tools, and the best gadget deals.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">About OkayNotice</h1>
        
        <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
          <p>
            Welcome to <span className="font-semibold text-slate-900">OkayNotice</span>, Uganda's premier destination for navigating the digital and financial landscape. 
          </p>
          
          <p>
            Our mission is simple: to provide Ugandans with the tools, insights, and opportunities they need to make smart digital and financial decisions. Whether you are calculating the exact MTN MoMo or Airtel Money charges before sending cash, estimating your next loan repayment, or trying to find the best tech reviews, we have you covered.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Our Connection to Kabale Online</h2>
          <p>
            We believe in strengthening local commerce. That is why OkayNotice works hand-in-hand with the Kigezi region's trusted e-commerce marketplace. When we review top gadgets, phones, and laptops, we curate the best, most reliable deals directly from Kabale Online, ensuring that students, farmers, and local vendors have a secure platform to buy and sell.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">What We Offer</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Interactive Tools:</strong> Fast, mobile-friendly calculators for MoMo fees, business profit margins, and loan rates.</li>
            <li><strong>Tech & Finance Blog:</strong> Up-to-date articles on software development, digital trends, and logistics.</li>
            <li><strong>Curated Deals:</strong> Handpicked electronics and gadgets at the best prices.</li>
          </ul>

          <div className="mt-10 pt-8 border-t border-slate-100">
            <p>
              Want to get in touch? <Link href="/contact" className="text-blue-600 hover:underline font-medium">Reach out to us here</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
