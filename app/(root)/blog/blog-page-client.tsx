import type { Post } from "@/lib/types";
import HeaderSpacer from "@/components/header-spacer";
import { FeaturedPostCard } from "@/components/blog/featured-post-card";
import { PostListItem } from "@/components/blog/post-list-item";
import { PostPreview } from "@/components/blog/post-preview";

export function BlogPageClient({ posts }: { posts: Post[] }) {
  const featured = posts[0];
  const sidePosts = posts.slice(1, 3);
  const recentPosts = posts.slice(3, 7);

  return (
    <div className="min-h-screen bg-primary-950">
      <HeaderSpacer />

      <main className="mx-auto max-w-360 px-5 pt-10 pb-24 sm:px-8 sm:pt-14 lg:pt-16 lg:pb-32">
        <h1 className="sr-only">The Mains Blog</h1>

        {featured ? (
          <>
            <section aria-label="Featured posts" className="grid items-start gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <FeaturedPostCard post={featured} large />
              </div>
              {sidePosts.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {sidePosts.map((post) => <FeaturedPostCard key={post.slug} post={post} />)}
                </div>
              )}
            </section>

            {recentPosts.length > 0 && (
              <section aria-label="Recent posts" className="mt-14 grid gap-x-6 gap-y-10 sm:mt-16 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
                {recentPosts.map((post) => <PostPreview key={post.slug} post={post} />)}
              </section>
            )}

            <section aria-labelledby="all-posts-title" className="mt-16 sm:mt-20 lg:mt-24">
              <h2 id="all-posts-title" className="mb-7 text-2xl tracking-tight text-primary-50 sm:mb-9 sm:text-3xl">
                All posts
              </h2>
              <div className="divide-y divide-primary-50/10">
                {posts.map((post) => <PostListItem key={post.slug} post={post} />)}
              </div>
            </section>
          </>
        ) : (
          <p className="py-20 text-center text-lg text-primary-400">
            No posts yet. Check back soon!
          </p>
        )}
      </main>
    </div>
  );
}
