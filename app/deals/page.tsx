import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DealCard from "@/components/cards/DealCard";

export const revalidate = 60;

export default async function DealsPage() {
  const snapshot = await getDocs(query(collection(db, "deals"), orderBy("createdAt", "desc")));
  const deals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];

  return (
    <div className="py-10">
      <h1 className="text-4xl font-bold text-center mb-4">Top Tech Deals</h1>
      <p className="text-slate-600 text-center mb-12">Handpicked gadget deals from Kabale Online for you.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {deals.map(deal => <DealCard key={deal.id} deal={deal} />)}
      </div>
    </div>
  );
}
