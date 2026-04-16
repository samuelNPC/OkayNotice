import { Metadata } from "next";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DealCard from "@/components/cards/DealCard";
import { ShoppingBag, ArrowRight, Tag } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Top Tech Deals & Gadgets in Uganda",
  description: "Discover the best handpicked gadget deals, smartphones, and laptops directly from Kabale Online.",
};

// Safe serialization to prevent Server Component crashes with Firebase Timestamps
const serializeDoc = (doc: any) => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
  };
};

async function getDeals() {
  try {
    const q = query(collection(db, "deals"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(serializeDoc);
  } catch (error) {
    console.error("Error fetching deals:", error);
    return [];
  }
}

export default async function DealsPage() {
  const deals = await getDeals();

  return (
    <div className="bg-white min-h-screen text-slate-900 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        
        {/* UPGRADED HERO SECTION */}
        <section className="border-b border-slate-200 pb-10 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center">
                <Tag size={14} className="mr-1" /> Verified Deals
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-4">
              Top Tech <span className="text-blue-700">Deals</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600">
              Handpicked gadgets, laptops, and mobile accessories at the best prices. All deals are verified and linked directly to Kabale Online.
            </p>
          </div>
          
          <a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-sm shrink-0"
          >
            Visit Kabale Online <ArrowRight size={20} className="ml-2" />
          </a>
        </section>

        {/* MAIN DEALS GRID */}
        {deals.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No active deals right now</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Check back later for exclusive discounts on the latest smartphones and accessories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {deals.map(deal => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
