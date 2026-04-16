import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ChevronLeft, MoreVertical } from "lucide-react";
import ShareButtons from "@/components/blog/ShareButtons";
import FloatingLike from "@/components/blog/FloatingLike";

export const revalidate = 60;

async function getPost(slug: string) {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("slug", "==", slug), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const data = snapshot.docs[0].data();
  return { 
    id: snapshot.docs[0].id, 
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
  } as any;
}

async function getRelatedPosts(category: string, currentPostId: string) {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("category", "==", category), limit(4));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as any))
    .filter(post => post.id !== currentPostId)
    .slice(0, 3); // Return only 3 related posts
}

// 🚀 FULLY DYNAMIC SEO & OPEN GRAPH
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: "Post Not Found | OkayNotice",
      description: "The article you are looking for does not exist.",
    };
  }

  const postUrl = `https://okaynotice.com/blog/${post.slug}`;
  const ogImage = post.coverImage || "https://okaynotice.com/og-image.jpg";
  const publishedDate = post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString();

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author || "OkayNotice" }],
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      siteName: "OkayNotice",
      type: "article",
      publishedTime: publishedDate,
      authors: [post.author || "OkayNotice"],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

export default async function SinglePostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.category, post.id);

  // Format Date safely
  const timeAgo = post.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const defaultAvatar = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";

  return (
    <div className="bg-white min-h-screen pb-24">

      {/* Mobile Top Navigation (Matching Screenshot) */}
      <div className="md:hidden flex items-center justify-between px-4 py-4 sticky top-0 bg-white/90 backdrop-blur-md z-40">
        <Link href="/" className="text-slate-800">
          <ChevronLeft size={28} />
        </Link>
        <button className="text-slate-800">
          <MoreVertical size={24} />
        </button>
      </div>

      <article className="max-w-2xl mx-auto px-4 sm:px-6 pt-4 md:pt-12">

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight md:leading-tight">
          {post.title}
        </h1>

        {/* Editor Info & Share Row */}
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
              <img 
                src={post.authorImage || defaultAvatar} 
                alt="Editor" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">{post.author || "OkayNotice"}</p>
              <p className="text-slate-500 text-xs">{timeAgo}</p>
            </div>
          </div>

          <ShareButtons title={post.title} />
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative w-full aspect-[16/9] md:rounded-2xl overflow-hidden mb-10 -mx-4 md:mx-0 md:w-auto bg-slate-100">
            <Image 
              src={post.coverImage} 
              alt={post.title} 
              fill 
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content - Restored ReactMarkdown */}
        <div className="prose prose-lg prose-blue prose-img:rounded-none max-w-none mb-16 text-slate-800 leading-relaxed">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="bg-slate-50 py-12 border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-black text-slate-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost: any) => (
                <Link 
                  key={relatedPost.id} 
                  href={`/blog/${relatedPost.slug}`} 
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:border-blue-300 transition-all flex flex-col"
                >
                  <div className="aspect-[4/3] w-full bg-slate-100 overflow-hidden relative">
                    <img 
                      src={relatedPost.coverImage || "/api/placeholder/400/300"} 
                      alt={relatedPost.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Floating Interaction */}
      <FloatingLike postId={post.id} initialLikes={post.likes || 0} />

    </div>
  );
}
