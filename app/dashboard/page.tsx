"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link"; // 🚨 Added Link import

export default function Dashboard() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = () => {
    signOut({ redirectUrl: "/login" });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  const userRole = user?.publicMetadata?.role as string || "Author";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* TOP BAR / HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.fullName || "User Avatar"}
                className="w-14 h-14 rounded-full border border-slate-200 object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xl">
                {user?.firstName?.[0]?.toUpperCase() || "U"}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{user?.fullName}</h1>
                {userRole === "admin" && (
                  <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-200">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="self-start sm:self-center bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            Sign Out
          </button>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Published Posts</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Drafts</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Account Type</h3>
            <p className="text-lg font-bold text-slate-900 mt-2 capitalize">{userRole}</p>
          </div>
        </div>

        {/* ACTIONS SECTION */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Blog Management</h2>

          <div className="flex flex-wrap gap-3">
            {/* 🚨 Updated to Link to /write */}
            <Link 
              href="/write" 
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition"
            >
              + Write New Post
            </Link>

            {/* 🚨 Updated to Link to /dashboard/articles */}
            <Link 
              href="/dashboard/articles" 
              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm px-5 py-2.5 rounded-lg transition"
            >
              My Articles
            </Link>

            {/* ADMIN-ONLY ACTION */}
            {userRole === "admin" && (
              <Link 
                href="/admin" 
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition"
              >
                ⚡ Access Admin Portal
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
