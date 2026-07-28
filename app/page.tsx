import Link from "next/link";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import NewsletterForm from "@/components/home/NewsletterForm";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";
import MoreButton from "@/components/home/MoreButton";
import { FileText, Wrench, ShoppingBag, AlertCircle, Bookmark, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

const serializeDoc = (doc: any) => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
  };
};

const formatDate = (isoString: string | null) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Helper function to extract and count tags from all posts
const getPopularTags = (posts: any[]) => {
  const tagCounts: Record<string, number> = {};

  posts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach((tag: string) => {
        const cleanTag = tag.trim();
        if (cleanTag) {
          tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1;
        }
      });
    }
  });

  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));
};

export default async function HomePage() {
  try {
    const postsRef = collection(db, "posts");

    const allRecentQuery = query(postsRef, orderBy("createdAt", "desc"), limit(50));
    const allRecentSnapshot = await getDocs(allRecentQuery);
    const allRecentPosts = allRecentSnapshot.docs.map(serializeDoc);

    const latestPosts = allRecentPosts.slice(0, 9);
    const popularTags = getPopularTags(allRecentPosts);

    const featuredQuery = query(postsRef, where("isFeatured", "==", true), limit(6));
    const featuredSnapshot = await getDocs(featuredQuery);
    const featuredPosts = featuredSnapshot.docs.map(serializeDoc);

    const displayFeatured = featuredPosts.length > 0 ? featuredPosts : latestPosts.slice(0, 6);

    const defaultAvatar = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";

    return (
      <div className="w-full min-h-screen text-slate-900 pb-20 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 md:pt-8">

          

          {/* 1. FEATURED STORIES */}
          <section className="md:hidden">
            <FeaturedCarousel posts={displayFeatured} />
          </section>

          <section className="hidden md:block">
            <h2 className="text-2xl font-black text-slate-800 mb-6">Featured Stories</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {displayFeatured.map((post) => (
                <Link 
                  key={post.id} 
                  href={`/blog/${post.slug}`}
                  className="group bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl overflow-hidden flex flex-col hover:border-blue-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="h-48 w-full overflow-hidden relative">
                    {post.category && (
                      <span className="absolute top-4 left-4 z-10 bg-blue-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider shadow-sm rounded-sm">
                        {post.category}
                      </span>
                    )}
                    <img 
                      src={post.coverImage || "/api/placeholder/400/300"} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-slate-900 text-lg leading-snug line-clamp-2 mb-4 group-hover:text-blue-700 transition-colors">{post.title}</h3>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-200 overflow-hidden border border-slate-200 rounded-full">
                          <img 
                            src={post.authorImage || defaultAvatar} 
                            alt="Author" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-900 font-bold">{post.author || "EtomuNews"}</span>
                          <span className="text-xs text-slate-500 font-medium">
                            {formatDate(post.createdAt)} {post.readTime && `• ${post.readTime}`}
                          </span>
                        </div>
                      </div>
                      <Bookmark size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <hr className="border-slate-200/50 my-10" />

          {/* 2. DYNAMIC TOPICS / TAGS CLOUD */}
          {popularTags.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center mb-6">
                <Tag size={24} className="text-blue-600 mr-2" />
                <h2 className="text-2xl font-black text-slate-800">Popular Topics</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {popularTags.map((tag) => (
                  <Link 
                    key={tag.name} 
                    href={`/blog?tag=${encodeURIComponent(tag.name)}`}
                    className="flex items-center bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-full px-4 py-2 hover:bg-blue-50 hover:border-blue-300 transition-colors group shadow-sm"
                  >
                    <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700">
                      #{tag.name}
                    </span>
                    <span className="ml-2 bg-slate-200/80 text-slate-700 text-[10px] font-black px-2 py-0.5 rounded-full group-hover:bg-blue-200 group-hover:text-blue-800">
                      {tag.count}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <hr className="border-slate-200/50 my-10" />

          

          <hr className="border-slate-200/50 my-10" />

          {/* 4. LATEST ARTICLES */}
          <section>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-6">Latest Articles</h2>

            {/* Mobile Latest Articles */}
            <div className="md:hidden space-y-2">
              {latestPosts.map((post, index) => (
                <div key={post.id} className="bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl overflow-hidden shadow-sm">
                  <Link href={`/blog/${post.slug}`} className="flex gap-4 items-center group p-3">
                    <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-slate-100">
                      <img 
                        src={post.coverImage || "/api/placeholder/150/150"} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                      />
                    </div>
                    <div className="flex flex-col w-full py-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        {post.category && (
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50/80 px-2 py-0.5 rounded-sm">
                            {post.category}
                          </span>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <span className="text-[10px] text-slate-400 font-medium">#{post.tags[0]}</span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors mb-1 line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="mt-auto text-[11px] text-slate-400 font-medium flex items-center">
                        <span>{formatDate(post.createdAt)}</span>
                        {post.readTime && <span className="mx-1.5">•</span>}
                        {post.readTime && <span>{post.readTime}</span>}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
              <div className="pt-4 mt-2">
                <Link 
                  href="/blog" 
                  className="flex items-center justify-center w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-lg transition-transform active:scale-95"
                >
                  View All Blogs &rarr;
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading homepage data:", error);
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-slate-800">
        <p>Something went wrong loading the homepage.</p>
      </div>
    );
  }
                  }
