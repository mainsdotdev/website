import Image from 'next/image';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { getImageSize } from '@/lib/image-size';
import { notFound } from 'next/navigation';
import { MDXContent } from '@/components/mdx-content';
import { StructuredData } from '@/components/structured-data';
import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/header';
import { ChevronLeft } from '@/components/icons';
import { PostMeta } from '@/components/post-meta';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPosts()
    .filter((post) => post.published)
    .map((post) => ({
      slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || !post.published) {
    return {
      title: 'Post Not Found',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = `/blog/${post.slug}`;
  const socialImage = post.image || '/hero-new-image.png';

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonicalUrl,
      siteName: 'Mains',
      type: 'article',
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      images: [
        {
          url: socialImage,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [socialImage],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  const coverSize = post.image ? getImageSize(post.image) : null;
  const canonicalUrl = `https://mains.dev/blog/${post.slug}`;
  const imageUrl = new URL(
    post.image || '/hero-new-image.png',
    'https://mains.dev'
  ).toString();
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    image: imageUrl,
    url: canonicalUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    author: {
      '@type': 'Organization',
      name: post.author || 'Mains Team',
      url: 'https://mains.dev',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Mains',
      url: 'https://mains.dev',
      logo: {
        '@type': 'ImageObject',
        url: 'https://mains.dev/logo.png',
      },
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="min-h-screen max-w-7xl mx-auto bg-primary-950 ">
        <Header />
      
        <article className="max-w-5xl mx-auto px-4">
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

        {/* Cover Image — the LCP element, so it loads eagerly at high priority
            while everything below the fold stays lazy. */}
        {post.image && coverSize && (
          <div className="mb-12 rounded-lg  overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              width={coverSize.width}
              height={coverSize.height}
              sizes="(max-width: 40rem) 100vw, 1088px"
              priority
              className="w-full h-auto  mx-auto"
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
    </>
  );
}
