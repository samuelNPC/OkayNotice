import { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/cards/PostCard";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Latest Tech & Finance News",
  description: "Read the latest updates on Uganda tech, finance, mobile money, and gadget reviews on Etomu News.",
};

const POSTS_PER_PAGE = 9;

async function getBlogData() {
  try {
    // Run both fetches in parallel for maximum speed
    const [allRes, featuredRes] = await Promise.all([
      fetch("https://api.etomu.com/api/posts", { next: { revalidate: 60 } }),
      fetch("https://api.etomu.com/api/posts?featured=true", { next: { revalidate: 60 } })
    ]);

    const allData = await allRes.json();
    const featuredData = await featuredRes.json();

    return { 
      allPosts: allData.posts || [], 
      featuredPosts: featuredData.posts || [] 
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { allPosts: [], featuredPosts: [] };
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Number(searchParams?.page) || 1;
  const { allPosts, featuredPosts } = await getBlogData();

  // Calculate Pagination
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div className="bg-white min-h-screen text-slate-900 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">

        {/* UPGRADED HERO SECTION */}
        <section className="border-b border-slate-200 pb-10 mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-4">
            The Etomu News <span className="text-blue-700">Blog</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl">
            Deep dives, practical guides, and the latest updates on finance, technology trends, and gadget deals in Uganda.
          </p>
        </section>

        {currentPosts.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No posts found. Start writing from your admin dashboard!
          </div>
        ) : (
          <div className="space-y-12">

            {/* FIRST BATCH OF POSTS (Up to 3) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {currentPosts.slice(0, 3).map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* INJECT FEATURED CAROUSEL (Only on Page 1) */}
            {currentPage === 1 && featuredPosts.length > 0 && (
              <div className="py-8 my-8 border-y border-slate-100 bg-slate-50 -mx-4 px-4 sm:mx-0 sm:px-8 sm:rounded-3xl">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest">Editor's Picks</h2>
                </div>
                <FeaturedCarousel posts={featuredPosts} />
              </div>
            )}

            {/* SECOND BATCH OF POSTS (The remaining 6 for this page) */}
            {currentPosts.length > 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {currentPosts.slice(3).map((post: any) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}

          </div>
        )}

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 mt-16 pt-8">
            {currentPage > 1 ? (
              <Link 
                href={`/blog?page=${currentPage - 1}`}
                className="flex items-center text-slate-600 hover:text-blue-700 font-bold transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                Previous Page
              </Link>
            ) : (
              <div /> 
            )}

            <span className="text-sm font-medium text-slate-500">
              Page {currentPage} of {totalPages}
            </span>

            {currentPage < totalPages ? (
              <Link 
                href={`/blog?page=${currentPage + 1}`}
                className="flex items-center text-slate-600 hover:text-blue-700 font-bold transition-colors"
              >
                Next Page
                <ArrowRight size={20} className="ml-2" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}

      </div>
    </div>
  );
}
