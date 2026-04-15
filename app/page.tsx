import Link from "next/link";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PostCard from "@/components/cards/PostCard";
import DealCard from "@/components/cards/DealCard";
import { Calculator, Smartphone, TrendingUp, ArrowRight } from "lucide-react";

export const revalidate = 60;

async function getHomeData() {
  const postsQ = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(3));
  const dealsQ = query(collection(db, "deals"), orderBy("createdAt", "desc"), limit(3));
  
  const [postsSnap, dealsSnap] = await Promise.all([getDocs(postsQ), getDocs(dealsQ)]);
  
  return {
    posts: postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[],
    deals: dealsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[]
  };
}

export default async function Home() {
  const { posts, deals } = await getHomeData();

  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="text-center py-12 space-y-6">
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight">
          Stay <span className="text-blue-600">Noticed.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
          The ultimate hub for Uganda's tech news, financial calculators, and the best deals from Kabale Online.
        </p>
      </section>

      {/* Tools Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ToolLink href="/tools/momo-charges-calculator" icon={<Smartphone className="text-yellow-500" />} title="MoMo Charges" desc="MTN & Airtel Fee Calculator" />
        <ToolLink href="/tools/loan-calculator" icon={<Calculator className="text-blue-500" />} title="Loan Calculator" desc="Estimate monthly repayments" />
        <ToolLink href="/tools/profit-calculator" icon={<TrendingUp className="text-green-500" />} title="Profit Margin" desc="Business profit tools" />
      </section>

      {/* Latest Blog Posts */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold">Latest Stories</h2>
          <Link href="/blog" className="text-blue-600 font-semibold flex items-center">All Posts <ArrowRight size={18} className="ml-1"/></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      </section>

      {/* Top Deals */}
      <section className="bg-slate-900 -mx-4 px-4 py-16 sm:-mx-8 sm:px-8 rounded-[3rem]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-white">Hot Deals</h2>
            <Link href="/deals" className="text-blue-400 font-semibold flex items-center">Shop All <ArrowRight size={18} className="ml-1"/></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {deals.map(deal => <DealCard key={deal.id} deal={deal} />)}
          </div>
        </div>
      </section>
    </div>
  );
}

function ToolLink({ href, icon, title, desc }: any) {
  return (
    <Link href={href} className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition group">
      <div className="mb-4 p-3 bg-slate-50 w-fit rounded-2xl group-hover:scale-110 transition">{icon}</div>
      <h3 className="text-xl font-bold mb-1">{title}</h3>
      <p className="text-slate-500 text-sm">{desc}</p>
    </Link>
  );
}
