"use client";

import { LayoutGrid } from "lucide-react";

export default function MoreButton() {
  const handleClick = () => {
    if (typeof window !== "undefined") {
      document.querySelector<HTMLButtonElement>('button[aria-label="Toggle Menu"]')?.click();
    }
  };

  return (
    <button 
      onClick={handleClick}
      className="flex w-full items-center justify-center space-x-3 bg-white border border-slate-100 shadow-sm py-4 rounded-2xl hover:border-blue-200 transition"
    >
      <LayoutGrid size={20} className="text-blue-500" />
      <span className="font-bold text-slate-800">More</span>
    </button>
  );
}
