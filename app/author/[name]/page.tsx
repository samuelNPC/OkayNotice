import { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/cards/PostCard";
import { ArrowLeft, BookOpen, Award } from "lucide-react";

async function getAuthorPosts(authorName: string) {
  try {
    const decodedName = decodeURIComponent(authorName);
    const res = await fetch(`https://api.etomu.com/api/posts/author/${encodeURIComponent(decodedName)}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts || [];
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  return {
    title: `${decodedName} - Author Profile | Etomu News`,
    description: `Read all published articles and expert insights by ${decodedName} on Etomu News.`,
  };
}

export default async function AuthorProfilePage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const posts = await getAuthorPosts(decodedName);

  // Extract author avatar image from the first post if available
  const authorImage = posts.length > 0 ? posts[0].authorImage : null;

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Author Hero Section */}
      <div className="bg-white border-b border-slate-200 pt-12 pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/blog" className="inline-flex items-center text-slate-500 hover:text-blue-600 font-medium text-sm mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to News Feed
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Dynamic Avatar / Initial Fallback */}
            <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-black border-4 border-white shadow-md shrink-0">
              {authorImage ? (
                <img src={authorImage} alt={decodedName} className="w-full h-full object-cover" />
              ) : (
                <span>{decodedName.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div className="flex-1">
              {/* Name on one line, breaking if long */}
              <h1 className="text-3xl font-black text-slate-900 mb-2 break-words">
                {decodedName}
              </h1>

              {/* Verified Contributor Badge on the next line below */}
              <div className="mb-4">
                <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  <Award size={12} className="mr-1" /> Verified Contributor
                </span>
              </div>

              <p className="text-slate-600 text-sm mb-4">
                Contributing writer & analyst at Etomu News. Building a public portfolio of expert insights.
              </p>

              <div className="flex items-center space-x-4 text-xs font-bold text-slate-500">
                <span className="flex items-center bg-slate-100 px-3 py-1.5 rounded-lg">
                  <BookOpen size={14} className="mr-1.5 text-blue-600" /> {posts.length} Published Articles
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Author Articles Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12">
        <h2 className="text-xl font-black text-slate-900 mb-6 border-b border-slate-200 pb-3">
          Articles by {decodedName}
        </h2>

        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            No published articles found for this author yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
