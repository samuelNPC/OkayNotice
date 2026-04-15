"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

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
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            <Link href="/" className="text-2xl font-black tracking-tight relative z-50">
              <span className="text-slate-900">Okay</span>
              <span className="text-blue-600">Notice</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-slate-600 hover:text-blue-600 font-medium transition"
                >
                  {link.name}
                </Link>
              ))}

              {user && (
                <Link 
                  href="/admin"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm"
                >
                  Dashboard
                </Link>
              )}
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
      </header>

      {/* Gray Overlay with Blur */}
      <div 
        className={`fixed inset-0 top-16 bg-gray-600/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 40 }}
        onClick={() => setIsOpen(false)}
      />

      {/* Solid White Mobile Nav Drawer */}
      <div 
        className={`fixed top-16 right-0 h-[calc(100vh-64px)] w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col pt-8 px-6 border-l border-slate-200 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 45 }}
      >
        <div className="flex flex-col space-y-3 overflow-y-auto pb-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-lg font-semibold text-slate-800 hover:text-blue-600 px-4 py-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 hover:shadow-sm transition-all"
            >
              {link.name}
            </Link>
          ))}

          {user && (
            <div className="pt-4 mt-2 border-t border-slate-200">
              <Link 
                href="/admin" 
                className="block text-center text-lg font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-3 rounded-xl shadow-sm transition-all"
              >
                Admin Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
