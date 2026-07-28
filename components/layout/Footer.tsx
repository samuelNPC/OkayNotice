import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/90 backdrop-blur-md border-t border-slate-200/60 mt-auto relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-10">
        
        {/* Get in Touch Section */}
        <div className="mb-8">
          <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Get in Touch</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-slate-600 font-medium">
            <li className="flex items-start">
              <Phone size={18} className="text-green-600 mr-3 mt-0.5 shrink-0" />
              <span>+256 759 997 376</span>
            </li>
            <li className="flex items-start">
              <Mail size={18} className="text-blue-600 mr-3 mt-0.5 shrink-0" />
              <a href="mailto:info@okaynotice.com" className="hover:text-blue-600 transition-colors">
                hello@etomu.com
              </a>
            </li>
            <li className="flex items-start">
              <MapPin size={18} className="text-orange-600 mr-3 mt-0.5 shrink-0" />
              <span>Kabale University Area, Kabale, Uganda</span>
            </li>
          </ul>
        </div>

        {/* Copyright Section */}
        <div className="pt-6 border-t border-slate-200/60 text-sm font-medium text-slate-500 text-center">
          <p>&copy; {currentYear} Etomu News. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
