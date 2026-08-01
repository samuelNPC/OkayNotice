"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("https://api.etomu.com/api/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // Crucial: Passes the Auth.js session cookie across domains
          credentials: "include",
        });

        if (res.status === 401 || !res.ok) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Failed to fetch session user:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  const handleSignOut = () => {
    // Redirects to Auth.js signout endpoint
    window.location.href = "https://api.etomu.com/api/auth/signout";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* TOP BAR / HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || "User Avatar"}
                className="w-14 h-14 rounded-full border border-slate-200 object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xl">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{user?.name}</h1>
                {user?.role === "admin" && (
                  <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-200">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="self-start sm:self-center bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            Sign Out
          </button>
        </div>

        {/* QUICK STATS & BLOG DASHBOARD */}
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
            <p className="text-lg font-bold text-slate-900 mt-2 capitalize">
              {user?.role || "Author"}
            </p>
          </div>
        </div>

        {/* ACTIONS SECTION */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Blog Management</h2>
          
          <div className="flex flex-wrap gap-3">
            <button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition">
              + Write New Post
            </button>
            <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm px-5 py-2.5 rounded-lg transition">
              My Articles
            </button>
            
            {/* ADMIN-ONLY ACTION */}
            {user?.role === "admin" && (
              <button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition">
                ⚡ Access Admin Portal
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
