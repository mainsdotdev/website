"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FADE_IN_UP } from "@/lib/animations";
import type { Post } from "@/lib/types";
import { PostCard } from "@/components/post-card";
import { ArrowRight } from "../icons";

type ChangelogSectionProps = {
  posts: Post[];
};

export function ChangelogSection({ posts }: ChangelogSectionProps) {
  const latestPosts = posts.slice(0, 3);
  if (latestPosts.length === 0) return null;

  return (
    <section
      aria-labelledby="changelog-title"
      className="px-5 py-24 sm:px-8 lg:py-32"
    >
      <motion.div {...FADE_IN_UP} className="mx-auto max-w-360">
        <h2
          id="changelog-title"
          className="mb-12 text-center text-4xl font-normal tracking-tight text-primary-50 sm:text-5xl lg:mb-16"
        >
          Past releases
        </h2>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 lg:gap-20">
          {latestPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <div className="mt-12 flex justify-center lg:mt-14">
          <Link
            href="/blog"
            className="inline-flex group items-center gap-2 rounded-full border border-primary-700/20 bg-primary-900 px-6 py-3 text-sm font-medium text-primary-100 transition-colors hover:bg-primary-850 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500 sm:text-base"
          >
            View all release notes{" "}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />

          </Link>
        </div>
      </motion.div>
    </section>
  );
}
