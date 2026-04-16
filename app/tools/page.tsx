import Link from "next/link";
import { Metadata } from "next";
import { Calculator, TrendingUp, Landmark, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Financial Tools & Calculators",
  description: "Free financial tools and calculators designed for Ugandan businesses to track MoMo charges, profit margins, and loans.",
};

export default function ToolsPage() {
  const tools = [
    {
      title: "MoMo Charges Calculator",
      description: "Calculate exact MTN MoMo and Airtel Money sending and withdrawal fees before making a transaction to avoid hidden costs.",
      icon: <Calculator size={32} />,
      href: "/tools/momo-charges-calculator",
      colorClass: "bg-blue-50 text-blue-600",
    },
    {
      title: "Profit Margin Calculator",
      description: "Determine your true net profit margins after factoring in product sourcing, transport, and operational costs.",
      icon: <TrendingUp size={32} />,
      href: "/tools/profit-calculator",
      colorClass: "bg-green-50 text-green-600",
    },
    {
      title: "Loan Estimator",
      description: "Quickly calculate monthly repayments and total interest for personal, business, or student loans.",
      icon: <Landmark size={32} />,
      href: "/tools/loan-calculator",
      colorClass: "bg-purple-50 text-purple-600",
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Financial Tools
        </h1>
        <p className="text-lg text-slate-600">
          Smart calculators designed specifically for local businesses and students to track money, calculate fees, and maximize margins.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <Link 
            key={index} 
            href={tool.href}
            className="group flex flex-col bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300"
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-105 ${tool.colorClass}`}>
              {tool.icon}
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
              {tool.title}
            </h2>
            
            <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-grow">
              {tool.description}
            </p>
            
            <div className="flex items-center text-sm font-bold text-slate-900 group-hover:text-blue-600 mt-auto transition-colors">
              Open Tool
              <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
      
    </div>
  );
}
