"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/context/AuthContext";
import ImageUpload from "@/components/admin/ImageUpload";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function AdminDeals() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [dealUrl, setDealUrl] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  // Hydration sync
  useEffect(() => {
    setMounted(true);
  }, []);

  // Security Check & Redirect
  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, authLoading, mounted, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "deals"), {
        title, 
        price, 
        description, 
        dealUrl, 
        image,
        createdAt: serverTimestamp(),
      });
      alert("Deal added successfully!");
      setTitle(""); setPrice(""); setDescription(""); setDealUrl(""); setImage("");
    } catch (err) {
      alert("Error adding deal");
    } finally {
      setLoading(false);
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
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Link href="/admin" className="inline-flex items-center text-blue-600 mb-6 font-medium hover:underline">
        <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
      </Link>
      
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Add New Deal</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Product Image</label>
            <ImageUpload onUploadSuccess={(url) => setImage(url)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product Title</label>
            <input 
              type="text" 
              placeholder="e.g. Samsung Galaxy S24 Ultra" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Price (UGX)</label>
            <input 
              type="text" 
              placeholder="e.g. 4,500,000" 
              value={price} 
              onChange={e => setPrice(e.target.value)} 
              required 
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kabale Online Link</label>
            <input 
              type="url" 
              placeholder="https://kabaleonline.com/product/..." 
              value={dealUrl} 
              onChange={e => setDealUrl(e.target.value)} 
              required 
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Short Description</label>
            <textarea 
              placeholder="Why is this a good deal?" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              required 
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-none h-24" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg flex items-center justify-center transition disabled:bg-green-400"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Publishing Deal...
              </>
            ) : (
              "Publish Deal"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
