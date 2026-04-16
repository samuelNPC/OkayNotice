"use client";

import { Share2, Bookmark } from "lucide-react";
import { useState } from "react";

export default function ShareButtons({ title }: { title: string }) {
  const [bookmarked, setBookmarked] = useState(false);

  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button onClick={handleShare} className="text-slate-500 hover:text-slate-900 transition-colors">
        <Share2 size={20} />
      </button>
      <button onClick={() => setBookmarked(!bookmarked)} className={`${bookmarked ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'} transition-colors`}>
        <Bookmark size={20} className={bookmarked ? "fill-current" : ""} />
      </button>
    </div>
  );
}
