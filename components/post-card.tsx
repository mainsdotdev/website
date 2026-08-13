import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { PostMeta } from "@/components/post-meta";
import { cn } from "@/lib/utils";

type PostVisualProps = {
  post: Post;
  className?: string;
  /** Defaults to the three/four-up grid; override for the featured slot. */
  sizes?: string;
  priority?: boolean;
};

/** A post's cover, or a neutral placeholder when frontmatter has no image. */
export function PostVisual({
  post,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority,
}: PostVisualProps) {
  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden rounded-3xl bg-primary-900 glass-outline",
        className
      )}
    >
      {post.image ? (
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary-800 to-primary-900">
          <div className="size-32 rounded-full border-2 border-primary-600 opacity-20" />
        </div>
      )}
    </div>
  );
}

/** Cover above, date and title below — the grid unit of the blog and changelog. */
export function PostCard({
  post,
  className,
  sizes,
}: {
  post: Post;
  className?: string;
  sizes?: string;
}) {
  return (
    <Link href={post.url} className={cn("group block", className)}>
      <PostVisual post={post} sizes={sizes} />

      <div className="mt-4">
        <PostMeta
          date={post.date}
          className="mb-2 flex items-center gap-2 text-xs text-primary-400"
        />
        <h3 className="line-clamp-2 text-base text-primary-100 transition-colors group-hover:text-white">
          {post.title}
        </h3>
      </div>
    </Link>
  );
}
