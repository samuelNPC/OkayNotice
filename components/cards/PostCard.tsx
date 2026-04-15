import Link from "next/link";
import Image from "next/image";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string;
    category: string;
    createdAt?: any;
  };
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
      {/* Cover Image */}
      <div className="relative w-full h-48 overflow-hidden bg-slate-100">
        {post.coverImage ? (
          <Image 
            src={post.coverImage} 
            alt={post.title} 
            fill 
            className="object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">No Image</div>
        )}
        <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">
          {post.title}
        </h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="mt-auto text-blue-600 text-sm font-semibold flex items-center">
          Read Article &rarr;
        </div>
      </div>
    </Link>
  );
}
