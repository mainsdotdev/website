import Link from "next/link";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatPostDate } from "@/lib/format-date";
import { POST_LINK_FOCUS } from "./focus";

export function PostListItem({ post }: { post: Post }) {
  return (
    <Link href={post.url} className={cn("group flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8", POST_LINK_FOCUS)}>
      <div className="min-w-0">
        <h3 className="text-base tracking-tight text-primary-100 transition-colors group-hover:text-primary-50 sm:text-lg">
          {post.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-primary-400 sm:line-clamp-1 sm:text-base">
          {post.description}
        </p>
      </div>
      <time dateTime={post.date} className="shrink-0 text-sm text-primary-400">
        {formatPostDate(post.date)}
      </time>
    </Link>
  );
}
