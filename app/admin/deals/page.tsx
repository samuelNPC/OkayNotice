"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/context/AuthContext";
import Link from "next/link";
import { ArrowLeft, Loader2, ImagePlus } from "lucide-react";

export default function AdminDeals() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [dealUrl, setDealUrl] = useState("");
  
  // Image states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, authLoading, mounted, router]);

  // The Secure Manual Upload Logic
  const uploadToCloudinary = async (file: File) => {
    // Hits your backend API route
    const sigRes = await fetch("/api/upload-image", { method: "POST" });
    if (!sigRes.ok) throw new Error("Signature API failed");

    const sigData = await sigRes.json();
    const fd = new FormData();
    fd.append("file", file);
    fd.append("api_key", sigData.apiKey);
    fd.append("timestamp", sigData.timestamp.toString());
    fd.append("signature", sigData.signature);
    fd.append("folder", "kabale_blog"); // Keeping consistent with your folder structure

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`, 
      { method: "POST", body: fd }
    );
    
    const uploadData = await uploadRes.json();
    if (uploadData.error) throw new Error(uploadData.error.message);
    return uploadData.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return alert("Please select a product image first");
    
    setLoading(true);
    try {
      // 1. Upload image manually first
      const finalImageUrl = await uploadToCloudinary(imageFile);

      // 2. Save deal to Firestore
      await addDoc(collection(db, "deals"), {
        title, 
        price, 
        description, 
        dealUrl, 
        image: finalImageUrl,
        createdAt: serverTimestamp(),
      });

      alert("Deal added successfully!");
      // Reset form
      setTitle(""); setPrice(""); setDescription(""); setDealUrl(""); 
      setImageFile(null); setPreviewUrl("");
      
    } catch (err: any) {
      alert("Error adding deal: " + err.message);
    } finally {
      setLoading(false);
    }
  };

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
          {/* Custom Image Picker */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Product Image</label>
            <label className="block cursor-pointer">
              <div className="h-56 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-blue-500 transition-colors rounded-xl overflow-hidden flex items-center justify-center relative">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <ImagePlus size={40} className="mb-2" />
                    <span className="text-sm font-medium">Select Gadget Image</span>
                  </div>
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
                  }
                }}
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Product Title</label>
            <input 
              type="text" 
              placeholder="e.g. iPhone 15 Pro Max - 256GB" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Price (UGX)</label>
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
            <label className="block text-sm font-bold text-slate-700 mb-1">Kabale Online Link</label>
            <input 
              type="url" 
              placeholder="https://www.kabaleonline.com/product/..." 
              value={dealUrl} 
              onChange={e => setDealUrl(e.target.value)} 
              required 
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Short Description</label>
            <textarea 
              placeholder="E.g. Brand new, 1 year warranty. Limited stock!" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              required 
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-none h-24" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-lg py-4 rounded-xl flex items-center justify-center transition disabled:bg-slate-400 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-6 h-6 mr-2" />
                Uploading Deal...
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
