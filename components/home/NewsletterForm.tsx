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
    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 text-center max-w-2xl mx-auto my-12">
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Subscribe to our newsletter</h3>
      <p className="text-slate-500 mb-6 text-sm">Get the latest tech deals and guides delivered directly to your inbox.</p>
      
      {status === "success" ? (
        <div className="bg-green-100 text-green-700 p-4 rounded-xl font-medium">
          Thank you for subscribing!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-grow px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button 
            type="submit" 
            disabled={status === "loading"}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-xl transition"
          >
            {status === "loading" ? "Saving..." : "Subscribe"}
          </button>
        </form>
      )}
      {status === "error" && <p className="text-red-500 text-xs mt-2">Failed to subscribe. Please try again.</p>}
    </div>
  );
}
