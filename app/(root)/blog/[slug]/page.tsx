/* eslint-disable @next/next/no-img-element */
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { MDXContent } from '@/components/mdx-content';
import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/header';
import { ChevronLeft } from '@/components/icons';
import { PostMeta } from '@/components/post-meta';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - Mains Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 bg-primary-950 ">
            <Header />
      
      <article className=" px-4">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-200 mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-12">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 bg-primary-800 text-primary-300 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {post.title}
          </h1>

          {/* Meta */}
          <PostMeta
            date={post.date}
            author={post.author}
            dateFormat="MMMM dd, yyyy"
            className="flex items-center gap-4 text-primary-400 text-sm"
          />

          {/* Description */}
          <p className="text-primary-300 text-lg mt-4">{post.description}</p>
        </header>

        {/* Cover Image */}
        {post.image && (
          <div className="mb-12 rounded-lg overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-invert prose-primary max-w-none">
          <MDXContent source={post.content} />
        </div>

      </article>
            <hr className="border-primary-900  mt-12" />
      <hr className="border-primary-900  mt-0.5" />
    </div>
  );
}
