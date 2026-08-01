"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Matches your D1 database user structure
interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  refreshUser: async () => {} 
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.etomu.com/api/users/me", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🚨 Crucial: Tells the browser to send your Auth.js cookie
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to verify session with Etomu API:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
