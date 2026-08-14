import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { BlogPageClient } from "./blog-page-client";

const title = "AI Coding Agent Workflows & Product Updates";
const description =
  "Practical guides for running AI coding agents, reviewing their work, and managing isolated Git workspaces—plus the latest Mains product updates.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: `${title} | Mains`,
    description,
    url: "/blog",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mains AI coding agent workspace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | Mains`,
    description,
    images: ["/og-image.jpg"],
  },
};

export default function BlogPage() {
  const publishedPosts = getAllPosts()
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return <BlogPageClient posts={publishedPosts} />;
}
