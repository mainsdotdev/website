import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

const SITE_URL = "https://mains.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const latestPostDate = posts[0]?.date;

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
  ];
}
