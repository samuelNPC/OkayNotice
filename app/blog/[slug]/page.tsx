import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notFound } from "next/navigation";

// Revalidate page occasionally to get fresh content
export const revalidate = 60;

async function getPost(slug: string) {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("slug", "==", slug), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;
  
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as any;
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function SinglePostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound(); // Triggers the Next.js 404 page
  }

  return (
    <article className="max-w-3xl mx-auto py-10">
      {/* Category Tag & Date */}
      <div className="flex items-center space-x-4 mb-6">
        <span className="bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          {post.category}
        </span>
        <Link href="/blog" className="text-slate-500 hover:text-blue-600 text-sm font-medium transition">
          &larr; Back to blog
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
        {post.title}
      </h1>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative w-full h-[300px] md:h-[450px] rounded-2xl overflow-hidden mb-10 shadow-sm border border-slate-200">
          <Image 
            src={post.coverImage} 
            alt={post.title} 
            fill 
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Post Content */}
      <div className="prose prose-lg prose-slate max-w-none mb-12 bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-slate-200">
        {/* We use dangerouslySetInnerHTML to render basic HTML tags (like <br> or <h2>) from the mobile textarea */}
        <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br />") }} />
      </div>

      {/* AdSense Placement Area */}
      <div className="w-full h-24 bg-slate-200 flex items-center justify-center text-slate-400 rounded-lg text-sm mb-10">
        [AdSense Article Footer Slot]
      </div>
    </article>
  );
}
