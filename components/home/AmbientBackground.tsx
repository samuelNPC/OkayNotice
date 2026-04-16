"use client";

import { useEffect, useRef } from "react";

export default function AmbientBackground() {
  // We use refs instead of state to prevent React from re-rendering 60 times a second
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  
  const requestRef = useRef<number>();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Accessibility check: Stop animations if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate a slight offset based on mouse position relative to window center
      mouse.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      };
    };

    const animate = () => {
      // Apply transforms directly to the DOM nodes for buttery smooth 60fps performance
      if (orb1Ref.current) {
        orb1Ref.current.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px)`;
      }
      if (orb2Ref.current) {
        orb2Ref.current.style.transform = `translate(${-mouse.current.x * 1.5}px, ${-mouse.current.y * 1.5}px)`;
      }
      if (orb3Ref.current) {
        orb3Ref.current.style.transform = `translate(${mouse.current.x * 0.5}px, ${mouse.current.y * 0.5}px)`;
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    // 'fixed' ensures it stays pinned to the screen while scrolling
    // 'pointer-events-none' ensures it never blocks clicks on your actual content
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-50">
      
      {/* Top Left Orb */}
      <div 
        ref={orb1Ref}
        className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-[100px] animate-pulse"
        style={{ transition: "transform 0.5s ease-out" }}
      />

      {/* Middle Right Orb */}
      <div 
        ref={orb2Ref}
        className="absolute top-[30%] -right-[10%] w-[600px] h-[600px] rounded-full bg-indigo-400/10 blur-[120px]"
        style={{ transition: "transform 0.7s ease-out" }}
      />

      {/* Bottom Center Orb */}
      <div 
        ref={orb3Ref}
        className="absolute -bottom-[20%] left-[20%] w-[700px] h-[700px] rounded-full bg-blue-500/10 blur-[150px] animate-pulse"
        style={{ transition: "transform 0.6s ease-out", animationDuration: "4s" }}
      />
      
      {/* The Glass Overlay */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]" />
    </div>
  );
}
