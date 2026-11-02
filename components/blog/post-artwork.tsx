import Image from "next/image";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Mains } from "@/components/icons";

export function PostArtwork({
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
