import { getAllPosts } from "@/lib/posts";
import { BlogPageClient } from "./blog-page-client";

export default function BlogPage() {
  const publishedPosts = getAllPosts()
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return <BlogPageClient posts={publishedPosts} />;
}
