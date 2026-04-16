import Link from "next/link";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Calculator, Landmark, TrendingUp, ShieldCheck, Zap, Globe, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // 1. Fetch Data
  const postsRef = collection(db, "posts");
  const postsQuery = query(postsRef, orderBy("createdAt", "desc"));
  const postsSnapshot = await getDocs(postsQuery);
  
  const allPosts = postsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
    };
  }) as any[];

  const dealsRef = collection(db, "deals");
  const dealsQuery = query(dealsRef, orderBy("createdAt", "desc"), limit(4));
  const dealsSnapshot = await getDocs(dealsQuery);
  const latestDeals = dealsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];

  // 2. Data Sorting & Filtering
  const allFeatured = allPosts.filter(p => p.isFeatured);
  
  // Hero Post (Top featured, fallback to newest if none featured)
  const heroPost = allFeatured.length > 0 ? allFeatured[0] : allPosts[0];
  
  // Featured Section (Next 3 featured posts)
  const featuredPosts = allFeatured.filter(p => p.id !== heroPost?.id).slice(0, 3);
  
  // Latest & Categories
  const latestPosts = allPosts.filter(p => p.id !== heroPost?.id).slice(0, 6);
  const financePosts = allPosts.filter(p => p.category === "Finance").slice(0, 3);
  const techPosts = allPosts.filter(p => p.category === "Tech").slice(0, 3);

  return (
    <div className="bg-white min-h-screen text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
              Smart Finance & <span className="text-blue-600">Tech Tips</span> for Uganda
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-lg">
              Learn how to navigate digital payments, save money, and find the absolute best gadget deals in the country.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/blog" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-center transition shadow-sm">
                Explore Guides
              </Link>
              <Link href="/deals" className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-4 px-8 rounded-lg text-center transition border border-slate-200">
                View Deals
              </Link>
            </div>
          </div>

          {/* Hero Featured Image */}
          {heroPost && (
            <Link href={`/blog/${heroPost.slug}`} className="group relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3] block">
              <img 
                src={heroPost.coverImage || "/api/placeholder/800/600"} 
                alt={heroPost.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
                  Editor's Pick
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight group-hover:underline decoration-white underline-offset-4">
                  {heroPost.title}
                </h2>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* 2. FEATURED POSTS */}
      {featuredPosts.length > 0 && (
        <section className="bg-slate-50 py-16 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">Must Read Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:border-slate-300 transition">
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-slate-600 text-sm line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. TOOLS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Financial Calculators</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Free tools designed specifically for Ugandan business owners and students to track their money.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
              <Calculator size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">MoMo Charges</h3>
            <p className="text-slate-600 text-sm mb-6 flex-grow">Calculate exact sending and withdrawal fees before making a transaction.</p>
            <Link href="/tools/momo-charges-calculator" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition">
              Use Tool
            </Link>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Profit Calculator</h3>
            <p className="text-slate-600 text-sm mb-6 flex-grow">Determine your exact profit margins after sourcing and transport costs.</p>
            <Link href="/tools/profit-calculator" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition">
              Use Tool
            </Link>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-6">
              <Landmark size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Loan Estimator</h3>
            <p className="text-slate-600 text-sm mb-6 flex-grow">Calculate monthly repayments and interest for personal or business loans.</p>
            <Link href="/tools/loan-calculator" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition">
              Use Tool
            </Link>
          </div>
        </div>
      </section>

      {/* 4. DEALS / BEST PICKS */}
      {latestDeals.length > 0 && (
        <section className="bg-slate-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold mb-2">Curated Tech Deals</h2>
                <p className="text-slate-400">The best prices right now on Kabale Online.</p>
              </div>
              <Link href="/deals" className="hidden md:block text-blue-400 hover:text-blue-300 font-medium transition">
                View All Deals &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestDeals.map((deal) => (
                <div key={deal.id} className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 flex flex-col">
                  <img src={deal.image} alt={deal.title} className="w-full aspect-square object-cover" />
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">{deal.title}</h3>
                    <p className="text-blue-400 font-bold mb-4">UGX {deal.price}</p>
                    <a href={deal.dealUrl} target="_blank" rel="noopener noreferrer" className="mt-auto block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition">
                      View Deal
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/deals" className="md:hidden block mt-8 text-center text-blue-400 font-medium w-full py-3 border border-slate-700 rounded-lg">
              View All Deals
            </Link>
          </div>
        </section>
      )}

      {/* 5. LATEST ARTICLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold mb-10">Latest Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {latestPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group flex gap-6 items-center">
              <div className="w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div>
                <span className="text-blue-600 text-xs font-bold uppercase tracking-wide mb-1 block">{post.category}</span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-2">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. CATEGORY SECTIONS (Tech & Finance) */}
      <section className="bg-slate-50 py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Finance Column */}
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-2">
                <h2 className="text-2xl font-bold text-slate-900">Finance</h2>
                <Link href="/blog?category=Finance" className="text-blue-600 text-sm font-medium hover:underline">See all</Link>
              </div>
              <div className="space-y-6">
                {financePosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                    <p className="text-slate-500 text-sm mt-1 line-clamp-1">{post.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tech Column */}
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-2">
                <h2 className="text-2xl font-bold text-slate-900">Tech</h2>
                <Link href="/blog?category=Tech" className="text-blue-600 text-sm font-medium hover:underline">See all</Link>
              </div>
              <div className="space-y-6">
                {techPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                    <p className="text-slate-500 text-sm mt-1 line-clamp-1">{post.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. TRUST / VALUE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-b border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">Updated Content</h3>
            <p className="text-slate-600 text-sm">We ensure all our guides and numbers are highly accurate.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 mb-4">
              <Globe size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">Uganda Focused</h3>
            <p className="text-slate-600 text-sm">Advice and deals specifically tailored for the local market.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 mb-4">
              <Zap size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">Practical Tips</h3>
            <p className="text-slate-600 text-sm">No fluff. Just tools and insights you can use immediately.</p>
          </div>
        </div>
      </section>

      {/* 8. WHATSAPP CTA SECTION */}
      <section className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Join for Daily Updates</h2>
          <p className="text-slate-600 mb-8 text-lg">
            Get the latest tech deals, financial tips, and new calculator tools delivered straight to your phone.
          </p>
          <a 
            href="#" 
            className="inline-flex items-center justify-center bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold py-4 px-8 rounded-lg transition shadow-sm text-lg"
          >
            <MessageCircle size={20} className="mr-2" />
            Join WhatsApp Channel
          </a>
        </div>
      </section>

    </div>
  );
}
