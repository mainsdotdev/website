"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "@/components/icons";
import { PostCard } from "@/components/post-card";
import { SectionHeader } from "@/components/section-header";
import { FADE_IN_UP } from "@/lib/animations";
import type { Post } from "@/lib/types";

type ChangelogSectionProps = {
  posts: Post[];
};

export function ChangelogSection({ posts }: ChangelogSectionProps) {
  return (
    <section className="py-20">
      <motion.div {...FADE_IN_UP} className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex items-center justify-between gap-6">
          <SectionHeader title="Changelog" />

          <Link
            href="/blog"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm text-primary-300 transition-colors hover:text-white"
          >
            All posts
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post) => (
            <PostCard
              key={post.slug}
              post={post}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
