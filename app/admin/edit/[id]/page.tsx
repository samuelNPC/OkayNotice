"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/context/AuthContext";
import ImageUpload from "@/components/admin/ImageUpload";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

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
  const [category, setCategory] = useState("Tech");
  const [coverImage, setCoverImage] = useState("");
  
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

  // Fetch the existing post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", params.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setSlug(data.slug || "");
          setExcerpt(data.excerpt || "");
          setContent(data.content || "");
          setCategory(data.category || "Tech");
          setCoverImage(data.coverImage || "");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const docRef = doc(db, "posts", params.id);
      await updateDoc(docRef, {
        title,
        slug,
        excerpt,
        content,
        category,
        coverImage,
      });

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
            <ImageUpload onUploadSuccess={(url) => setCoverImage(url)} defaultImage={coverImage} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none bg-white">
                <option value="Tech">Tech</option>
                <option value="Finance">Finance</option>
                <option value="Deals">Deals</option>
              </select>
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
