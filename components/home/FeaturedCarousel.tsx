"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface Post {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  category?: string;
  excerpt?: string;
  createdAt?: any;
}

export default function FeaturedCarousel({ posts }: { posts: Post[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic (Only affects mobile view where ref is active)
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

  // The first post is our "Hero", the next 4 are the "Sidekick" posts
  const heroPost = posts[0];
  const sidekickPosts = posts.slice(1, 5); 

  return (
    <div className="relative w-full mb-12">
      
      {/* ------------------------------------------------------------------
          MOBILE VIEW: The Original Swiping Carousel 
          ------------------------------------------------------------------ */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4 px-1">
          
        </div>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide pb-4 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {posts.map((post) => (
            <Link 
              key={post.id} 
              href={`/blog/${post.slug}`}
              className="group shrink-0 w-[280px] snap-start bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm border border-slate-200/60 flex flex-col transition-all duration-300"
            >
              <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
                {post.category && (
                  <span className="absolute top-3 left-3 z-10 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm">
                    {post.category}
                  </span>
                )}
                <img 
                  src={post.coverImage || "/api/placeholder/400/300"} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 scale-105 group-hover:scale-100"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-black text-slate-900 group-hover:text-blue-600 text-lg leading-snug line-clamp-2 mb-2 transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                  {post.excerpt || "Read more about this topic and discover insights tailored for you."}
                </p>
                <div className="mt-auto">
                  <span className="inline-flex items-center text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Read Article <ArrowRight size={14} className="ml-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------
          DESKTOP VIEW: The Magazine "Bento Box" Layout
          ------------------------------------------------------------------ */}
      <div className="hidden md:block">
        
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[500px]">
          
          {/* Main Hero Card (Spans 8 columns) */}
          <Link 
            href={`/blog/${heroPost.slug}`}
            className="group lg:col-span-8 relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-end"
          >
            {/* Background Image */}
            <img 
              src={heroPost.coverImage || "/api/placeholder/800/500"} 
              alt={heroPost.title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            
            {/* Hero Content */}
            <div className="relative z-10 p-10 w-full lg:w-4/5">
              {heroPost.category && (
                <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 mb-4 uppercase tracking-wider rounded-sm">
                  {heroPost.category}
                </span>
              )}
              <h3 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-4 group-hover:text-blue-300 transition-colors">
                {heroPost.title}
              </h3>
              <p className="text-slate-200 text-lg line-clamp-2 mb-6">
                {heroPost.excerpt || "Dive into our top story for the latest insights and detailed breakdowns."}
              </p>
              <span className="inline-flex items-center font-bold text-sm uppercase tracking-wider text-white bg-white/20 hover:bg-blue-600 backdrop-blur-md px-5 py-3 rounded-xl transition-all duration-300">
                Read Full Article <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          {/* Sidekick Cards (Span 4 columns, stacked 2x2) */}
          <div className="lg:col-span-4 grid grid-rows-4 gap-4 h-full">
            {sidekickPosts.map((post) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.slug}`}
                className="group bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl overflow-hidden flex items-center p-3 hover:border-blue-300 hover:shadow-md transition-all duration-300"
              >
                <div className="h-20 w-24 shrink-0 rounded-xl overflow-hidden relative">
                  <img 
                    src={post.coverImage || "/api/placeholder/150/150"} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="ml-4 flex flex-col justify-center h-full">
                  {post.category && (
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                      {post.category}
                    </span>
                  )}
                  <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
                    {post.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}
