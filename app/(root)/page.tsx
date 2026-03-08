import { getAllPosts } from "@/lib/posts";
import { HomeClient } from "./home-client";

export default function Home() {
  const changelogPosts = getAllPosts()
    .filter((post) => post.published && post.tags?.includes('changelog'))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  return <HomeClient changelogPosts={changelogPosts} />;
}
