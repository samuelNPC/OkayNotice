"use client";

import { useEffect, useState } from "react";

export default function WelcomeGreeting() {
  const [greeting, setGreeting] = useState("Welcome to OkayNotice");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check local storage to see if they are a returning visitor
    const hasVisited = localStorage.getItem("okaynotice_visited");
    
    if (hasVisited) {
      setGreeting("Welcome back to OkayNotice");
    } else {
      localStorage.setItem("okaynotice_visited", "true");
    }
  }, []);

  // Prevent UI flashing (Hydration Mismatch) by rendering a blank space of the exact same size until checked
  if (!mounted) return <div className="h-24 mb-8 md:mb-10 w-full" />;

  return (
    <div className="mb-8 md:mb-10 text-center md:text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
        {greeting}
        <span className="text-blue-600">.</span>
      </h1>
      <p className="text-lg md:text-xl text-slate-600 max-w-3xl font-medium leading-relaxed">
        Your smartest guide to digital finance, tech deals, and money-saving hacks in Uganda.
      </p>
    </div>
  );
}
