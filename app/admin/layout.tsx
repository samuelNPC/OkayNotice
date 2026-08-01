"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check the user's identity against your central Core API
    fetch("https://api.etomu.com/api/users/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        // If they don't exist OR their role is not admin, kick them to the homepage
        if (!data.user || data.user.role !== "admin") {
          router.push("/");
        } else {
          setIsAuthorized(true); // Let them in!
        }
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  if (loading) return <div className="p-10 text-center text-slate-500">Verifying credentials...</div>;
  if (!isAuthorized) return null;

  return (
    <div className="admin-dashboard-wrapper">
      {/* Your Admin Sidebar/Navigation goes here */}
      <main>{children}</main>
    </div>
  );
}
