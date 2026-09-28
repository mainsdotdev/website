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
import { ShareButton } from '@/components/share-button';

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
  const socialImage = post.image || '/og-image.jpg';
  const socialImageSize = getImageSize(socialImage);

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
          ...socialImageSize,
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

  const canonicalUrl = `https://mains.dev/blog/${post.slug}`;
  const imageUrl = new URL(
    post.image || '/og-image.jpg',
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
      <div className="min-h-screen max-w-8xl mx-auto bg-primary-950 ">
        <Header />

        <article className="px-4">
          <header className="mx-auto max-w-4xl pt-6 text-center">

            <h1 className="mt-6 text-4xl font-serif leading-[1.08] font-semibold tracking-tight text-white md:text-6xl">
              {post.title}
            </h1>




          </header>

          <div className="prose prose-invert prose-primary mx-auto mt-16 w-full max-w-200">
            <MDXContent source={post.content} />
          </div>
        </article>
      </div>
    </>
  );
}
