import Image from "next/image";

interface DealCardProps {
  deal: {
    id: string;
    title: string;
    price: string;
    dealUrl: string;
    image: string;
    description: string;
  };
}

export default function DealCard({ deal }: DealCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      <div className="relative h-48 w-full bg-slate-50">
        <Image 
          src={deal.image} 
          alt={deal.title} 
          fill 
          className="object-contain p-4"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-900 mb-1">{deal.title}</h3>
        <p className="text-blue-600 font-bold text-xl mb-2">UGX {deal.price}</p>
        <p className="text-slate-500 text-sm mb-6 line-clamp-2">{deal.description}</p>
        
        <a 
          href={deal.dealUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-auto w-full bg-orange-500 hover:bg-orange-600 text-white text-center font-bold py-3 rounded-lg transition shadow-sm"
        >
          View on Kabale Online
        </a>
      </div>
    </div>
  );
}
