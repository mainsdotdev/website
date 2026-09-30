"use client";

import type { Post } from "@/lib/types";
import HeaderSpacer from "@/components/header-spacer";
import { PostCard } from "@/components/post-card";

export function BlogPageClient({ posts }: { posts: Post[] }) {
  return (
    <div className="min-h-screen bg-primary-950">
      <HeaderSpacer />

      <main className="mx-auto max-w-360 px-5 pb-32 pt-24 sm:px-8 lg:pt-32">
        <h1 className="mb-12 text-center text-4xl font-normal tracking-tight text-primary-50 sm:text-5xl lg:mb-16">
          Release notes
        </h1>

        {posts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 lg:gap-20">
            {posts.map((post, index) => (
              <PostCard
                key={post.slug}
                post={post}
                priority={index === 0}
                headingLevel="h2"
              />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-lg text-primary-400">
            No posts yet. Check back soon!
          </p>
        )}
      </main>
    </div>
  );
}
