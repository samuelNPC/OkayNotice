import { MetadataRoute } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Define your base URL
const BASE_URL = "https://okaynotice.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Define your Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/deals`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // 2. Fetch Dynamic Routes (Blog Posts) from Firebase
  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const postsRef = collection(db, "posts");
    const snapshot = await getDocs(postsRef);

    dynamicRoutes = snapshot.docs.map((doc) => {
      const post = doc.data();
      // Safely handle Firestore Timestamps for the lastModified date
      const lastModified = post.updatedAt?.toDate() 
        || post.createdAt?.toDate() 
        || new Date();

      return {
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: lastModified,
        changeFrequency: "weekly",
        priority: 0.7, // Slightly lower than main pages, standard for articles
      };
    });
  } catch (error) {
    console.error("Error generating sitemap for posts:", error);
    // If Firebase fails, we still return the static routes so Google doesn't penalize the site
  }

  // 3. Combine and return
  return [...staticRoutes, ...dynamicRoutes];
}
