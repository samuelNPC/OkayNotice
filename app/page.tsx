import Link from "next/link";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Force dynamic rendering so new articles appear instantly and trending shuffles
export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const activeCategory = searchParams.category || "All";

  // 1. Fetch Posts from Firestore
  const postsRef = collection(db, "posts");
  const q = query(postsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  
  const allPosts = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Safely parse Firestore timestamps
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
    };
  }) as any[];

  // Filter by category if needed
  const filteredPosts = activeCategory === "All" 
    ? allPosts 
    : allPosts.filter(post => post.category === activeCategory);

  // 2. Separate Featured vs Regular
  const featuredPost = filteredPosts.find((p) => p.isFeatured) || filteredPosts[0]; // Fallback to newest if none featured
  const regularPosts = filteredPosts.filter((p) => p.id !== featuredPost?.id);

  const topRecentPosts = regularPosts.slice(0, 2);
  const feedPosts = regularPosts.slice(2);

  // 3. Trending Logic (Random shuffle on refresh, strict limit of 12)
  const trendingPosts = [...allPosts]
    .sort(() => 0.5 - Math.random())
    .slice(0, 12);

  const CATEGORIES = ["All", "Tech", "Finance", "Deals"];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Category Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-3 space-x-2 scrollbar-hide">
            {CATEGORIES.map((category) => (
              <Link 
                key={category}
                href={category === "All" ? "/" : `/?category=${category}`}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category 
                    ? "bg-slate-900 text-white shadow-sm" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {category === "All" ? "All Stories" : category}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

        {/* Hero Grid (Featured + Top 2 Recent) */}
        {activeCategory === "All" && featuredPost && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            
            {/* Main Featured Card */}
            <Link 
              href={`/blog/${featuredPost.slug}`} 
              className="lg:col-span-2 group relative rounded-2xl overflow-hidden shadow-sm h-[400px] lg:h-[500px]"
            >
              <img 
                src={featuredPost.coverImage || "/api/placeholder/800/600"} 
                alt={featuredPost.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
                  {featuredPost.category}
                </span>
                <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-2 group-hover:underline decoration-white underline-offset-4">
                  {featuredPost.title}
                </h2>
                <p className="text-slate-200 line-clamp-2 md:text-lg">
                  {featuredPost.excerpt}
                </p>
              </div>
            </Link>

            {/* Sub Column for Top Recent */}
            <div className="flex flex-col gap-6 h-[400px] lg:h-[500px]">
              {topRecentPosts.map((post) => (
                <Link 
                  key={post.id} 
                  href={`/blog/${post.slug}`} 
                  className="group flex-1 relative rounded-2xl overflow-hidden shadow-sm bg-white"
                >
                  <img 
                    src={post.coverImage || "/api/placeholder/400/300"} 
                    alt={post.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5 w-full">
                    <span className="text-blue-400 text-xs font-bold uppercase tracking-wide mb-2 block">
                      {post.category}
                    </span>
                    <h3 className="text-lg font-bold text-white leading-tight group-hover:underline decoration-white underline-offset-4">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Layout Split (Main Feed + Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main Feed Column */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-2">
              {activeCategory === "All" ? "Latest Articles" : `${activeCategory} Articles`}
            </h2>

            <div className="space-y-8">
              {feedPosts.length > 0 ? (
                feedPosts.map((post) => {
                  const dateStr = post.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                  return (
                    <Link 
                      key={post.id} 
                      href={`/blog/${post.slug}`} 
                      className="group flex flex-col sm:flex-row gap-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-300 transition-colors"
                    >
                      <div className="w-full sm:w-1/3 aspect-[4/3] rounded-xl overflow-hidden relative shrink-0">
                        <img 
                          src={post.coverImage || "/api/placeholder/400/300"} 
                          alt={post.title} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="text-sm font-medium mb-2 text-slate-500">
                          <span className="text-blue-600 font-bold uppercase tracking-wide">{post.category}</span>
                          <span className="mx-2">&bull;</span>
                          {dateStr}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-slate-600 line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                  <p className="text-slate-500 text-lg">No articles found for <span className="font-bold text-slate-800">{activeCategory}</span> yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            
            {/* Newsletter */}
            <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold mb-2">The Weekly Drop</h3>
              <p className="text-slate-400 text-sm mb-6">Join our community getting tech alerts and market updates.</p>
              <form className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  required 
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
                >
                  Subscribe Free
                </button>
              </form>
              <p className="text-slate-500 text-xs mt-4 text-center">
                No spam. Unsubscribe anytime.
              </p>
            </div>

            {/* Trending Now */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2">Trending Now</h3>
              <div className="flex flex-col space-y-4">
                {trendingPosts.map((post) => {
                   const dateStr = post.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                   return (
                     <Link 
                       key={post.id} 
                       href={`/blog/${post.slug}`} 
                       className="group flex gap-4 items-center pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                     >
                       <img 
                         src={post.coverImage || "/api/placeholder/100/100"} 
                         alt={post.title}
                         className="w-16 h-16 rounded-lg object-cover bg-slate-100 shrink-0" 
                       />
                       <div>
                         <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                           {post.title}
                         </h4>
                         <span className="text-xs text-slate-500 mt-1 block">
                           {dateStr}
                         </span>
                       </div>
                     </Link>
                   );
                })}
              </div>
            </div>

          </aside>
        </div>
      </main>
    </div>
  );
}
