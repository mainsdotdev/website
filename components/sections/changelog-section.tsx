"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChangelogCard } from "@/components/changelog-card";
import { SectionHeader } from "@/components/section-header";
import { FADE_IN_UP } from "@/lib/animations";
import type { Post } from "@/lib/types";

type ChangelogSectionProps = {
  posts: Post[];
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function ChangelogSection({ posts }: ChangelogSectionProps) {
  return (
    <section className="py-20">
      <motion.div {...FADE_IN_UP} className="mx-auto max-w-7xl px-6">
        <SectionHeader title="Changelog" className="mb-10" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <ChangelogCard
              key={post.slug}
              date={dateFormatter.format(new Date(post.date))}
              description={post.description || ""}
              title={post.title}
              url={post.url}
              version={post.version || "1.0"}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-200 transition-colors hover:text-primary-50"
          >
            See what&apos;s new in Mains <span aria-hidden="true">→</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
