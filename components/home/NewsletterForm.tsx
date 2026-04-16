"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      await addDoc(collection(db, "subscribers"), {
        email,
        subscribedAt: serverTimestamp(),
      });
      setStatus("success");
      setEmail("");
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm my-8 md:my-12 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
      
      {/* Left Side: Text */}
      <div className="text-center lg:text-left flex-1 max-w-xl w-full">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mb-2 md:mb-3">
          Subscribe to our newsletter
        </h3>
        <p className="text-slate-500 text-sm sm:text-base md:text-lg">
          Get the latest tech deals and guides delivered directly to your inbox.
        </p>
      </div>
      
      {/* Right Side: Form */}
      <div className="w-full lg:w-auto flex-1 max-w-md shrink-0">
        {status === "success" ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl font-bold text-center text-sm md:text-base">
            Thank you for subscribing!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow w-full px-4 py-3.5 md:px-5 md:py-4 rounded-xl md:rounded-2xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm text-base"
            />
            <button 
              type="submit" 
              disabled={status === "loading"}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 md:py-4 px-6 md:px-8 rounded-xl md:rounded-2xl transition shadow-sm whitespace-nowrap text-base"
            >
              {status === "loading" ? "Saving..." : "Subscribe"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="text-red-500 text-xs sm:text-sm mt-3 text-center lg:text-left">
            Failed to subscribe. Please try again.
          </p>
        )}
      </div>

    </div>
  );
}
