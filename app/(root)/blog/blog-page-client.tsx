/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState } from "react";
import type { Post } from "@/lib/types";
import Header from "@/components/header";
import { ArrowRight } from "@/components/icons";
import { FilterPill } from "@/components/filter-pill";
import { PostMeta } from "@/components/post-meta";

export function BlogPageClient({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState<"all" | "changelog" | "posts">("all");

  const filteredPosts = posts.filter((post) => {
    if (filter === "all") return true;
    if (filter === "changelog") return post.tags?.includes("changelog");
    if (filter === "posts") return !post.tags?.includes("changelog");
    return true;
  });

  return (
    <div className="min-h-screen bg-primary-950 max-w-7xl mx-auto  ">
                  <Header />
      
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Blog
          </h1>

          {/* Filter Chips */}
          <div className="flex gap-3">
            <FilterPill label="All" isActive={filter === "all"} onClick={() => setFilter("all")} />
            <FilterPill label="Changelog" isActive={filter === "changelog"} onClick={() => setFilter("changelog")} />
            <FilterPill label="Posts" isActive={filter === "posts"} onClick={() => setFilter("posts")} />
          </div>
        </div>

        {/* Posts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-primary-400 text-lg">
              No posts yet. Check back soon!
            </p>
          </div>
        )}
      </div>
      <hr className="border-primary-900  mt-12" />
      <hr className="border-primary-900  mt-0.5" />
    </div>
  );
}

function BlogCard({ post }: { post: Post }) {
  return (
    <Link
      href={post.url}
      className="group block bg-primary-900/30 border border-primary-800 rounded-xl overflow-hidden hover:border-primary-600 transition-all duration-300"
    >
      {/* Image/Visual */}
      {post.image ? (
        <div className="aspect-video relative overflow-hidden bg-primary-900">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video relative overflow-hidden bg-linear-to-br from-primary-800 to-primary-900 flex items-center justify-center">
          <div className="w-32 h-32 border-2 border-primary-600 rounded-full opacity-20" />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Meta Info */}
        <div className="flex items-center justify-between mb-4">
          <PostMeta date={post.date} author={post.author} />
          <ArrowRight className="w-5 h-5 text-primary-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-white mb-3 line-clamp-2 group-hover:text-primary-100 transition-colors">
          {post.title}
        </h2>

        {/* Description */}
        <p className="text-primary-400 text-sm line-clamp-2 leading-relaxed">
          {post.description}
        </p>
      </div>
    </Link>
  );
}
