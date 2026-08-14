"use client";

import Link from "next/link";
import type { Post } from "@/lib/types";
import Header from "@/components/header";
import { ArrowRight } from "@/components/icons";
import { PostCard, PostVisual } from "@/components/post-card";
import { PostMeta } from "@/components/post-meta";

export function BlogPageClient({ posts }: { posts: Post[] }) {
  const [featuredPost, ...restPosts] = posts;

  return (
    <div className="min-h-screen bg-primary-950 max-w-7xl mx-auto  ">
                  <Header />

      <div className="max-w-7xl mx-auto px-4 pt-12">
        {/* Featured Post */}
        {featuredPost && <FeaturedCard post={featuredPost} />}

        {/* Posts Grid */}
        {restPosts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 mt-32 md:mt-40">
            {restPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-primary-400 text-lg">
              No posts yet. Check back soon!
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

function FeaturedCard({ post }: { post: Post }) {
  return (
    <Link href={post.url} className="group grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
      {/* Content */}
      <div className="order-2 lg:order-1 lg:col-span-2">
        <PostMeta date={post.date} className="flex items-center gap-2 text-xs text-primary-400 mb-4" />

        <h2 className="text-2xl md:text-3xl font-medium text-white leading-[1.15] tracking-tight mb-4">
          {post.title}
        </h2>

        <p className="text-primary-400 text-sm leading-relaxed max-w-md mb-8 line-clamp-3">
          {post.description}
        </p>

        <span className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium text-white glass-outline bg-primary-50/5 group-hover:bg-primary-50/10 transition-colors">
          Read More
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>

      {/* Image/Visual */}
      <PostVisual
        post={post}
        priority
        sizes="(max-width: 1024px) 100vw, 720px"
        className="order-1 lg:order-2 lg:col-span-3"
      />
    </Link>
  );
}
