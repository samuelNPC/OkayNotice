"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/components/context/AuthContext";
import Link from "next/link";
import { FileText, LogOut, ShoppingBag, PlusCircle, Settings } from "lucide-react";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  if (loading || !user) {
    return <div className="text-center py-20 text-slate-500">Verifying access...</div>;
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
        {/* Blog Management Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <FileText size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Blog Posts</h2>
          <p className="text-slate-500 text-sm mb-4">Write, edit, and publish your tech and finance articles to drive SEO traffic.</p>
          
          <div className="flex flex-col w-full space-y-2 mt-auto">
            <Link href="/admin/posts" className="flex items-center justify-center w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-blue-600 font-medium py-2 rounded-lg transition">
              <Settings size={18} className="mr-2" /> Manage Posts
            </Link>
            <Link href="/admin/upload" className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition">
              <PlusCircle size={18} className="mr-2" /> Create New Post
            </Link>
          </div>
        </div>

        {/* Deals Management Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
            <ShoppingBag size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Kabale Deals</h2>
          <p className="text-slate-500 text-sm mb-4">Curate your top gadget deals and redirect users to Kabale Online.</p>
          
          <div className="flex flex-col w-full space-y-2 mt-auto">
            <Link href="/admin/deals/manage" className="flex items-center justify-center w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-green-600 font-medium py-2 rounded-lg transition">
              <Settings size={18} className="mr-2" /> Manage Deals
            </Link>
            <Link href="/admin/deals" className="flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition">
              <PlusCircle size={18} className="mr-2" /> Add New Deal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
