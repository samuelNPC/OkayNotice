"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import { useAuth as useClerkAuth } from "@clerk/nextjs"; // 🚨 Imported Clerk Auth for the token
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import { ArrowLeft, Loader2, Send, Info, X } from "lucide-react"; 
import Link from "next/link";

const PREDEFINED_CATEGORIES = [
  "Politics", "Football", "Sports", "Local News", "World News",
  "Technology", "Artificial Intelligence", "Business", "Finance",
  "Real Estate", "Education", "Environment", "Health & Wellness",
  "Entertainment", "Lifestyle", "Startups", "Gadgets & Reviews",
  "Crypto & Web3", "Programming", "Travel"
];

export default function ContributorSubmitPage() {
  const { user, loading: authLoading } = useAuth();
  const { getToken } = useClerkAuth(); // 🚨 Extract the getToken function
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Technology");

  // Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Status & UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showHelp, setShowHelp] = useState(false); 

  useEffect(() => {
    setMounted(true);
  }, []);

  // Force login if not authenticated
  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.push("/login"); 
    }
  }, [user, authLoading, mounted, router]);

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, "-")
    );
  };

  // Upload cover image to Cloudflare R2 via your CDN API
  const uploadToR2 = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);

    const token = await getToken(); // 🚨 Retrieve the Clerk token

    const res = await fetch("https://api.etomu.com/api/upload", { 
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}` // 🚨 Send the token to Hono
      },
      body: fd
    });

    if (!res.ok) throw new Error("Image upload failed");
    const data = await res.json();
    return data.url; 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content || !excerpt) {
      setMessage({ type: "error", text: "Please fill in all required fields." });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      let coverImageUrl = "";
      if (imageFile) {
        coverImageUrl = await uploadToR2(imageFile);
      }

      const token = await getToken(); // 🚨 Retrieve the Clerk token

      const res = await fetch("https://api.etomu.com/api/posts/submissions", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` // 🚨 Send the token to Hono
        },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          category,
          coverImage: coverImageUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit article");

      setMessage({ 
        type: "success", 
        text: "Story submitted successfully! Our editorial team will review it shortly." 
      });

      // Clear form
      setTitle("");
      setSlug("");
      setExcerpt("");
      setContent("");
      setImageFile(null);
      setPreviewUrl("");

      setTimeout(() => router.push("/blog"), 3000);
    } catch (error: any) {
      setMessage({ type: "error", text: "Failed to submit story. Try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || authLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p>Loading editor...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/dashboard" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-50 transition">
          <ArrowLeft size={20} className="text-slate-600" />
        </Link>

        <div>
          <h1 className="text-2xl font-black text-slate-900">Build Your Career with Etomu</h1>
          <p className="text-sm text-slate-500">Submit your article draft to the Etomu Editorial Board for review.</p>
        </div>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-200">
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl border font-medium text-sm ${message.type === "error" ? "bg-red-50 border-red-100 text-red-600" : "bg-green-50 border-green-100 text-green-700"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Featured Cover Image</label>
            <label className="block cursor-pointer">
              <div className="h-52 w-full bg-slate-50 border-2 border-dashed border-slate-300 hover:border-blue-500 transition-colors rounded-2xl overflow-hidden flex items-center justify-center relative">
                {previewUrl ? (
                  <img src={previewUrl} alt="Cover preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <span className="text-slate-600 font-semibold text-sm block">Click to upload cover graphic</span>
                    <span className="text-slate-400 text-xs mt-1 block">Supports JPG, PNG, WEBP</span>
                  </div>
                )}
              </div>
              <input
                type="file" accept="image/*" hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    setPreviewUrl(URL.createObjectURL(file)); 
                  }
                }}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Article Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={handleTitleChange} 
                placeholder="e.g., The Future of Mobile Money in Uganda" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none bg-white cursor-pointer text-slate-900"
                required
              >
                {PREDEFINED_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-slate-700 mb-1">URL Slug</label>
             <input 
               type="text" 
               value={slug} 
               onChange={(e) => setSlug(e.target.value)} 
               placeholder="the-future-of-mobile-money" 
               className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 bg-slate-50" 
               required 
             />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Short Excerpt (Summary)</label>
            <textarea 
              value={excerpt} 
              onChange={(e) => setExcerpt(e.target.value)} 
              placeholder="Write a compelling 1-2 sentence summary of your piece..." 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none resize-none h-24 text-slate-900" 
              required 
              maxLength={160} 
            />
            <p className="text-xs text-slate-400 mt-1 text-right">{excerpt.length}/160 characters</p>
          </div>

          {/* 🚨 MARKDOWN EDITOR & HELP DROPDOWN */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-slate-700">Article Content (Markdown)</label>

              {/* Toggle Button */}
              <button 
                type="button" 
                onClick={() => setShowHelp(!showHelp)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 transition"
              >
                <Info size={14} />
                {showHelp ? "Hide Markdown Guide" : "How does the editor work?"}
              </button>
            </div>

            {/* Expandable Help Box */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showHelp ? 'max-h-[500px] mb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm text-slate-700 shadow-inner">
                <h4 className="font-bold text-slate-900 mb-3">Quick Markdown Formatting Guide</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <span className="font-semibold text-slate-900">Headings:</span>
                    <code className="block bg-white px-2 py-1 rounded text-blue-600 mt-1">## Heading 2</code>
                    <code className="block bg-white px-2 py-1 rounded text-blue-600 mt-1">### Heading 3</code>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Emphasis:</span>
                    <code className="block bg-white px-2 py-1 rounded text-blue-600 mt-1">**Bold text**</code>
                    <code className="block bg-white px-2 py-1 rounded text-blue-600 mt-1">*Italic text*</code>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Lists:</span>
                    <code className="block bg-white px-2 py-1 rounded text-blue-600 mt-1">- Bullet item 1</code>
                    <code className="block bg-white px-2 py-1 rounded text-blue-600 mt-1">1. Numbered item 1</code>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Links & Images:</span>
                    <code className="block bg-white px-2 py-1 rounded text-blue-600 mt-1">[Link Text](url)</code>
                    <p className="text-xs mt-1 text-slate-500">For images, use the picture icon in the editor toolbar.</p>
                  </div>
                </div>

                {/* Close Button inside the box */}
                <button 
                  type="button" 
                  onClick={() => setShowHelp(false)}
                  className="mt-4 flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold text-xs rounded-lg transition"
                >
                  <X size={14} /> Close Guide
                </button>
              </div>
            </div>

            <MarkdownEditor value={content} onChange={(val) => setContent(val)} />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/20 mt-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Submitting for Review...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Submit Story for Editorial Review</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
