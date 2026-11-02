import Link from "next/link";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatPostDate } from "@/lib/format-date";
import { ChevronRight } from "@/components/icons";
import { PostArtwork } from "./post-artwork";
import { POST_LINK_FOCUS } from "./focus";

export function PostPreview({ post }: { post: Post }) {
  return (
    <Link href={post.url} className={cn("group block rounded-xl", POST_LINK_FOCUS)}>
      <PostArtwork post={post} />
      <div className="mt-4 flex items-center gap-2 text-xs text-primary-400 sm:text-sm">
        {post.tags?.[0] && (
          <>
            <span className="capitalize">{post.tags[0]}</span>
            <span aria-hidden>·</span>
          </>
        )}
        <time dateTime={post.date}>{formatPostDate(post.date)}</time>
      </div>
      <h3 className="mt-2 text-base leading-snug tracking-tight text-primary-100 transition-colors group-hover:text-primary-50 sm:text-lg">
        {post.title}
        <ChevronRight aria-hidden className="ml-1 inline size-3.5 align-baseline text-primary-400 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
      </h3>
    </Link>
  );
}
