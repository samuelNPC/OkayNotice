"use client";

import { useEffect, useState } from "react";

// The topics with their assigned colors (Black, Yellow, Red cycle)
const TOPICS = [
  { text: "Digital finance.", color: "text-black" },
  { text: "Money saving hacks.", color: "text-yellow-500" },
  { text: "Tech hacks.", color: "text-red-600" },
  { text: "Tech deals.", color: "text-black" },
  { text: "Finance & Taxes.", color: "text-yellow-500" },
  { text: "Banking knowledge.", color: "text-red-600" },
  { text: "Online payments.", color: "text-black" },
];

export default function WelcomeGreeting() {
  const [isReturning, setIsReturning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [topicIndex, setTopicIndex] = useState(0);

  // 1. Check local storage for returning visitors
  useEffect(() => {
    setMounted(true);
    const hasVisited = localStorage.getItem("okaynotice_visited");

    if (hasVisited) {
      setIsReturning(true);
    } else {
      localStorage.setItem("okaynotice_visited", "true");
    }
  }, []);

  // 2. Run the drop-in animation cycle
  useEffect(() => {
    if (!mounted) return;
    
    const interval = setInterval(() => {
      setTopicIndex((prev) => (prev + 1) % TOPICS.length);
    }, 2500); // Changes topic every 2.5 seconds

    return () => clearInterval(interval);
  }, [mounted]);

  // Prevent UI flashing during hydration
  if (!mounted) return <div className="h-24 mb-10 w-full" />;

  return (
    <div className="mb-12 md:mb-16 text-center md:text-left flex flex-col items-center md:items-start">
      
      {/* Pure Black, Static Greeting */}
      <h1 className="text-4xl md:text-6xl font-black text-black tracking-tight mb-2">
        {isReturning ? "Welcome back." : "Welcome."}
      </h1>

      {/* The Animated Subtitle */}
      <div className="text-xl md:text-3xl font-bold text-slate-500 flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-2 md:gap-3 overflow-hidden h-[80px] md:h-[48px]">
        
        <span>Get detailed guides to</span>
        
        {/* Animated Drop-In Container */}
        <div className="relative h-10 md:h-full w-[280px] md:w-[350px]">
          {TOPICS.map((topic, index) => {
            // Logic to create a continuous "dropping down" effect
            let positionClass = "-translate-y-full opacity-0"; // Waiting above
            
            if (index === topicIndex) {
              positionClass = "translate-y-0 opacity-100"; // Active (Center)
            } else if (index === (topicIndex - 1 + TOPICS.length) % TOPICS.length) {
              positionClass = "translate-y-full opacity-0"; // Just left (Dropped below)
            }

            return (
              <div
                key={topic.text}
                className={`absolute inset-0 flex items-center justify-center md:justify-start transition-all duration-500 ease-out ${positionClass}`}
              >
                <span className={`${topic.color} font-black drop-shadow-sm`}>
                  {topic.text}
                </span>
              </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}
