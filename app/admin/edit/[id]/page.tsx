"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

const PREDEFINED_CATEGORIES = [
  "Politics", "Football", "Sports", "Local News", "World News",
  "Technology", "Artificial Intelligence", "Business", "Finance",
  "Real Estate", "Education", "Environment", "Health & Wellness",
  "Entertainment", "Lifestyle", "Startups", "Gadgets & Reviews",
  "Crypto & Web3", "Programming", "Travel"
];

export default function EditPostPage({ params }: { params: { id: string } }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Politics");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  
  // Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, authLoading, mounted, router]);

  // Fetch the existing post data from Cloudflare API
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`https://api.etomu.com/api/posts/${params.id}`);
        const data = await res.json();

        if (res.ok && data.post) {
          const d = data.post;
          setTitle(d.title || "");
          setSlug(d.slug || "");
          setExcerpt(d.excerpt || "");
          setContent(d.content || "");
          setCoverImage(d.coverImage || "");
          setPreviewUrl(d.coverImage || "");

          const fetchedCategory = d.category || "Politics";
          setCategory(fetchedCategory);
          if (!PREDEFINED_CATEGORIES.includes(fetchedCategory)) {
            setIsCustomCategory(true);
          }
        } else {
          setMessage({ type: "error", text: "Post not found." });
        }
      } catch (error) {
        setMessage({ type: "error", text: "Error loading post." });
      } finally {
        setFetching(false);
      }
    };

    if (user) fetchPost();
  }, [params.id, user]);

  // ================= CLOUDFLARE R2 UPLOAD =================
  const uploadToR2 = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("https://api.etomu.com/api/upload", { 
      method: "POST",
      credentials: "include",
      body: fd
    });

    if (!res.ok) throw new Error("Image upload failed");
    const data = await res.json();
    return data.url; 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim()) {
      setMessage({ type: "error", text: "Category is required." });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      let finalImageUrl = coverImage;
      if (imageFile) {
        finalImageUrl = await uploadToR2(imageFile);
      }

      const res = await fetch(`https://api.etomu.com/api/posts/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          category: category.trim(),
          coverImage: finalImageUrl,
        })
      });

      if (!res.ok) throw new Error("Failed to update post");

      setMessage({ type: "success", text: "Post updated successfully!" });
      setTimeout(() => router.push("/admin/posts"), 1500);
    } catch (error: any) {
      setMessage({ type: "error", text: "Failed to update post." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || authLoading || fetching) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p>Loading editor...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/admin/posts" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-50 transition">
          <ArrowLeft size={20} className="text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Edit Post</h1>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border ${message.type === "error" ? "bg-red-50 border-red-100 text-red-600" : "bg-green-50 border-green-100 text-green-700"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Cover Image</label>
            <label className="block cursor-pointer">
              <div className="h-48 max-w-xl bg-slate-50 border-2 border-dashed border-slate-300 hover:border-blue-500 transition-colors rounded-xl overflow-hidden flex items-center justify-center relative">
                {previewUrl ? (
                  <img src={previewUrl} alt="Cover preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-500 font-medium text-sm">Click to Upload Cover</span>
                )}
              </div>
              <input
                type="file" accept="image/*" hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    setPreviewUrl(URL.createObjectURL(file)); 
                  } else {
                    setImageFile(null);
                    setPreviewUrl(coverImage);
                  }
                }}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              {!isCustomCategory ? (
                <select
                  value={category}
                  onChange={(e) => {
                    if (e.target.value === "custom_option") {
                      setIsCustomCategory(true);
                      setCategory(""); 
                    } else {
                      setCategory(e.target.value);
                    }
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none bg-white cursor-pointer"
                  required
                >
                  {PREDEFINED_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option disabled>──────────</option>
                  <option value="custom_option" className="font-bold text-blue-600">➕ Type a Custom Category...</option>
                </select>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Type custom category..."
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none bg-white"
                    required
                    autoFocus
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsCustomCategory(false);
                      setCategory("Politics"); 
                    }}
                    className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-medium transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">URL Slug</label>
             <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none" required />
             <p className="text-xs text-slate-500 mt-1">Warning: Changing the slug will break old links to this post.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Short Excerpt</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none resize-none h-20" required maxLength={160} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
            <MarkdownEditor value={content} onChange={(val) => setContent(val)} />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg transition flex items-center justify-center">
            {isSubmitting ? <><Loader2 className="animate-spin w-5 h-5 mr-2" /> Updating...</> : "Update Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
