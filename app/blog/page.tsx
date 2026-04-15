import { Metadata } from "next";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PostCard from "@/components/cards/PostCard";

// SEO Metadata
export const metadata: Metadata = {
  title: "Latest Tech & Finance News",
  description: "Read the latest updates on Uganda tech, finance, mobile money, and gadget reviews on OkayNotice.",
};

// Next.js config to ensure the page revalidates and fetches fresh data
export const revalidate = 60; // Revalidate every 60 seconds

async function getPosts() {
  try {
    const postsRef = collection(db, "posts");
    // Fetch posts ordered by creation date (newest first)
    const q = query(postsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="max-w-7xl mx-auto py-10">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold text-slate-900">The OkayNotice Blog</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Insights on finance, technology trends, and the best gadget deals in Uganda.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 text-slate-500">
          No posts found. Start writing from your admin dashboard!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
