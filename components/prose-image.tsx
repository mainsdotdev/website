/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { cn } from "@/lib/utils";

type ProseImageProps = {
  src?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  /** Rendered width, for picking a srcset entry. Defaults to full column. */
  sizes?: string;
  className?: string;
};

const DEFAULT_SIZES = "(max-width: 40rem) 100vw, 1088px";

/**
 * The `img` renderer for MDX posts. Given intrinsic dimensions it goes through
 * `next/image`, which negotiates AVIF/WebP and emits a srcset — a 1.3 MB
 * screenshot PNG lands as ~100 KB without touching the source file.
 *
 * Markdown's `![alt](src)` carries no dimensions and can't be optimized, so it
 * degrades to a plain lazy `<img>`. Prefer a JSX `<img width height>` in posts.
 */
export function ProseImage({
  src,
  alt = "",
  width,
  height,
  sizes = DEFAULT_SIZES,
  className,
}: ProseImageProps) {
  if (!src) return null;

  const intrinsicWidth = Number(width);
  const intrinsicHeight = Number(height);

  if (!intrinsicWidth || !intrinsicHeight) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={className}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={intrinsicWidth}
      height={intrinsicHeight}
      sizes={sizes}
      className={cn("h-auto w-full", className)}
    />
  );
}
