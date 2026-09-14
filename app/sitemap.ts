import type { MetadataRoute } from "next";
import { getAllLegalDocs } from "@/lib/legal";
import { getAllPosts } from "@/lib/posts";
import { getSupportDoc } from "@/lib/support";

const SITE_URL = "https://mains.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const latestPostDate = posts[0]?.date;
  const legal = getAllLegalDocs();

  return [
    {
      url: SITE_URL,
      lastModified: latestPostDate,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: latestPostDate,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}${post.url}`,
      lastModified: post.date,
    })),
    {
      url: `${SITE_URL}/support`,
      lastModified: getSupportDoc().updated,
    },
    {
      url: `${SITE_URL}/legal`,
      lastModified: legal[0]?.updated,
    },
    ...legal.map((doc) => ({
      url: `${SITE_URL}/${doc.slug}`,
      lastModified: doc.updated,
    })),
  ];
}
