import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy and Terms of Service for OkayNotice.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-slate-600 text-sm md:text-base leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">1. Introduction</h2>
          <p>
            Welcome to Etomu News. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we handle your data when you visit our website.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">2. Information We Collect</h2>
          <p>
            <strong>Interactive Tools:</strong> When you use our calculators (like the MoMo Charges or Loan Calculator), all data processing happens locally on your device. We do not store or track the financial numbers you input.
          </p>
          <p>
            <strong>Automatically Collected Data:</strong> We may use analytics tools that collect standard internet log information and details of visitor behavior patterns (e.g., IP addresses, browser types).
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">3. Google AdSense and Cookies</h2>
          <p>
            We use Google AdSense to display advertisements on our website. 
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
            <li>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Ads Settings</a>.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">4. External Links</h2>
          <p>
            Our website contains links to external sites, primarily Etomu for product deals. We are not responsible for the privacy practices or the content of such Web sites.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us via our <a href="/contact" className="text-blue-600 hover:underline">Contact Page</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
