"use client";

import { useEffect, useState } from "react";

export default function AmbientBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse movement to shift the glowing orbs slightly
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate a slight offset based on mouse position relative to window center
      const x = (e.clientX / window.innerWidth - 0.5) * 40; 
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* The Glowing Orbs 
        They use CSS animations for slow pulsing/moving, and inline styles 
        to react to the user's mouse position. 
      */}
      
      {/* Top Left Orb */}
      <div 
        className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-[100px] animate-pulse"
        style={{ 
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: "transform 0.5s ease-out" 
        }}
      />

      {/* Middle Right Orb */}
      <div 
        className="absolute top-[30%] -right-[10%] w-[600px] h-[600px] rounded-full bg-indigo-400/10 blur-[120px]"
        style={{ 
          transform: `translate(${-mousePosition.x * 1.5}px, ${-mousePosition.y * 1.5}px)`,
          transition: "transform 0.7s ease-out" 
        }}
      />

      {/* Bottom Center Orb */}
      <div 
        className="absolute -bottom-[20%] left-[20%] w-[700px] h-[700px] rounded-full bg-blue-500/10 blur-[150px] animate-pulse"
        style={{ 
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
          transition: "transform 0.6s ease-out",
          animationDuration: "4s"
        }}
      />
      
      {/* The Glass Overlay
        This sits on top of the orbs but behind your content,
        giving everything that slight frosted glass texture.
      */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]" />
    </div>
  );
}
