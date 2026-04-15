import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="text-slate-500 text-sm">
          &copy; {currentYear} Uganda Finance & Tech Hub. All rights reserved.
        </p>
        <div className="flex space-x-6 text-sm text-slate-500">
          <Link href="/about" className="hover:text-blue-600">About</Link>
          <Link href="/contact" className="hover:text-blue-600">Contact</Link>
          <Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
