"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase"; // Using your current Firebase config path
import { useAuth } from "@/components/context/AuthContext"; // Keeping the route secure
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import the UIW Markdown Editor
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

// We wrap the main logic in a component that consumes useSearchParams 
// to prevent Next.js hydration and suspense boundaries errors
function EditorForm() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get("id");
  const [mounted, setMounted] = useState(false);

  // ================= STATE =================
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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(!!editId);

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

  // ================= SLUG GENERATOR =================
  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

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

          // Map to the correct coverImage field used by our frontend
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

  // ================= IMAGE UPLOAD =================
  const uploadToCloudinary = async (file: File) => {
    try {
      const sigRes = await fetch("/api/cloudinary/blog-sign", { method: "POST" });

      if (!sigRes.ok) {
        throw new Error(`Signature API failed with status: ${sigRes.status}`);
      }

      const sigData = await sigRes.json();
      if (!sigData.cloudName || !sigData.signature) {
        throw new Error("Signature API is missing cloudName or signature");
      }

      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", sigData.apiKey);
      fd.append("timestamp", sigData.timestamp);
      fd.append("signature", sigData.signature);
      fd.append("folder", "kabale_blog"); 

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
        { method: "POST", body: fd }
      );

      const uploadData = await uploadRes.json();
      if (uploadData.error) throw new Error(uploadData.error.message);

      return uploadData.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      throw error; 
    }
  };

  // ================= EDITOR IMAGE PASTE =================
  const handleEditorPaste = async (event: any) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (!file) continue;

        try {
          const url = await uploadToCloudinary(file);
          setContent((prev) => prev + `\n\n![image](${url})\n\n`);
        } catch (err) {
          alert("Failed to upload pasted image.");
        }
      }
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !slug) return alert("Title required");
    if (!content) return alert("Content required");
    if (!editId && !imageFile && !existingImageUrl)
      return alert("Cover image required");

    setLoading(true);

    try {
      let finalImageUrl = existingImageUrl;

      if (imageFile) {
        finalImageUrl = await uploadToCloudinary(imageFile);
      }

      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

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
        // Update existing document
        await updateDoc(doc(db, "posts", editId), postData);
        alert("Article Updated ✅");
      } else {
        // Create new document using slug as the document ID for SEO-friendly URLs
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
      setLoading(false);
    }
  };

  if (!mounted || authLoading || pageLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p>Loading Editor...</p>
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
          {editId ? "Edit Article" : "Write New Article"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <input
              type="text"
              placeholder="Article Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!editId) setSlug(generateSlug(e.target.value));
              }}
              className="w-full p-4 border border-slate-200 rounded-xl font-bold text-xl focus:outline-none focus:border-blue-500"
            />

            <input
              type="text"
              placeholder="Slug"
              value={slug}
              onChange={(e) => setSlug(generateSlug(e.target.value))}
              className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-blue-500"
            />

            <div data-color-mode="light" className="border border-slate-200 rounded-xl overflow-hidden">
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || "")}
                onPaste={handleEditorPaste}
                height={600}
                preview="live"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              >
                <option value="Tech">Tech</option>
                <option value="Business">Business</option>
                <option value="Finance">Finance</option>
                <option value="Deals">Deals</option>
                <option value="Startups">Startups</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Tags</label>
              <input
                placeholder="Comma separated"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Read Time</label>
              <input
                placeholder="e.g. 4 min read"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Excerpt</label>
              <textarea
                placeholder="Short summary for the home page..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">SEO Meta Title</label>
              <input
                placeholder="Meta Title"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">SEO Meta Description</label>
              <textarea
                placeholder="Meta Description"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={3}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
            
            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-5 h-5 accent-blue-600"
              />
              <span className="font-bold text-slate-700">Feature this post</span>
            </label>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Cover Image</label>
            <label className="block cursor-pointer">
              <div className="h-48 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-blue-500 transition-colors rounded-xl overflow-hidden flex items-center justify-center relative">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Cover preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-slate-500 font-medium text-sm">Click to Upload Cover</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                hidden
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

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-blue-600 text-white rounded-xl font-black text-lg hover:bg-blue-700 transition-colors shadow-sm flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Publishing...
              </>
            ) : (
              "Publish Article"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// Wrap in Suspense boundary for Next.js useSearchParams
export default function CreatePostPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p>Loading...</p>
      </div>
    }>
      <EditorForm />
    </Suspense>
  );
}
