"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Bookmark } from "lucide-react";

interface Post {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  author?: string;
  createdAt?: any;
}

export default function FeaturedCarousel({ posts }: { posts: Post[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (posts.length === 0) return null;

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900">Featured</h2>
        <div className="hidden md:flex space-x-2">
          <button onClick={() => scroll("left")} className="p-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scroll("right")} className="p-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {posts.map((post) => (
          <Link 
            key={post.id} 
            href={`/blog/${post.slug}`}
            className="shrink-0 w-[280px] md:w-[320px] snap-start bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col"
          >
            <div className="h-40 w-full overflow-hidden">
              <img 
                src={post.coverImage || "/api/placeholder/400/300"} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-bold text-slate-900 leading-snug line-clamp-2 mb-4">{post.title}</h3>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                    <img src="/logo.png" alt="Author" className="w-full h-full object-cover opacity-50" />
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{post.author || "OkayNotice"}</span>
                </div>
                <Bookmark size={16} className="text-slate-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
