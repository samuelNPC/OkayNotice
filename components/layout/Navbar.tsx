"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Custom Translation Hook pulling Clerk data
  const { user, loading } = useAuth();

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
    { name: "Write", href: "/write" },
    { name: "About", href: "/about" },
    { name: "Privacy", href: "/privacy" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* 1. Text Logo */}
            <Link href="/" className="text-2xl font-black tracking-tight relative z-50">
              <span className="text-slate-900">Etomu </span>
              <span className="text-blue-600">News</span>
            </Link>

            {/* 2. Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-slate-600 hover:text-blue-600 font-medium transition"
                >
                  {link.name}
                </Link>
              ))}

              {/* Desktop Auth-dependent Button */}
              {!loading && (
                <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                  {user ? (
                    user.role === "admin" ? (
                      <Link 
                        href="/admin"
                        className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-lg font-bold transition shadow-sm text-sm"
                      >
                        Admin Portal
                      </Link>
                    ) : (
                      <Link 
                        href="/dashboard"
                        className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-lg font-bold transition shadow-sm text-sm"
                      >
                        Dashboard
                      </Link>
                    )
                  ) : (
                    <Link 
                      href="/login"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold transition shadow-sm text-sm"
                    >
                      Login
                    </Link>
                  )}
                </div>
              )}
            </nav>

            {/* 3. Mobile Right Side (Auth Button + Hamburger) */}
            <div className="flex items-center gap-3 md:hidden relative z-50">

              {!loading && (
                user ? (
                  user.role === "admin" ? (
                    <Link 
                      href="/admin"
                      className="bg-amber-600 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-sm"
                    >
                      Admin
                    </Link>
                  ) : (
                    <Link 
                      href="/dashboard"
                      className="bg-slate-900 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-sm"
                    >
                      Dashboard
                    </Link>
                  )
                ) : (
                  <Link 
                    href="/login"
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-sm"
                  >
                    Login
                  </Link>
                )
              )}

              {/* Hamburger Button */}
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-10 h-10 flex flex-col justify-center items-center group focus:outline-none"
                aria-label="Toggle Menu"
              >
                <span className={`block w-6 h-[2px] bg-slate-900 rounded-full transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-[6px]' : '-translate-y-1.5'}`} />
                <span className={`block w-6 h-[2px] bg-slate-900 rounded-full transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`block w-6 h-[2px] bg-slate-900 rounded-full transition-transform duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-[6px]' : 'translate-y-1.5'}`} />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Gray Overlay with Blur */}
      <div 
        className={`fixed inset-0 top-16 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
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
        <div className="flex flex-col space-y-2 overflow-y-auto pb-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-lg font-semibold text-slate-800 hover:text-blue-600 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all"
            >
              {link.name}
            </Link>
          ))}

          {/* Drawer Auth Button */}
          {!loading && (
            <div className="pt-6 mt-4 border-t border-slate-100">
              {user ? (
                user.role === "admin" ? (
                  <Link 
                    href="/admin" 
                    className="block text-center text-lg font-bold text-white bg-amber-600 hover:bg-amber-700 px-4 py-3 rounded-xl shadow-sm transition-all"
                  >
                    Admin Portal
                  </Link>
                ) : (
                  <Link 
                    href="/dashboard" 
                    className="block text-center text-lg font-bold text-white bg-slate-900 hover:bg-slate-800 px-4 py-3 rounded-xl shadow-sm transition-all"
                  >
                    Dashboard
                  </Link>
                )
              ) : (
                <Link 
                  href="/login" 
                  className="block text-center text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-xl shadow-sm transition-all"
                >
                  Login / Sign In
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
