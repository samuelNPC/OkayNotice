"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2, Star, Loader2 } from "lucide-react";

export default function ManagePostsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Security Check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login"); // Pointing to your custom login page
    }
  }, [user, authLoading, router]);

  // Fetch posts from Cloudflare API
  const fetchPosts = async () => {
    try {
      const res = await fetch("https://api.etomu.com/api/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchPosts();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this post? This cannot be undone.")) {
      try {
        const res = await fetch(`https://api.etomu.com/api/posts/${id}`, {
          method: "DELETE",
          credentials: "include", // Secures the admin request
        });
        
        if (res.ok) {
          setPosts(posts.filter(p => p.id !== id));
        } else {
          alert("Failed to delete post.");
        }
      } catch (error) {
        alert("Failed to delete post.");
      }
    }
  };

  const toggleFeature = async (id: string, currentStatus: boolean) => {
    try {
      // Optimistic UI update (feels faster to the user)
      setPosts(posts.map(p => p.id === id ? { ...p, isFeatured: !currentStatus } : p));
      
      const res = await fetch(`https://api.etomu.com/api/posts/${id}/feature`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isFeatured: !currentStatus })
      });

      if (!res.ok) throw new Error("Failed to update status");
    } catch (error) {
      alert("Failed to update status.");
      fetchPosts(); // Revert on failure
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p>Verifying access...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-50 transition">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Manage Posts</h1>
        </div>
        <Link href="/admin/upload" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition">
          + New Post
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center text-blue-600"><Loader2 className="animate-spin" /></div>
        ) : posts.length === 0 ? (
          <div className="p-10 text-center text-slate-500">No posts found.</div>
        ) : (
          <div className="divide-y divide-slate-200">
            {posts.map((post) => (
              <div key={post.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{post.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">/{post.slug}</p>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button 
                    onClick={() => toggleFeature(post.id, post.isFeatured)}
                    className={`p-2 border rounded-lg transition ${post.isFeatured ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : 'bg-white border-slate-200 text-slate-400 hover:text-yellow-600'}`}
                    title="Feature this post"
                  >
                    <Star size={18} className={post.isFeatured ? "fill-current" : ""} />
                  </button>

                  <Link 
                    href={`/admin/edit/${post.id}`}
                    className="p-2 bg-white border border-slate-200 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                  >
                    <Edit size={18} />
                  </Link>

                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="p-2 bg-white border border-slate-200 text-red-600 rounded-lg hover:bg-red-50 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
