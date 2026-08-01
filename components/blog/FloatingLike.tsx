"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export default function FloatingLike({ postId, initialLikes = 0 }: { postId: string, initialLikes?: number }) {
  const [likes, setLikes] = useState(initialLikes);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);

  const handleVote = async (type: "up" | "down") => {
    if (voted === type) return; // Prevent double voting the same way

    // 1. Optimistic UI Update (Makes the button feel instantly responsive)
    if (type === "up") {
      setLikes((prev) => prev + 1);
      setVoted("up");
    } else {
      setLikes((prev) => (prev > 0 ? prev - 1 : 0));
      setVoted("down");
    }

    // 2. Background Database Update
    try {
      await fetch(`https://api.etomu.com/api/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: type }),
      });
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50">
      <div className="bg-blue-500 text-white rounded-2xl shadow-lg flex items-center overflow-hidden border border-blue-400/50 backdrop-blur-md">
        <button 
          onClick={() => handleVote("up")} 
          className={`flex items-center justify-center p-3 sm:px-4 sm:py-3 hover:bg-blue-600 transition-colors ${voted === "up" ? "bg-blue-600" : ""}`}
        >
          <ThumbsUp size={18} className={voted === "up" ? "fill-current" : ""} />
          <span className="ml-2 font-bold text-sm">{likes > 0 ? likes : "Like"}</span>
        </button>
        <div className="w-[1px] h-6 bg-blue-400/50"></div>
        <button 
          onClick={() => handleVote("down")} 
          className={`p-3 sm:px-4 sm:py-3 hover:bg-blue-600 transition-colors ${voted === "down" ? "bg-blue-600" : ""}`}
        >
          <ThumbsDown size={18} className={voted === "down" ? "fill-current" : ""} />
        </button>
      </div>
    </div>
  );
}
