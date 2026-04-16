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
  authorImage?: string;
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

  // We use a generic Cloudinary placeholder until your profile page is built
  const defaultAvatar = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";

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
            className="shrink-0 w-[280px] md:w-[340px] snap-start bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col hover:border-blue-300 transition-colors"
          >
            <div className="h-48 w-full overflow-hidden">
              <img 
                src={post.coverImage || "/api/placeholder/400/300"} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="font-bold text-slate-900 text-lg leading-snug line-clamp-2 mb-4">{post.title}</h3>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                    <img 
                      src={post.authorImage || defaultAvatar} 
                      alt="Author" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <span className="text-sm text-slate-600 font-medium">{post.author || "OkayNotice"}</span>
                </div>
                <Bookmark size={18} className="text-slate-400 hover:text-blue-600 transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
