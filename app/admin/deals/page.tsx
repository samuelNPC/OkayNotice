"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/context/AuthContext";
import ImageUpload from "@/components/admin/ImageUpload";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function AdminDeals() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [dealUrl, setDealUrl] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "deals"), {
        title, price, description, dealUrl, image,
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

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Link href="/admin" className="inline-flex items-center text-blue-600 mb-6 font-medium">
        <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
      </Link>
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Add New Deal</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageUpload onUploadSuccess={(url) => setImage(url)} />
          <input type="text" placeholder="Product Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-3 border rounded-lg" />
          <input type="text" placeholder="Price (e.g. 450,000)" value={price} onChange={e => setPrice(e.target.value)} required className="w-full p-3 border rounded-lg" />
          <input type="url" placeholder="Kabale Online Product Link" value={dealUrl} onChange={e => setDealUrl(e.target.value)} required className="w-full p-3 border rounded-lg" />
          <textarea placeholder="Brief Description" value={description} onChange={e => setDescription(e.target.value)} required className="w-full p-3 border rounded-lg h-24" />
          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-4 rounded-lg flex items-center justify-center">
            {loading ? <Loader2 className="animate-spin" /> : "Publish Deal"}
          </button>
        </form>
      </div>
    </div>
  );
}
