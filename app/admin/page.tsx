"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import Link from "next/link";
import { FileText, LogOut, PlusCircle, Settings, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // Pointing to your custom login page
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    // Redirects to Auth.js built-in signout route
    window.location.href = "https://api.etomu.com/api/auth/signout";
  };

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p>Verifying access...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm">Welcome back, {user.email}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center text-red-600 hover:text-red-700 font-medium transition"
        >
          <LogOut size={18} className="mr-2" />
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Post Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <PlusCircle size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Create New Post</h2>
          <p className="text-slate-500 text-sm mb-4">
            Write and publish new tech and finance articles to drive SEO traffic.
          </p>

          <div className="flex flex-col w-full mt-auto pt-4">
            <Link 
              href="/admin/upload" 
              className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition"
            >
              <PlusCircle size={18} className="mr-2" /> Create Post
            </Link>
          </div>
        </div>

        {/* Manage Posts Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center">
            <FileText size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Manage Posts</h2>
          <p className="text-slate-500 text-sm mb-4">
            Edit, review, or delete your existing published articles and drafts.
          </p>

          <div className="flex flex-col w-full mt-auto pt-4">
            <Link 
              href="/admin/posts" 
              className="flex items-center justify-center w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium py-2.5 rounded-lg transition"
            >
              <Settings size={18} className="mr-2" /> Manage Posts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
