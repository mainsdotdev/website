import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/posts";
import { SITE_SOCIAL_IMAGE } from "@/lib/social-image";
import { BlogPageClient } from "./blog-page-client";

const title = "The Mains Blog";
const description =
  "How Mains works under the hood: engineering notes, agent workflows, and the decisions behind the app.";

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
    images: [SITE_SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | Mains`,
    description,
    images: [SITE_SOCIAL_IMAGE],
  },
};

export default function BlogPage() {
  return <BlogPageClient posts={getBlogPosts()} />;
}
