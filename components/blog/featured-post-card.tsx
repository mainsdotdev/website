import Link from "next/link";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatPostDate } from "@/lib/format-date";
import { Mains } from "@/components/icons";
import { PostArtwork } from "./post-artwork";
import { POST_LINK_FOCUS } from "./focus";

export function FeaturedPostCard({ post, large = false }: { post: Post; large?: boolean }) {
  const readingMinutes = Math.max(1, Math.ceil(post.content.trim().split(/\s+/).length / 220));

  return (
    <Link href={post.url} className={cn("group block overflow-hidden rounded-xl glass-card", POST_LINK_FOCUS)}>
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
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
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
