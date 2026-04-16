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

    const dealsRef = collection(db, "deals");
    const dealsQuery = query(dealsRef, orderBy("createdAt", "desc"), limit(4));
    const dealsSnapshot = await getDocs(dealsQuery);
    const deals = dealsSnapshot.docs.map(serializeDoc);

    const defaultAvatar = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";

    return (
      <div className="w-full min-h-screen text-slate-900 pb-20 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 md:pt-10">

          {/* Mobile Hero - App Style Glass Cards */}
          <section className="mb-10 md:hidden flex flex-col items-center text-center">
            <h1 className="text-3xl font-black text-slate-900 mb-8 tracking-tight leading-tight">
              What are you <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                Interested in Today?
              </span>
            </h1>
            <div className="grid grid-cols-2 gap-4 w-full">
              <Link href="/blog" className="group relative flex flex-col items-center justify-center bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl py-6 overflow-hidden transition-all active:scale-95 shadow-sm hover:shadow-md hover:border-orange-300">
                <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-3 group-hover:-translate-y-1 transition-transform">
                    <FileText size={24} />
                  </div>
                  <span className="font-bold text-slate-800">Blog</span>
                </div>
              </Link>

              <Link href="/tools" className="group relative flex flex-col items-center justify-center bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl py-6 overflow-hidden transition-all active:scale-95 shadow-sm hover:shadow-md hover:border-pink-300">
                <div className="absolute inset-0 bg-gradient-to-b from-pink-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mb-3 group-hover:-translate-y-1 transition-transform">
                    <Wrench size={24} />
                  </div>
                  <span className="font-bold text-slate-800">Tools</span>
                </div>
              </Link>

              <Link href="/deals" className="group relative flex flex-col items-center justify-center bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl py-6 overflow-hidden transition-all active:scale-95 shadow-sm hover:shadow-md hover:border-green-300">
                <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-3 group-hover:-translate-y-1 transition-transform">
                    <ShoppingBag size={24} />
                  </div>
                  <span className="font-bold text-slate-800">Deals</span>
                </div>
              </Link>

              <div className="group relative flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-md border border-white/60 rounded-2xl py-6 overflow-hidden transition-all active:scale-95 shadow-sm hover:shadow-md hover:border-slate-300">
                 <MoreButton />
              </div>
            </div>
          </section>

          {/* Desktop Hero - Bento Box Animated Glass Layout */}
          <section className="hidden md:flex mb-16 flex-col items-center text-center w-full">
            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight mb-12">
              What are you <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                Interested in Today?
              </span>
            </h1>

            <div className="grid grid-cols-3 gap-6 w-full">
              {/* Blog Card */}
              <Link href="/blog" className="group relative bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-8 hover:border-orange-300 hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col items-center justify-center text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <FileText size={40} />
                  </div>
                  <h3 className="font-black text-2xl text-slate-900">Blog</h3>
                </div>
              </Link>

              {/* Tools Card */}
              <Link href="/tools" className="group relative bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-8 hover:border-pink-300 hover:shadow-2xl hover:shadow-pink-100/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col items-center justify-center text-center mt-4 lg:mt-8">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                    <Wrench size={40} />
                  </div>
                  <h3 className="font-black text-2xl text-slate-900">Tools</h3>
                </div>
              </Link>

              {/* Deals Card */}
              <Link href="/deals" className="group relative bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-8 hover:border-green-300 hover:shadow-2xl hover:shadow-green-100/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col items-center justify-center text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <ShoppingBag size={40} />
                  </div>
                  <h3 className="font-black text-2xl text-slate-900">Deals</h3>
                </div>
              </Link>
            </div>
          </section>

          <hr className="border-slate-200/50 my-10" />

          {/* Mobile Featured */}
          <section className="md:hidden">
            <FeaturedCarousel posts={displayFeatured} />
          </section>

          {/* Desktop Featured */}
          <section className="hidden md:block">
            <h2 className="text-2xl font-black text-slate-800 mb-6">Featured</h2>
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
                          <span className="text-sm text-slate-900 font-bold">{post.author || "OkayNotice"}</span>
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

          {/* DYNAMIC TOPICS / TAGS CLOUD */}
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

          {/* Hand Picked Deals */}
          {deals.length > 0 && (
            <section>
              <div className="flex flex-col mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900">Hand Picked Deals</h2>
                  <Link href="/deals" className="hidden md:block text-sm bg-blue-50/80 text-blue-700 px-4 py-2 rounded-lg font-bold hover:bg-blue-100 transition-colors backdrop-blur-md">
                    View All Deals &rarr;
                  </Link>
                </div>
                <p className="text-slate-600 max-w-3xl leading-relaxed">
                  Looking for an upgrade? We scour the market to bring you the best discounts on smartphones, laptops, and tech accessories. All items are verified and seamlessly fulfilled through our trusted e-commerce platform, <strong>Kabale Online</strong>.
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {deals.map(deal => (
                  <a 
                    key={deal.id} 
                    href={deal.dealUrl || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group bg-white/80 backdrop-blur-md border border-white/60 rounded-xl overflow-hidden flex flex-col hover:border-blue-300 hover:shadow-md transition-all duration-300"
                  >
                    <div className="aspect-square relative overflow-hidden bg-slate-50/50">
                      <img 
                        src={deal.image} 
                        alt={deal.title} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow border-t border-slate-100/50">
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mb-1 group-hover:text-blue-700 transition-colors">
                        {deal.title}
                      </h3>
                      <p className="text-blue-700 font-black text-sm mt-auto pt-2">
                        UGX {Number(deal.price).toLocaleString()}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-6 md:hidden">
                <Link href="/deals" className="flex items-center justify-center w-full py-3 bg-white/80 backdrop-blur-md border border-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                  View All Deals &rarr;
                </Link>
              </div>
            </section>
          )}

          <hr className="border-slate-200/50 my-10" />

          {/* Latest Articles */}
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

            {/* Desktop Latest Articles */}
            <div className="hidden md:block">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {latestPosts.map((post) => (
                  <Link 
                    key={post.id} 
                    href={`/blog/${post.slug}`} 
                    className="group flex flex-col bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden border-b border-slate-100/50 relative">
                      <img 
                        src={post.coverImage || "/api/placeholder/150/150"} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 mb-3">
                        {post.category && (
                          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50/80 px-2 py-1 rounded-sm">
                            {post.category}
                          </span>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <span className="text-xs text-slate-400 font-medium hover:text-slate-600 transition-colors">
                            #{post.tags[0]}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto pt-4 flex items-center text-xs text-slate-400 font-medium">
                        <span>{formatDate(post.createdAt)}</span>
                        {post.readTime && <span className="mx-2">•</span>}
                        {post.readTime && <span>{post.readTime}</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link 
                href="/blog" 
                className="flex items-center justify-center w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-md transition-colors hover:bg-slate-800"
              >
                View All Blogs &rarr;
              </Link>
            </div>
          </section>

          <NewsletterForm />

        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-slate-500 space-y-4 relative z-10">
        <AlertCircle size={40} className="text-red-500" />
        <p className="text-lg font-medium">Unable to load homepage content.</p>
        <p className="text-sm">Please refresh the page or check your database connection.</p>
      </div>
    );
  }
}
