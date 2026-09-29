"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { FADE_IN_UP } from "@/lib/animations";
import type { Post } from "@/lib/types";

type ChangelogSectionProps = {
  posts: Post[];
};

export function ChangelogSection({ posts }: ChangelogSectionProps) {
  const latestPost = posts[0];
  if (!latestPost) return null;

  return (
    <section aria-labelledby="changelog-title" className="px-5 py-24 sm:px-8 lg:py-32">
      <motion.div {...FADE_IN_UP} className="mx-auto max-w-360">
        <Link
          href="/changelog"
          aria-label={`View all release notes, including ${latestPost.title}`}
          className="group grid items-center gap-10 rounded-[28px] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-primary-500 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.85fr)] lg:gap-14 xl:gap-20"
        >
          <div className="rounded-[25px] border border-primary-700/15 bg-primary-900/60 p-2.5 shadow-[0_2px_16px_rgba(0,0,0,0.08)] transition-shadow duration-300 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] motion-reduce:transition-none">
            <div className="relative aspect-[1.35] overflow-hidden rounded-[18px] bg-primary-850 sm:aspect-[1.55] lg:aspect-[1.42]">
              {latestPost.image ? (
                <Image
                  src={latestPost.image}
                  alt={`${latestPost.title} release artwork`}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover object-[center_42%] transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-5xl text-primary-500/50">
                  Mains
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start py-1 lg:py-7">
            <p className="text-sm font-medium tracking-[0.06em] text-primary-500">
              Latest release{latestPost.version ? ` · v${latestPost.version}` : ""}
            </p>
            <h2
              id="changelog-title"
              className="mt-6 max-w-120 text-[clamp(2.4rem,3.2vw,3.75rem)] leading-[1.07] font-normal tracking-[-0.055em] text-primary-50"
            >
              {latestPost.title}
            </h2>
            <p className="mt-7 max-w-110 text-lg leading-relaxed text-primary-500 sm:text-xl">
              {latestPost.description}
            </p>
            <span className="mt-10 inline-flex items-center gap-3 rounded-full border border-primary-700/20 bg-primary-900 px-6 py-3 text-sm font-medium text-primary-100 transition-colors duration-200 group-hover:bg-primary-850 group-focus-visible:bg-primary-850 sm:text-base">
              View all release notes
              <ArrowRight aria-hidden="true" className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
            </span>
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
