"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/context/AuthContext";
import MarkdownEditor from "@/components/admin/MarkdownEditor"; // Using your newly fixed editor
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

function EditorForm() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get("id");
  const [mounted, setMounted] = useState(false);

  // ================= STATE (ALL FIELDS RESTORED) =================
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Tech");
  const [tags, setTags] = useState("");
  const [readTime, setReadTime] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  // Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(!!editId);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Security Check
  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, authLoading, mounted, router]);

  // Auto-generate slug
  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  // ================= LOAD EDIT MODE =================
  useEffect(() => {
    if (!editId) return;

    const fetchPost = async () => {
      try {
        const snap = await getDoc(doc(db, "posts", editId));
        if (snap.exists()) {
          const d = snap.data();
          setTitle(d.title || "");
          setSlug(d.slug || editId);
          setContent(d.content || "");
          setCategory(d.category || "Tech");
          setTags(d.tags ? d.tags.join(", ") : "");
          setReadTime(d.readTime || "");
          setExcerpt(d.excerpt || "");
          setMetaTitle(d.metaTitle || "");
          setMetaDescription(d.metaDescription || "");
          setIsFeatured(d.isFeatured || false);

          if (d.coverImage) {
            setExistingImageUrl(d.coverImage);
            setPreviewUrl(d.coverImage);
          }
        }
      } catch {
        alert("Failed to load article");
      } finally {
        setPageLoading(false);
      }
    };

    fetchPost();
  }, [editId]);

  // ================= CLOUDINARY UPLOAD =================
  const uploadToCloudinary = async (file: File) => {
    const sigRes = await fetch("/api/cloudinary/blog-sign", { method: "POST" });
    if (!sigRes.ok) throw new Error("Signature API failed");
    
    const sigData = await sigRes.json();
    const fd = new FormData();
    fd.append("file", file);
    fd.append("api_key", sigData.apiKey);
    fd.append("timestamp", sigData.timestamp);
    fd.append("signature", sigData.signature);
    fd.append("folder", "kabale_blog"); 

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`, {
      method: "POST", body: fd
    });
    const uploadData = await uploadRes.json();
    if (uploadData.error) throw new Error(uploadData.error.message);
    return uploadData.secure_url;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) return alert("Title and Slug required");
    if (!content) return alert("Content required");
    if (!editId && !imageFile && !existingImageUrl) return alert("Cover image required");

    setIsSubmitting(true);

    try {
      let finalImageUrl = existingImageUrl;
      if (imageFile) {
        finalImageUrl = await uploadToCloudinary(imageFile);
      }

      const tagsArray = tags.split(",").map((t) => t.trim()).filter(Boolean);

      const postData = {
        title,
        slug,
        content,
        category,
        tags: tagsArray,
        readTime,
        excerpt,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
        isFeatured,
        coverImage: finalImageUrl,
        author: user?.displayName || "OkayNotice",
        authorEmail: user?.email,
        updatedAt: serverTimestamp(),
        published: true,
      };

      if (editId) {
        await updateDoc(doc(db, "posts", editId), postData);
        alert("Article Updated ✅");
      } else {
        await setDoc(doc(db, "posts", slug), {
          ...postData,
          createdAt: serverTimestamp(),
          views: 0,
          likes: 0,
        });
        alert("Article Published 🎉");
      }
      router.push("/admin");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || authLoading || pageLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p>Verifying access...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6">
      
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/admin" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-50 transition">
          <ArrowLeft size={20} className="text-slate-600" />
        </Link>
        <h1 className="text-3xl font-black text-slate-900">
          {editId ? "Edit Article" : "Create New Post"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!editId) setSlug(generateSlug(e.target.value));
                }}
                placeholder="e.g. Top 5 Phones in Uganda"
                className="w-full p-4 border border-slate-200 rounded-xl font-bold text-xl focus:ring-2 focus:ring-blue-600 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">URL Slug</label>
              <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-600">
                <span className="px-4 py-3 text-slate-500 bg-slate-100 border-r border-slate-200 select-none">
                  okaynotice.com/blog/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  className="w-full px-4 py-3 bg-transparent outline-none text-slate-700"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Article Content</label>
              <MarkdownEditor value={content} onChange={setContent} />
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Settings & SEO */}
        <div className="space-y-6">
          
          {/* Cover Image Upload */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-bold text-slate-700 mb-3">Cover Image</label>
            <label className="block cursor-pointer">
              <div className="h-48 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-blue-500 transition-colors rounded-xl overflow-hidden flex items-center justify-center relative">
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
                    setPreviewUrl("");
                  }
                }}
              />
            </label>
          </div>

          {/* Details & SEO */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              >
                <option value="Tech">Tech</option>
                <option value="Finance">Finance</option>
                <option value="Deals">Deals</option>
                <option value="Business">Business</option>
                <option value="Startups">Startups</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Tags</label>
              <input
                type="text"
                placeholder="Gadgets, Reviews, MTN"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Read Time</label>
              <input
                type="text"
                placeholder="e.g. 4 min read"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Short Excerpt</label>
              <textarea
                placeholder="Summary for the home page..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">SEO Meta Title</label>
              <input
                type="text"
                placeholder="For Google Search"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">SEO Meta Description</label>
              <textarea
                placeholder="For Google Search"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={2}
                className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>
            
            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-5 h-5 accent-blue-600"
              />
              <span className="font-bold text-slate-700">Set as Featured Post</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black text-lg py-4 rounded-xl transition flex items-center justify-center shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-6 h-6 mr-2" />
                Publishing...
              </>
            ) : (
              "Publish Post"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// Wrapper to satisfy Next.js Suspense boundary for useSearchParams
export default function CreatePostPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p>Loading Editor...</p>
      </div>
    }>
      <EditorForm />
    </Suspense>
  );
}
