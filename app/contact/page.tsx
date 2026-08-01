import { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Etomu team for inquiries, partnerships, or support.",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
          Get in Touch
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          Have a question about a tech deal, a suggestion  or want to partner with us? We would love to hear from you.
        </p>
        
        {/* Founder & Kabale Online Banner */}
        <div className="inline-flex flex-col sm:flex-row items-center justify-center bg-white/70 backdrop-blur-md border border-slate-200/60 px-6 py-4 rounded-2xl shadow-sm">
          <span className="text-sm font-medium text-slate-600">
            <strong className="text-blue-700 font-black">Etomu News</strong> is a proud product of <strong className="text-slate-900">Etomu Holdings</strong>
          </span>
          <span className="hidden sm:inline-block mx-3 text-slate-300">|</span>
          <span className="text-sm font-medium text-slate-600 mt-2 sm:mt-0">
            Founded by <strong className="text-slate-900">Ampeire Samuel</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        
        {/* Email Card */}
        <div className="group bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white/60 text-center flex flex-col items-center hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-500 hover:-translate-y-1">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
            <Mail size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Email Us</h3>
          <p className="text-slate-600 font-medium">
            hello@etomu.com
          </p>
        </div>

        {/* Phone Card */}
        <div className="group bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white/60 text-center flex flex-col items-center hover:border-green-300 hover:shadow-xl hover:shadow-green-100/50 transition-all duration-500 hover:-translate-y-1">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
            <Phone size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Call / WhatsApp</h3>
          <div className="text-slate-600 font-medium space-y-1">
            <p className="text-sm text-slate-500">Mon-Fri from 8am to 5pm</p>
            <p className="text-lg text-slate-900 font-bold">+256 759 997 376</p>
          </div>
        </div>

        {/* Office Card */}
        <div className="group bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white/60 text-center flex flex-col items-center hover:border-orange-300 hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-500 hover:-translate-y-1">
          <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
            <MapPin size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Headquarters</h3>
          <p className="text-slate-600 font-medium">
            Etomu Head Offices<br />
            Kabale, Uganda
          </p>
        </div>

      </div>
    </div>
  );
}
