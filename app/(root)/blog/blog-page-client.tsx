import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";
import HeaderSpacer from "@/components/header-spacer";
import { ChevronRight, Mains } from "@/components/icons";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-6 focus-visible:outline-primary-500";

function PostArtwork({
  post,
  priority = false,
  framed = true,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
}: {
  post: Post;
  priority?: boolean;
  framed?: boolean;
  sizes?: string;
}) {
  return (
    <div className={cn("relative aspect-16/9 overflow-hidden bg-primary-900", framed && "rounded-xl glass-outline")}>
      {post.image ? (
        <Image
          src={post.image}
          alt=""
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
        />
      ) : (
        <Mains aria-hidden className="absolute top-1/2 left-1/2 h-10 w-auto -translate-x-1/2 -translate-y-1/2 text-primary-500" />
      )}
    </div>
  );
}

function FeaturedPostCard({ post, large = false }: { post: Post; large?: boolean }) {
  const readingMinutes = Math.max(1, Math.ceil(post.content.trim().split(/\s+/).length / 220));

  return (
    <Link href={post.url} className={cn("group block overflow-hidden rounded-xl glass-card", FOCUS)}>
      <PostArtwork
        post={post}
        priority={large}
        framed={false}
        sizes={large
          ? "(min-width: 1440px) 900px, (min-width: 1024px) 66vw, 100vw"
          : "(min-width: 1440px) 450px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
      />
      <div className={cn("p-5", large && "sm:p-6")}>
        <div className="flex flex-wrap items-center gap-1.5 text-sm text-primary-400">
          <time dateTime={post.date}>{dateFormatter.format(new Date(post.date))}</time>
          {post.tags?.[0] && (
            <>
              <span aria-hidden>·</span>
              <span className="capitalize">{post.tags[0]}</span>
            </>
          )}
        </div>
        <h2 className={cn("mt-2 leading-snug tracking-tight text-primary-50", large ? "text-2xl sm:text-3xl" : "text-xl")}>
          {post.title}
        </h2>
        <p className={cn("mt-2 leading-relaxed text-primary-400", large ? "text-base sm:text-lg" : "line-clamp-2 text-sm")}>
          {post.description}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-primary-400 sm:text-sm">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-800">
            <Mains aria-hidden className="h-2.5 w-auto text-primary-100" />
          </span>
          <span className="truncate">{post.author ?? "Mains Team"}</span>
          <span aria-hidden>·</span>
          <span className="shrink-0">{readingMinutes} min read</span>
        </div>
      </div>
    </Link>
  );
}

function PostPreview({ post }: { post: Post }) {
  return (
    <Link href={post.url} className={cn("group block rounded-xl", FOCUS)}>
      <PostArtwork post={post} />
      <div className="mt-4 flex items-center gap-2 text-xs text-primary-400 sm:text-sm">
        {post.tags?.[0] && (
          <>
            <span className="capitalize">{post.tags[0]}</span>
            <span aria-hidden>·</span>
          </>
        )}
        <time dateTime={post.date}>{dateFormatter.format(new Date(post.date))}</time>
      </div>
      <h3 className="mt-2 text-base leading-snug tracking-tight text-primary-100 transition-colors group-hover:text-primary-50 sm:text-lg">
        {post.title}
        <ChevronRight aria-hidden className="ml-1 inline size-3.5 align-baseline text-primary-400 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
      </h3>
    </Link>
  );
}

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
                {posts.map((post) => (
                  <Link key={post.slug} href={post.url} className={cn("group flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8", FOCUS)}>
                    <div className="min-w-0">
                      <h3 className="text-base tracking-tight text-primary-100 transition-colors group-hover:text-primary-50 sm:text-lg">
                        {post.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-primary-400 sm:line-clamp-1 sm:text-base">
                        {post.description}
                      </p>
                    </div>
                    <time dateTime={post.date} className="shrink-0 text-sm text-primary-400">
                      {dateFormatter.format(new Date(post.date))}
                    </time>
                  </Link>
                ))}
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
