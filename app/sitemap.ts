import { MetadataRoute } from "next";

// Define your base URL
const BASE_URL = "https://news.etomu.com";

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
  ];

  // 2. Fetch Dynamic Routes (Blog Posts) from Cloudflare API
  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    // Fetch posts (cached for 1 hour to keep sitemap generation lightning fast)
    const res = await fetch("https://api.etomu.com/api/posts", { 
      next: { revalidate: 3600 } 
    });

    if (res.ok) {
      const data = await res.json();
      const posts = data.posts || [];

      dynamicRoutes = posts.map((post: any) => {
        // Parse standard date strings from your SQLite database
        const lastModified = post.updatedAt 
          ? new Date(post.updatedAt) 
          : post.createdAt 
            ? new Date(post.createdAt) 
            : new Date();

        return {
          url: `${BASE_URL}/blog/${post.slug}`,
          lastModified: lastModified,
          changeFrequency: "weekly",
          priority: 0.7, // Slightly lower than main pages, standard for articles
        };
      });
    }
  } catch (error) {
    console.error("Error generating sitemap for posts:", error);
    // If the API fails, we still return the static routes so Google doesn't penalize the site
  }

  // 3. Combine and return
  return [...staticRoutes, ...dynamicRoutes];
}
