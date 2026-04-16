import { Metadata } from "next";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ShoppingBag, ArrowRight, Tag } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Top Tech Deals & Gadgets in Uganda",
  description: "Discover the best handpicked gadget deals, smartphones, and laptops directly from Kabale Online.",
};

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
      {/* Notice we removed the side padding here so the mobile grid can go true edge-to-edge */}
      <div className="max-w-6xl mx-auto pt-10">

        {/* HERO SECTION - Padding applied here instead of parent, removed borders */}
        <section className="pb-8 mb-4 flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 uppercase tracking-wide flex items-center">
                <Tag size={14} className="mr-1" /> Verified Deals
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-4">
              Top Tech <span className="text-blue-700">Deals</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
              Looking for an upgrade? We scour the market to bring you the best discounts on smartphones, laptops, and tech accessories. All items are verified and seamlessly fulfilled through our trusted e-commerce platform, <strong>Kabale Online</strong>.
            </p>
          </div>

          <a 
            href="https://kabale.online" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 transition-colors shrink-0 rounded-lg md:rounded-none"
          >
            Visit Kabale Online <ArrowRight size={20} className="ml-2" />
          </a>
        </section>

        {/* MAIN DEALS GRID */}
        {deals.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 flex flex-col items-center mx-4 sm:mx-6 rounded-2xl">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No active deals right now</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Check back later for exclusive discounts on the latest smartphones and accessories.
            </p>
          </div>
        ) : (
          /* Mobile: 1px gap on gray background creates a classic seamless e-commerce grid. Desktop: standard spacing */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[1px] sm:gap-6 bg-slate-200 sm:bg-transparent border-t border-b border-slate-200 sm:border-none sm:px-6">
            {deals.map(deal => (
              <a 
                key={deal.id} 
                href={deal.url || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group bg-white flex flex-col sm:border sm:border-slate-200 sm:hover:border-blue-300 hover:shadow-md transition-all duration-300"
              >
                {/* Edge-to-edge image, perfectly square */}
                <div className="aspect-square relative w-full overflow-hidden bg-slate-50">
                  <img 
                    src={deal.image} 
                    alt={deal.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>

                {/* Content area */}
                <div className="p-3 sm:p-4 flex flex-col flex-grow sm:border-t sm:border-slate-100">
                  <h3 className="text-sm md:text-base font-bold text-slate-900 line-clamp-2 mb-1 leading-snug group-hover:text-blue-700 transition-colors">
                    {deal.title}
                  </h3>

                  {deal.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                      {deal.description}
                    </p>
                  )}

                  <p className="text-blue-700 font-black text-base md:text-lg mt-auto pt-2">
                    UGX {deal.price}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
