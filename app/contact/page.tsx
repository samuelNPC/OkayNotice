import { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the OkayNotice team for inquiries, partnerships, or support.",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Get in Touch</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Have a question about a tech deal, a suggestion for a new calculator tool, or want to partner with us? We would love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Mail size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Email Us</h3>
          <p className="text-slate-600 text-sm">
            hello@okaynotice.com<br />
            support@okaynotice.com
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
            <Phone size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Call / WhatsApp</h3>
          <p className="text-slate-600 text-sm">
            Mon-Fri from 8am to 5pm.<br />
            +256 700 000 000
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-4">
            <MapPin size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Office</h3>
          <p className="text-slate-600 text-sm">
            Kabale University Area<br />
            Kabale, Uganda
          </p>
        </div>
      </div>
    </div>
  );
}
