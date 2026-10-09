import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Mains } from "@/components/icons";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * The developer page's blog section, after zed.dev's "The latest from Zed":
 * a header row, then the newest technical posts as cards. Technical posts
 * live in `content/blog`, apart from the release notes.
 */

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const LINE = "border-primary-50/8";
const CELL = "px-5 sm:px-8 lg:px-12";

function BlogCard({ post }: { post: Post }) {
  return (
    <Link
      href={post.url}
      className="group flex flex-col overflow-hidden rounded-xl glass-card transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
    >
      {/* The artwork in a dashed inner frame, as zed.dev frames its own. */}
      <div className="border-b border-primary-50/10 p-2">
        <div className="relative aspect-16/9 overflow-hidden rounded-md border border-dashed border-primary-50/12 bg-primary-950">
          {post.image ? (
            <Image
              src={post.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
            />
          ) : (
            <Mains aria-hidden className="absolute top-1/2 left-1/2 h-8 w-auto -translate-x-1/2 -translate-y-1/2 text-primary-700" />
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pt-4 pb-3.5">
        <h3 className="truncate text-base tracking-tight text-primary-50">{post.title}</h3>
        <p className="mt-1.5 line-clamp-2 font-mono text-[13px] leading-relaxed text-primary-400">
          {post.description}
        </p>

        <div className="mt-auto flex items-center gap-2 pt-4 font-mono text-[11px] text-primary-400">
          <span className="flex size-4.5 items-center justify-center rounded-full bg-primary-800">
            <Mains aria-hidden className="h-2 w-auto text-primary-100" />
          </span>
          <span className="truncate text-primary-300">{post.author ?? "Mains Team"}</span>
          <time dateTime={post.date} className="ml-auto shrink-0">
            {dateFormatter.format(new Date(post.date))}
          </time>
        </div>
      </div>
    </Link>
  );
}

export function DevBlogSection({ posts }: { posts: Post[] }) {
  return (
    <section aria-labelledby="dev-blog-title">
      <div className={cn("flex flex-col gap-6 border-b py-10 lg:flex-row lg:items-end lg:justify-between", LINE, CELL)}>
        <div className="max-w-xl">
          <h2 id="dev-blog-title" className="text-3xl tracking-tight text-primary-50 sm:text-4xl">
            From the blog
          </h2>
          <p className="mt-3 text-lg leading-snug text-primary-400">
            How Mains works under the hood: the performance work, the trade-offs, and what we
            measured along the way.
          </p>
        </div>
        <Link
          href="/blog"
          className="inline-flex shrink-0 items-center gap-1 self-start rounded-lg px-3 py-2 text-sm text-primary-50 transition-colors glass-button lg:self-auto"
        >
          View blog
          <ChevronRight aria-hidden className="size-3.5" />
        </Link>
      </div>

      <div className={cn("grid gap-5 py-10 sm:grid-cols-2 lg:grid-cols-3", CELL)}>
        {posts.slice(0, 3).map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
