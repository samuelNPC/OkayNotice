"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Check if the user exists and has the admin role from Clerk metadata
      if (!user || user.role !== "admin") {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading) return <div className="p-10 text-center text-slate-500">Verifying credentials...</div>;
  
  // Double-check to prevent flashing unauthorized content
  if (!user || user.role !== "admin") return null;

  return (
    <div className="admin-dashboard-wrapper">
      {/* Your Admin Sidebar/Navigation goes here */}
      <main>{children}</main>
    </div>
  );
}
