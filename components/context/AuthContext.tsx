"use client";

import { useUser } from "@clerk/nextjs";

// Matches your original D1 database user structure so you don't have to 
// rewrite any of your other frontend components!
interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
}

export const useAuth = () => {
  // Pull directly from Clerk's extremely fast local cache
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();

  // Translate Clerk's data structure into your Etomu structure
  const mappedUser: UserProfile | null = isSignedIn && clerkUser ? {
    id: clerkUser.id,
    name: clerkUser.fullName || "Etomu User",
    email: clerkUser.primaryEmailAddress?.emailAddress || "",
    image: clerkUser.imageUrl,
    role: (clerkUser.publicMetadata?.role as string) || "Author",
  } : null;

  const refreshUser = async () => {
    if (clerkUser) {
      await clerkUser.reload();
    }
  };

  return {
    user: mappedUser,
    loading: !isLoaded,
    refreshUser,
  };
};

// We export a dummy AuthProvider that just returns children.
// This prevents errors just in case you still have <AuthProvider> wrapping any layouts!
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
