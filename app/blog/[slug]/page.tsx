import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { ChevronLeft, MoreVertical, Tag } from "lucide-react";
import ShareButtons from "@/components/blog/ShareButtons";
import FloatingLike from "@/components/blog/FloatingLike";

async function getPost(slug: string) {
  try {
    const res = await fetch(`https://api.etomu.com/api/posts/${slug}`, { 
      next: { revalidate: 60 } 
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.post;
  } catch (error) {
    return null;
  }
}

async function getRelatedPosts(category: string, currentPostId: string) {
  try {
    const res = await fetch(`https://api.etomu.com/api/posts?category=${encodeURIComponent(category)}&limit=4`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts.filter((post: any) => post.id !== currentPostId).slice(0, 3);
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: "Post Not Found | Etomu News",
      description: "The article you are looking for does not exist.",
    };
  }

  const postUrl = `https://news.etomu.com/blog/${post.slug}`;
  const ogImage = post.coverImage || "https://news.etomu.com/og-image.jpg";
  const publishedDate = post.createdAt || new Date().toISOString();
  const displayTitle = post.metaTitle || post.title;
  const displayDescription = post.metaDescription || post.excerpt;

  return {
    title: displayTitle,
    description: displayDescription,
    authors: [{ name: post.author || "EtomuNews" }],
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: displayTitle,
      description: displayDescription,
      url: postUrl,
      siteName: "Etomu News",
      type: "article",
      publishedTime: publishedDate,
      authors: [post.author || "EtomuNews"],
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
      title: displayTitle,
      description: displayDescription,
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

  const postDate = new Date(post.createdAt || Date.now());
  const timeAgo = postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const defaultAvatar = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Mobile Top Navigation */}
      <div className="md:hidden flex items-center justify-between px-4 py-4 sticky top-0 bg-white/90 backdrop-blur-md z-40 border-b border-slate-100">
        <Link href="/" className="text-slate-800">
          <ChevronLeft size={28} />
        </Link>
        <button className="text-slate-800">
          <MoreVertical size={24} />
        </button>
      </div>

      <article className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 md:pt-12">
        {/* Category Tag */}
        {post.category && (
          <div className="mb-4">
            <Link href={`/blog?category=${post.category}`} className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 uppercase tracking-wider hover:bg-blue-100 transition-colors">
              {post.category}
            </Link>
          </div>
        )}

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight md:leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 overflow-hidden bg-slate-100 border border-slate-200">
              <img 
                src={post.authorImage || defaultAvatar} 
                alt="Editor" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">{post.author || "Etomu Reporter"}</p>
              <p className="text-slate-500 text-xs">
                {timeAgo} {post.readTime && <span className="mx-1 font-bold text-slate-300">•</span>} <span className="text-blue-600 font-medium">{post.readTime}</span>
              </p>
            </div>
          </div>
          <ShareButtons title={post.title} />
        </div>

        {post.coverImage && (
          <div className="relative mb-10 overflow-hidden">
            <div className="relative w-full aspect-video md:aspect-[21/9] -mx-4 md:mx-0 bg-slate-100 border-y md:border md:border-slate-200 md:rounded-2xl overflow-hidden shadow-sm">
              <Image 
                src={post.coverImage} 
                alt={post.title} 
                fill 
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
            </div>
            <div className="mt-3 px-2 md:px-0">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                Featured Visual • Etomu News
              </p>
            </div>
          </div>
        )}

        <div className="prose prose-lg max-w-none mb-10 
          text-slate-800 leading-relaxed
          prose-headings:text-brand-dark prose-headings:font-black prose-headings:tracking-tight
          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-l-4 prose-h2:border-blue-600 prose-h2:pl-4
          prose-p:mb-6 prose-p:text-slate-700
          prose-strong:text-brand-dark prose-strong:font-extrabold
          prose-img:rounded-none prose-img:border prose-img:border-slate-200
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-bold
        ">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeRaw]}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-16 pt-6 border-t border-slate-100">
            <div className="w-full flex items-center text-slate-400 text-sm font-bold uppercase mb-2">
              <Tag size={16} className="mr-2" /> Tags
            </div>
            {post.tags.map((tag: string, index: number) => (
              <span key={index} className="bg-slate-50 border border-slate-200 text-slate-600 text-sm font-medium px-4 py-1 hover:border-blue-300 hover:text-blue-700 transition-colors cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {relatedPosts.length > 0 && (
        <section className="bg-slate-50 py-12 border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-black text-slate-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost: any) => (
                <Link 
                  key={relatedPost.id} 
                  href={`/blog/${relatedPost.slug}`} 
                  className="group bg-white overflow-hidden border border-slate-200 hover:border-blue-300 transition-all flex flex-col"
                >
                  <div className="aspect-[4/3] w-full bg-slate-100 overflow-hidden relative border-b border-slate-100">
                    <img 
                      src={relatedPost.coverImage || "/api/placeholder/400/300"} 
                      alt={relatedPost.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <FloatingLike postId={post.id} initialLikes={post.likes || 0} />
    </div>
  );
}
