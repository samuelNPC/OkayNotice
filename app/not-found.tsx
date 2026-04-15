"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Update the countdown number every second
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Redirect to the homepage after 3 seconds
    const redirect = setTimeout(() => {
      router.push("/");
    }, 3000);

    // Cleanup the timers if the user clicks the manual link before the countdown ends
    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mb-6">
        <AlertCircle size={32} />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
        Page Not Found
      </h1>
      
      <p className="text-lg text-slate-600 mb-8 max-w-md">
        The link you followed may be broken, or the page may have been removed. 
        Redirecting to the homepage in <span className="font-bold text-blue-600">{countdown}</span> seconds.
      </p>
      
      <Link 
        href="/"
        className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-lg transition shadow-sm"
      >
        Return to Homepage Now
      </Link>
    </div>
  );
}
