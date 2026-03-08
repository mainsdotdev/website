import { motion } from "framer-motion";
import { ChangelogCard } from "@/components/changelog-card";
import type { Post } from "@/lib/types";

export function ChangelogSection({ posts }: { posts: Post[] }) {
  return (
    <section className="py-20 ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-4"
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
          <a
            href="/blog?filter=changelog"
            className="inline-flex items-center gap-2 text-primary-200 hover:text-primary-50 text-sm font-medium transition-colors"
          >
            See what&apos;s new in Jinzo →
          </a>
        </div>
      </motion.div>
    </section>
  );
}
