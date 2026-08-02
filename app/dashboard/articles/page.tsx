"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, FileText, Trash2, Edit } from "lucide-react";

export default function MyArticlesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const fetchMyArticles = async () => {
    try {
      const res = await fetch("https://api.etomu.com/api/posts/my-articles", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles || []);
      }
    } catch (error) {
      console.error("Failed to fetch articles", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyArticles();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) return;

    try {
      const res = await fetch(`https://api.etomu.com/api/posts/my-articles/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setArticles(articles.filter(article => article.id !== id));
      } else {
        alert("Failed to delete article.");
      }
    } catch (error) {
      alert("Error deleting article.");
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-500 space-y-4 bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p>Loading your articles...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/dashboard" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-50 transition shadow-sm">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">My Articles</h1>
            <p className="text-sm text-slate-500">Manage your submissions, track approval status, and edit your drafts.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center text-blue-600">
              <Loader2 className="animate-spin w-6 h-6" />
            </div>
          ) : articles.length === 0 ? (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
              <FileText size={48} className="stroke-1 mb-2" />
              <p className="font-medium text-slate-600 text-lg">You haven't written any articles yet.</p>
              <Link href="/write" className="text-blue-600 font-bold hover:underline">
                Start writing your first post &rarr;
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {articles.map((article) => (
                <div key={article.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-3 mb-1">
                      {/* Status Badges */}
                      {article.status === 'approved' && <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">Published</span>}
                      {article.status === 'pending' && <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">In Review</span>}
                      {article.status === 'rejected' && <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">Rejected</span>}
                      
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{article.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-1">{article.category}</p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button 
                      onClick={() => alert("Editing interface coming soon!")}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit Article"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(article.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Article"
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
    </div>
  );
}
