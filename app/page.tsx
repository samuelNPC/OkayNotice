import Link from "next/link";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";
import NewsletterForm from "@/components/home/NewsletterForm";
import { FileText, Wrench, ShoppingBag, LayoutGrid, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

// FIX: Safely convert Firebase Timestamps to strings so Next.js doesn't crash 
// when passing this data to the Client Component (FeaturedCarousel)
const serializeDoc = (doc: any) => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
  };
};

export default async function HomePage() {
  try {
    // Fetch Latest 10 Articles
    const postsRef = collection(db, "posts");
    const latestQuery = query(postsRef, orderBy("createdAt", "desc"), limit(10));
    const latestSnapshot = await getDocs(latestQuery);
    const latestPosts = latestSnapshot.docs.map(serializeDoc);

    // Fetch 6 Featured Articles
    const featuredQuery = query(postsRef, where("isFeatured", "==", true), limit(6));
    const featuredSnapshot = await getDocs(featuredQuery);
    const featuredPosts = featuredSnapshot.docs.map(serializeDoc);
    
    // Fallback if no featured posts exist yet
    const displayFeatured = featuredPosts.length > 0 ? featuredPosts : latestPosts.slice(0, 6);

    // Fetch 4 Deals
    const dealsRef = collection(db, "deals");
    const dealsQuery = query(dealsRef, orderBy("createdAt", "desc"), limit(4));
    const dealsSnapshot = await getDocs(dealsQuery);
    const deals = dealsSnapshot.docs.map(serializeDoc);

    return (
      <div className="bg-white min-h-screen text-slate-900 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
          
          {/* HERO: Interests Section */}
          <section className="mb-10">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 tracking-tight">
              What are you interested in today?
            </h1>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/blog" className="flex items-center justify-center space-x-3 bg-white border border-slate-100 shadow-sm py-4 rounded-2xl hover:border-blue-200 transition">
                <FileText size={20} className="text-orange-500" />
                <span className="font-bold text-slate-800">Blog</span>
              </Link>
              <Link href="/tools" className="flex items-center justify-center space-x-3 bg-white border border-slate-100 shadow-sm py-4 rounded-2xl hover:border-blue-200 transition">
                <Wrench size={20} className="text-pink-500" />
                <span className="font-bold text-slate-800">Tools</span>
              </Link>
              <Link href="/deals" className="flex items-center justify-center space-x-3 bg-white border border-slate-100 shadow-sm py-4 rounded-2xl hover:border-blue-200 transition">
                <ShoppingBag size={20} className="text-green-500" />
                <span className="font-bold text-slate-800">Deals</span>
              </Link>
              
              <button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    document.querySelector<HTMLButtonElement>('button[aria-label="Toggle Menu"]')?.click();
                  }
                }}
                className="flex items-center justify-center space-x-3 bg-white border border-slate-100 shadow-sm py-4 rounded-2xl hover:border-blue-200 transition"
              >
                <LayoutGrid size={20} className="text-blue-500" />
                <span className="font-bold text-slate-800">More</span>
              </button>
            </div>
          </section>

          {/* FEATURED CAROUSEL */}
          <section className="mb-12">
            <FeaturedCarousel posts={displayFeatured} />
          </section>

          {/* HAND PICKED DEALS */}
          {deals.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Hand picked deals</h2>
                <Link href="/deals" className="text-sm text-blue-600 font-medium hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {deals.map(deal => (
                  <div key={deal.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="aspect-square bg-slate-50 relative">
                      <img src={deal.image} alt={deal.title} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div className="p-3 flex flex-col flex-grow">
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mb-1">{deal.title}</h3>
                      <p className="text-blue-600 font-bold text-sm mt-auto">UGX {deal.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* LATEST ARTICLES LIST */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Latest Articles</h2>
            <div className="space-y-6">
              {latestPosts.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="flex gap-4 items-center group">
                  <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-2xl overflow-hidden bg-slate-100">
                    <img 
                      src={post.coverImage || "/api/placeholder/150/150"} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-base md:text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* NEWSLETTER */}
          <NewsletterForm />

        </div>
      </div>
    );
  } catch (error) {
    console.error("Homepage Error:", error);
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-slate-500 space-y-4">
        <AlertCircle size={40} className="text-red-500" />
        <p className="text-lg">Unable to load homepage content.</p>
        <p className="text-sm">Please refresh the page or check your database connection.</p>
      </div>
    );
  }
}
