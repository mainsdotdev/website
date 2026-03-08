/* eslint-disable @next/next/no-img-element */
import { allPosts } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { MDXContent } from '@/components/mdx-content';
import { Metadata } from 'next';
import Link from 'next/link';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = allPosts.find((post) => post.slug === slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - Jinzo Blog`,
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
  const post = allPosts.find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-primary-950 pt-20">
      <article className="max-w-4xl mx-auto px-4">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-200 mb-8 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
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
          <div className="flex items-center gap-4 text-primary-400 text-sm">
            <time dateTime={post.date}>
              {format(new Date(post.date), 'MMMM dd, yyyy')}
            </time>
            {post.author && (
              <>
                <span>•</span>
                <span>{post.author}</span>
              </>
            )}
          </div>

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
          <MDXContent code={post.body.code} />
        </div>

      </article>
            <hr className="border-primary-900  mt-12" />
      <hr className="border-primary-900  mt-0.5" />
    </div>
  );
}
