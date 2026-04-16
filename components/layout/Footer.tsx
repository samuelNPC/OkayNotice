import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/90 backdrop-blur-md border-t border-slate-200/60 mt-auto relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        
        {/* Top Section: Grid Layout (Desktop Adaptive) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand & About */}
          <div className="lg:col-span-1 flex flex-col">
            <Link href="/" className="text-2xl font-black text-slate-900 tracking-tight mb-4">
              OkayNotice<span className="text-blue-600">.</span>
            </Link>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Your smartest guide to digital finance, tech deals, and money-saving hacks in Uganda. We help you navigate the digital economy with confidence.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Explore</h3>
            <ul className="space-y-3 text-sm text-slate-600 font-medium">
              <li><Link href="/blog" className="hover:text-blue-600 transition-colors">Tech Blog</Link></li>
              <li><Link href="/tools" className="hover:text-blue-600 transition-colors">Calculators</Link></li>
              <li><Link href="/deals" className="hover:text-blue-600 transition-colors">Hand Picked Deals</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Company</h3>
            <ul className="space-y-3 text-sm text-slate-600 font-medium">
              <li><Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Details */}
          <div>
            <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Get in Touch</h3>
            <ul className="space-y-4 text-sm text-slate-600 font-medium">
              <li className="flex items-start">
                <Phone size={18} className="text-green-600 mr-3 mt-0.5 shrink-0" />
                <span>+256 759 997 376</span>
              </li>
              <li className="flex items-start">
                <Mail size={18} className="text-blue-600 mr-3 mt-0.5 shrink-0" />
                <a href="mailto:info@okaynotice.com" className="hover:text-blue-600 transition-colors">
                  info@okaynotice.com
                </a>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="text-orange-600 mr-3 mt-0.5 shrink-0" />
                <span>
                  Kabale University Area<br />
                  Kabale, Uganda
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Brand Lineage & Logos Section */}
        <div className="pt-8 border-t border-slate-200/80 flex flex-col space-y-8">
          
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* The Logos & Links */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              
              {/* OkayNotice Logo & Link */}
              <a href="https://okaynotice.com" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-white rounded-xl overflow-hidden border border-blue-100 flex items-center justify-center shrink-0">
                  <img src="/512.png" alt="OkayNotice Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  okaynotice.com
                </span>
              </a>

              <span className="hidden sm:block text-slate-300">|</span>

              {/* Kabale Online Logo & Link */}
              <a href="https://www.kabaleonline.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-white rounded-xl overflow-hidden border border-orange-100 flex items-center justify-center shrink-0">
                  <img src="/kabaleonline.png" alt="Kabale Online Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <span className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                  www.kabaleonline.com
                </span>
              </a>
            </div>

            {/* Company Relationship */}
            <div className="text-sm font-medium text-slate-500 text-center lg:text-right bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
              OkayNotice is a proud company under <a href="https://www.kabaleonline.com" target="_blank" rel="noopener noreferrer" className="text-slate-800 font-bold hover:text-orange-600 transition-colors">Kabale Online</a>.
            </div>
          </div>

          {/* Copyright & Founder */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm font-medium text-slate-500 pt-6 border-t border-slate-100/60">
            <p>&copy; {currentYear} OkayNotice. All rights reserved.</p>
            
          </div>

        </div>

      </div>
    </footer>
  );
}
