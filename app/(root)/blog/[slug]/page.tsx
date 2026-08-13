import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { extractToc } from '@/lib/toc';
import { notFound } from 'next/navigation';
import { MDXContent } from '@/components/mdx-content';
import { StructuredData } from '@/components/structured-data';
import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/header';
import { ChevronLeft } from '@/components/icons';
import { PostMeta } from '@/components/post-meta';
import { ShareButton } from '@/components/share-button';
import { TableOfContents } from '@/components/table-of-contents';

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

  const toc = extractToc(post.content);
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

        <article className="px-4">
          {/* Title block — centered above the two-column body */}
          <header className="mx-auto max-w-4xl pt-6 text-center">
            <div className="flex items-center justify-center gap-4 text-sm text-primary-400">
              <PostMeta
                date={post.date}
                dateFormat="MMMM dd, yyyy"
                className="text-sm text-primary-400"
              />
              {post.tags?.[0] && (
                <span className="text-primary-500">{post.tags[0]}</span>
              )}
            </div>

            <h1 className="mt-6 text-4xl leading-[1.08] font-semibold tracking-tight text-white md:text-6xl">
              {post.title}
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-primary-300">
              {post.description}
            </p>

            <div className="mt-12 flex items-center justify-between  pt-5">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-primary-400 transition-colors hover:text-white"
              >
                <ChevronLeft className="size-4" />
                Back to Blog
              </Link>

              <ShareButton title={post.title} url={post.url} />
            </div>
          </header>

          {/* Body — outline sits in the left gutter so the prose stays centered */}
          <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,50rem)_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              {/* Narrower than its column, so widening the prose never crowds it. */}
              <div className="sticky top-24 max-w-44">
                <TableOfContents items={toc} />
              </div>
            </aside>

            <div className="prose prose-invert prose-primary mx-auto max-w-3xl lg:mx-0 lg:max-w-none">
              <MDXContent source={post.content} />
            </div>

            <div className="hidden lg:block" />
          </div>
        </article>

        <hr className="border-primary-900  mt-12" />
        <hr className="border-primary-900  mt-0.5" />
      </div>
    </>
  );
}
