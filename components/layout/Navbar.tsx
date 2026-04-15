"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "Tools", href: "/tools" },
    { name: "Deals", href: "/deals" },
    { name: "About", href: "/about" },
    { name: "Privacy", href: "/privacy" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <Link href="/" className="text-2xl font-black tracking-tight relative z-50">
            <span className="text-slate-900">Okay</span>
            <span className="text-blue-600">Notice</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-slate-600 hover:text-blue-600 font-medium transition"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden relative z-50 w-10 h-10 flex flex-col justify-center items-center group focus:outline-none"
            aria-label="Toggle Menu"
          >
            <span className={`block w-6 h-[2px] bg-slate-900 rounded-full transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-[6px]' : '-translate-y-1.5'}`} />
            <span className={`block w-6 h-[2px] bg-slate-900 rounded-full transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`block w-6 h-[2px] bg-slate-900 rounded-full transition-transform duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-[6px]' : 'translate-y-1.5'}`} />
          </button>
        </div>
      </div>

      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 40 }}
        onClick={() => setIsOpen(false)}
      />

      <div 
        className={`fixed top-0 right-0 h-full w-[280px] bg-slate-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col pt-24 px-6 border-l border-slate-200 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 45 }}
      >
        <div className="flex flex-col space-y-3">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-lg font-semibold text-slate-800 hover:text-blue-600 px-4 py-3 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm transition-all"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
