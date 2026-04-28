import { motion } from "framer-motion";
import Link from "next/link";
import { ChangelogCard } from "@/components/changelog-card";
import { FADE_IN_UP } from "@/lib/animations";
import type { Post } from "@/lib/types";

export function ChangelogSection({ posts }: { posts: Post[] }) {
  return (
    <section className="py-20 ">
      <motion.div
        {...FADE_IN_UP}
        className="max-w-7xl mx-auto px-4"
      >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-snug font-sans mb-4">
          Changelog
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <ChangelogCard
              description={post.description || ''}
              key={post.slug}
              version={post.version || '1.0'}
              date={new Date(post.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
              title={post.title}
              url={post.url}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/blog?filter=changelog"
            className="inline-flex items-center gap-2 text-primary-200 hover:text-primary-50 text-sm font-medium transition-colors"
          >
            See what&apos;s new in Mains →
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
