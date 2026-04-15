"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/context/AuthContext";
import ImageUpload from "@/components/admin/ImageUpload";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CreatePostPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Tech");
  const [coverImage, setCoverImage] = useState("");
  
  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Hydration sync
  useEffect(() => {
    setMounted(true);
  }, []);

  // Security Check
  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, authLoading, mounted, router]);

  // Auto-generate slug when title changes
  useEffect(() => {
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-"); // Replace spaces with hyphens
    setSlug(generatedSlug);
  }, [title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    // Validation
    if (!coverImage) {
      setMessage({ type: "error", text: "Please upload a cover image." });
      setIsSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        title,
        slug,
        excerpt,
        content,
        category,
        coverImage,
        authorEmail: user?.email,
        published: true,
        createdAt: serverTimestamp(),
      });

      setMessage({ type: "success", text: "Post created successfully!" });
      
      setTimeout(() => {
        router.push("/admin");
      }, 1500);

    } catch (error: any) {
      console.error("Error adding document: ", error);
      setMessage({ type: "error", text: "Failed to publish post. Try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // PREVENT HYDRATION CRASH: Show a stable loader while Firebase initializes
  if (!mounted || authLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p>Verifying access...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/admin" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-50 transition">
          <ArrowLeft size={20} className="text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Create New Post</h1>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
        
        {/* Status Messages */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === "error" ? "bg-red-50 border-red-100 text-red-600" : "bg-green-50 border-green-100 text-green-700"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Cloudinary Image Uploader */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Cover Image</label>
            <ImageUpload onUploadSuccess={(url) => setCoverImage(url)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="e.g. Top 5 Phones in Uganda"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none bg-white"
              >
                <option value="Tech">Tech</option>
                <option value="Finance">Finance</option>
                <option value="Deals">Deals</option>
              </select>
            </div>
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">URL Slug</label>
            <div className="flex bg-slate-50 border border-slate-300 rounded-lg overflow-hidden">
              <span className="px-3 py-2 text-slate-500 bg-slate-100 border-r border-slate-300 select-none">
                okaynotice.com/blog/
              </span>
              <input
                type="text"
                value={slug}
                readOnly
                className="w-full px-3 py-2 bg-transparent outline-none text-slate-600"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Short Excerpt (For SEO & Cards)</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none resize-none h-20"
              placeholder="A brief summary of the article..."
              required
              maxLength={160}
            />
          </div>

          {/* Main Content */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Content (Use Markdown/HTML or plain text)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none h-64 md:h-96"
              placeholder="Write your full article here..."
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg transition flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Publishing...
              </>
            ) : (
              "Publish Post"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
