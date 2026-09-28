"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FADE_IN_UP } from "@/lib/animations";
import type { Post } from "@/lib/types";

type ChangelogSectionProps = {
  posts: Post[];
};

function releaseDate(date: string) {
  const day = date.slice(0, 10);
  const formatted = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${day}T12:00:00Z`));

  return `${formatted}, '${day.slice(2, 4)}`;
}

function ReleaseArtwork({ post }: { post: Post }) {
  // The 0.13 cover is still being prepared. Keep the latest release visible
  // with an editorial placeholder instead of requesting its missing file.
  if (post.slug === "mains-0-13-release") {
    return (
      <div className="relative flex h-full flex-col items-center overflow-hidden bg-primary-850 px-6 pt-9 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary-500">
          Your space in Mains
        </span>
        <p className="relative z-10 mt-6 max-w-xs text-4xl leading-[1.05] text-primary-50 sm:text-[2.6rem]">
          Make room for what&apos;s next.
        </p>
        <div className="mt-8 w-full max-w-xs rounded-xl border border-primary-700/30 bg-primary-900 p-3 text-left shadow-[0_16px_40px_-24px_var(--demo-shadow)]">
          <div className="mb-3 flex gap-1.5">
            <span className="size-1.5 rounded-full bg-primary-500" />
            <span className="size-1.5 rounded-full bg-primary-500/65" />
            <span className="size-1.5 rounded-full bg-primary-500/40" />
          </div>
          <div className="flex gap-3">
            <div className="h-20 w-12 shrink-0 rounded-md bg-primary-800" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-2 w-3/4 rounded-full bg-primary-700/50" />
              <div className="h-2 w-full rounded-full bg-primary-700/30" />
              <div className="h-2 w-2/3 rounded-full bg-primary-700/30" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post.image) {
    return (
      <div className="flex h-full items-center justify-center bg-primary-850  text-6xl text-primary-500/40">
        Mains
      </div>
    );
  }

  return (
    <Image
      src={post.image}
      alt={`${post.title} release artwork`}
      fill
      sizes="(min-width: 1280px) 480px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
      className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
    />
  );
}

function ReleaseCard({ post }: { post: Post }) {
  const number = post.version?.split(".").at(-1)?.padStart(3, "0");
  const title = post.title.replace(/^Mains\s+\d+(?:\.\d+)*:\s*/i, "");

  return (
    <Link
      href={post.url}
      aria-label={`Read release notes: ${post.title}`}
      className="group block h-97.5 overflow-hidden rounded-[1.4rem] border border-primary-700/25 bg-primary-900 px-5 pt-9 shadow-[0_16px_60px_-28px_var(--demo-shadow)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary-700/45 hover:shadow-[0_24px_70px_-28px_var(--demo-shadow)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500 sm:h-102.5 sm:px-6 lg:h-100 xl:h-107.5"
    >
      <div className="flex items-center justify-center gap-2 whitespace-nowrap font-mono text-[10px] tracking-tight text-primary-500 sm:text-[11px]">
        <time dateTime={post.date}>{releaseDate(post.date)}</time>
        {number && (
          <>
            <span aria-hidden="true" className="text-primary-700">·</span>
            <span>No. {number}</span>
          </>
        )}
        {post.version && (
          <>
            <span aria-hidden="true" className="text-primary-700">·</span>
            <span>v{post.version}</span>
          </>
        )}
      </div>

      <h3 className="mx-auto mt-5 flex min-h-16 max-w-sm items-center justify-center text-balance text-center text-[2rem] leading-[1.05] text-primary-50 sm:text-[2.2rem] xl:text-[2.5rem]">
        {title}
      </h3>

      <div className="relative mt-5 aspect-4/3 overflow-hidden rounded-[1.1rem] border border-primary-700/15 bg-primary-850">
        <ReleaseArtwork post={post} />
      </div>
    </Link>
  );
}

export function ChangelogSection({ posts }: ChangelogSectionProps) {
  const latestPosts = posts.slice(0, 3);
  if (latestPosts.length === 0) return null;

  return (
    <section aria-labelledby="changelog-title" className="px-5 py-24 sm:px-8 lg:py-32">
      <motion.div {...FADE_IN_UP} className="mx-auto max-w-390">
        <h2
          id="changelog-title"
          className="mb-12 text-center text-4xl font-normal tracking-tight text-primary-50 sm:text-5xl lg:mb-16"
        >
          Past releases
        </h2>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 lg:gap-6">
          {latestPosts.map((post) => (
            <ReleaseCard key={post.slug} post={post} />
          ))}
        </div>

        <div className="mt-12 flex justify-center lg:mt-14">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-primary-700/20 bg-primary-900 px-6 py-3 text-sm font-medium text-primary-100 transition-colors hover:bg-primary-850 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500 sm:text-base"
          >
            View all release notes <span aria-hidden="true" className="text-xl leading-none">+</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
