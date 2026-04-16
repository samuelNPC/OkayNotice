"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface Post {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  excerpt?: string; // Added excerpt to the interface
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
    }, 4000); 

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-slate-800">Featured</h2>
        <div className="hidden md:flex space-x-2">
          <button onClick={() => scroll("left")} className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-full text-slate-600 transition shadow-sm">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scroll("right")} className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-full text-slate-600 transition shadow-sm">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-5 snap-x snap-mandatory scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {posts.map((post) => (
          <Link 
            key={post.id} 
            href={`/blog/${post.slug}`}
            className="group shrink-0 w-[280px] md:w-[340px] snap-start bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col transition-all duration-300 hover:border-blue-300 hover:shadow-md"
          >
            {/* Image Container with Zoom-Out Effect */}
            <div className="h-48 w-full overflow-hidden bg-slate-100">
              <img 
                src={post.coverImage || "/api/placeholder/400/300"} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-500 scale-110 group-hover:scale-100"
              />
            </div>

            <div className="p-5 flex flex-col flex-grow">
              {/* Title: Blue by default, Black on hover */}
              <h3 className="font-black text-blue-600 group-hover:text-slate-900 text-lg leading-snug line-clamp-2 mb-2 transition-colors duration-300">
                {post.title}
              </h3>

              {/* 2-Line Excerpt */}
              <p className="text-sm text-slate-500 line-clamp-2 mb-6">
                {post.excerpt || "Read more about this topic and discover insights tailored for you."}
              </p>

              {/* Read Full Article Button (Pushed to bottom using mt-auto) */}
              <div className="mt-auto">
                <span className="inline-flex items-center justify-center font-bold text-xs uppercase tracking-wider text-blue-700 bg-blue-50 px-4 py-2.5 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 w-full sm:w-auto">
                  Read Full Article 
                  <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
