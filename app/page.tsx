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
                  <div className="h-48 w-full overflow-hidden">
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
                        <div className="w-8 h-8 bg-slate-200 overflow-hidden border border-slate-300">
                          <img 
                            src={post.authorImage || defaultAvatar} 
                            alt="Author" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <span className="text-sm text-slate-600 font-medium">{post.author || "OkayNotice"}</span>
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-black text-slate-800">Hand picked deals</h2>
                <Link href="/deals" className="text-sm text-blue-600 font-bold hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {deals.map(deal => (
                  <div key={deal.id} className="bg-white border border-slate-200 overflow-hidden flex flex-col hover:border-blue-300 transition-colors">
                    <div className="aspect-square relative">
                      <img src={deal.image} alt={deal.title} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div className="p-4 flex flex-col flex-grow border-t border-slate-100">
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mb-2">{deal.title}</h3>
                      <p className="text-blue-700 font-black text-sm mt-auto">UGX {deal.price}</p>
                    </div>
                  </div>
                ))}
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
                    <div className="flex flex-col">
                      <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors mb-1 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {post.excerpt}
                      </p>
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
                    <div className="aspect-[4/3] w-full overflow-hidden border-b border-slate-100">
                      <img 
                        src={post.coverImage || "/api/placeholder/150/150"} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-slate-800 leading-snug group-hover:text-blue-700 transition-colors mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link 
                href="/blog" 
                className="flex items-center justify-center w-full py-4 bg-slate-900 text-white font-bold transition-colors"
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
