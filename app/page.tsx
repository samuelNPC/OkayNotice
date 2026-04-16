import Link from "next/link";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import NewsletterForm from "@/components/home/NewsletterForm";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";
import MoreButton from "@/components/home/MoreButton";
import { FileText, Wrench, ShoppingBag, AlertCircle, Bookmark } from "lucide-react";

export const dynamic = "force-dynamic";

const serializeDoc = (doc: any) => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
  };
};

// Helper to format the upload date beautifully (e.g. "Apr 16, 2026")
const formatDate = (isoString: string | null) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default async function HomePage() {
  try {
    const postsRef = collection(db, "posts");
    const latestQuery = query(postsRef, orderBy("createdAt", "desc"), limit(9));
    const latestSnapshot = await getDocs(latestQuery);
    const latestPosts = latestSnapshot.docs.map(serializeDoc);

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
      <div className="bg-white min-h-screen text-slate-900 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 md:pt-10">

          {/* Mobile Hero */}
          <section className="mb-8 md:hidden flex flex-col items-center text-center">
            <h1 className="text-3xl font-black text-slate-900 mb-8 tracking-tight leading-tight">
              What are you <br />
              <span className="text-blue-700">Interested in Today?</span>
            </h1>
            <div className="grid grid-cols-2 gap-4 w-full">
              <Link href="/blog" className="flex items-center justify-center space-x-3 bg-white border border-slate-200 py-4 hover:border-blue-300 transition-colors">
                <FileText size={20} className="text-orange-500" />
                <span className="font-bold text-slate-800">Blog</span>
              </Link>
              <Link href="/tools" className="flex items-center justify-center space-x-3 bg-white border border-slate-200 py-4 hover:border-blue-300 transition-colors">
                <Wrench size={20} className="text-pink-500" />
                <span className="font-bold text-slate-800">Tools</span>
              </Link>
              <Link href="/deals" className="flex items-center justify-center space-x-3 bg-white border border-slate-200 py-4 hover:border-blue-300 transition-colors">
                <ShoppingBag size={20} className="text-green-500" />
                <span className="font-bold text-slate-800">Deals</span>
              </Link>
              <MoreButton />
            </div>
          </section>

          {/* Desktop Hero */}
          <section className="hidden md:flex mb-10 text-left flex-col lg:flex-row lg:items-center justify-between gap-6">
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              What are you <br />
              <span className="text-blue-700">Interested in Today?</span>
            </h1>
            <div className="grid grid-cols-3 gap-4 w-full lg:w-auto shrink-0">
              <Link href="/blog" className="flex items-center justify-center px-8 space-x-2 bg-white border border-slate-200 py-4 hover:border-blue-300 transition-all">
                <FileText size={20} className="text-orange-500" />
                <span className="font-bold text-slate-800">Blog</span>
              </Link>
              <Link href="/tools" className="flex items-center justify-center px-8 space-x-2 bg-white border border-slate-200 py-4 hover:border-blue-300 transition-all">
                <Wrench size={20} className="text-pink-500" />
                <span className="font-bold text-slate-800">Tools</span>
              </Link>
              <Link href="/deals" className="flex items-center justify-center px-8 space-x-2 bg-white border border-slate-200 py-4 hover:border-blue-300 transition-all">
                <ShoppingBag size={20} className="text-green-500" />
                <span className="font-bold text-slate-800">Deals</span>
              </Link>
            </div>
          </section>

          <hr className="border-slate-200 my-10" />

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
                  className="group bg-white border border-slate-200 flex flex-col hover:border-blue-300 transition-colors"
                >
                  <div className="h-48 w-full overflow-hidden relative">
                    {post.category && (
                      <span className="absolute top-4 left-4 z-10 bg-blue-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
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
                    <h3 className="font-bold text-slate-900 text-lg leading-snug line-clamp-2 mb-4">{post.title}</h3>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-200 overflow-hidden border border-slate-200">
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

          <hr className="border-slate-200 my-10" />

                              {/* Hand Picked Deals */}
          {deals.length > 0 && (
            <section>
              <div className="flex flex-col mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900">Hand Picked Deals</h2>
                  <Link href="/deals" className="hidden md:block text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold hover:bg-blue-100 transition-colors">
                    View All Deals &rarr;
                  </Link>
                </div>
                {/* Section Description */}
                <p className="text-slate-600 max-w-3xl leading-relaxed">
                  Looking for an upgrade? We scour the market to bring you the best discounts on smartphones, laptops, and tech accessories. All items are verified and seamlessly fulfilled through our trusted e-commerce platform, <strong>Kabale Online</strong>.
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {deals.map(deal => (
                  <a 
                    key={deal.id} 
                    href={deal.dealUrl || "#"} // Fixed database field mapping
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group bg-white border border-slate-200 overflow-hidden flex flex-col hover:border-blue-300 hover:shadow-md transition-all duration-300"
                  >
                    <div className="aspect-square relative overflow-hidden bg-slate-50">
                      <img 
                        src={deal.image} 
                        alt={deal.title} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow border-t border-slate-100">
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

              {/* Mobile View All Button */}
              <div className="mt-6 md:hidden">
                <Link href="/deals" className="flex items-center justify-center w-full py-3 bg-slate-100 text-slate-800 font-bold rounded-lg hover:bg-slate-200 transition-colors">
                  View All Deals &rarr;
                </Link>
              </div>
            </section>
          )}

          <hr className="border-slate-200 my-10" />



          {/* Latest Articles */}
          <section>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-6">Latest Articles</h2>

            {/* Mobile Latest Articles */}
            <div className="md:hidden">
              {latestPosts.map((post, index) => (
                <div key={post.id}>
                  <Link href={`/blog/${post.slug}`} className="flex gap-4 items-center group py-4">
                    <div className="w-24 h-24 shrink-0 overflow-hidden border border-slate-200">
                      <img 
                        src={post.coverImage || "/api/placeholder/150/150"} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                      />
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="flex items-center gap-2 mb-1">
                        {post.category && (
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5">
                            {post.category}
                          </span>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <span className="text-[10px] text-slate-400 font-medium">#{post.tags[0]}</span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-blue-700 leading-snug group-hover:text-blue-900 transition-colors mb-1 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-2">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto text-xs text-slate-400 font-medium flex items-center">
                        <span>{formatDate(post.createdAt)}</span>
                        {post.readTime && <span className="mx-1.5">•</span>}
                        {post.readTime && <span>{post.readTime}</span>}
                      </div>
                    </div>
                  </Link>
                  {index !== latestPosts.length - 1 && (
                    <hr className="border-slate-200" />
                  )}
                </div>
              ))}
              <div className="pt-6 mt-2 border-t border-slate-200">
                <Link 
                  href="/blog" 
                  className="flex items-center justify-center w-full py-4 bg-slate-900 text-white font-bold transition-colors"
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
                    className="group flex flex-col bg-white border border-slate-200 hover:border-blue-300 transition-all"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden border-b border-slate-100 relative">
                      <img 
                        src={post.coverImage || "/api/placeholder/150/150"} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 mb-3">
                        {post.category && (
                          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-1">
                            {post.category}
                          </span>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <span className="text-xs text-slate-400 font-medium hover:text-slate-600 transition-colors">
                            #{post.tags[0]}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-blue-700 leading-snug group-hover:text-blue-900 transition-colors mb-2 line-clamp-2">
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
                className="flex items-center justify-center w-full py-4 bg-slate-900 text-white font-bold transition-colors hover:bg-slate-800"
              >
                View All Blogs &rarr;
              </Link>
            </div>
          </section>

          {/* NEWSLETTER */}
          <NewsletterForm />

        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-slate-500 space-y-4">
        <AlertCircle size={40} className="text-red-500" />
        <p className="text-lg font-medium">Unable to load homepage content.</p>
        <p className="text-sm">Please refresh the page or check your database connection.</p>
      </div>
    );
  }
}
