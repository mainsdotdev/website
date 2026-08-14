"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/header";
import { ScrambleText } from "@/components/scramble-text";
import { ChevronRight, Github, Windows } from "@/components/icons";
import type { Post } from "@/lib/types";
import { MacDownloadButton } from "@/components/mac-download-button";
import { ShortcutPillButton } from "@/components/shortcut-pill-button";
import { FADE_IN_BLUR_DELAY, FADE_IN_BLUR_UP_DELAY } from "@/lib/animations";
import { MAINS_GITHUB_REPO_URL } from "@/lib/constants";
import { usePlatformDetection } from "@/hooks/usePlatformDetection";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

const HERO_SCRAMBLE_WORDS = ["all.", "agents.", "issues.", "bugs.", "PRs."] as const;
const HERO_SCRAMBLE_LONGEST = [...HERO_SCRAMBLE_WORDS].reduce((a, b) =>
  a.length >= b.length ? a : b
);
const PILL_CLASS_NAME =
  "inline-flex max-w-full min-w-0 items-center gap-2 rounded-full px-3 py-3 text-xs font-medium transition-colors md:px-6 md:py-3 md:text-sm";

// Blues sampled from the hero screenshot's night-sky wallpaper (dominant hue
// ~212°), so the page glow reads as an extension of the image behind it.






function HeroBackground({  }: { isDesktop: boolean }) {
  // Blurred blobs are pure compositor work — keep them still on phones, where
  // the smaller viewport hides most of the movement anyway.

  return (
    <>

      <div aria-hidden className="absolute inset-0 z-0 bg-linear-to-b from-black via-transparent to-primary-950" />
      {/* {isDesktop && <HeroCodeTexture />} */}
    </>
  );
}

function HeroReleaseBadge({ post }: { post: Post }) {
  return (
    <motion.div {...FADE_IN_BLUR_DELAY(0.1)} className="relative z-10 mb-8">
      <Link
        href={post.url}
        className="group flex items-center gap-1 rounded-full glass-outline  py-1.5 pr-1.5 pl-2 text-xs transition-colors hover:bg-primary-900/10 sm:gap-3 sm:text-sm"
      >
        <span className="rounded-full border bg-primary-50 border-gray-300/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-tight text-primary-950 ">
          New
        </span>
        <span className="text-primary-50">
          Mains {post.version} •
        </span>
        <span className=" sm:-ml-2 text-primary-50 ">
          {"Tasks"}
        </span>
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-50/5 text-primary-100 transition-transform group-hover:translate-x-0.5">
          <ChevronRight className="size-3.5" />
        </span>
      </Link>
    </motion.div>
  );
}

function HeroHeadline() {
  return (
    <motion.div
      {...FADE_IN_BLUR_DELAY(0.2)}
      className="relative z-10 w-full max-w-2xl text-center"
    >
      <h1 className="font-sans relative mx-auto inline-block w-max max-w-full text-[2rem] leading-[1.15] font-normal tracking-tight text-primary-50/95 sm:text-4xl md:text-5xl lg:text-[3.25rem]">
        <span
          aria-hidden
          className="invisible flex flex-nowrap items-baseline justify-start gap-x-1.5"
        >
          <span>Mains for</span>
          <span>{HERO_SCRAMBLE_LONGEST}</span>
        </span>
        <span className="absolute inset-0 flex min-w-0 flex-nowrap items-baseline justify-start gap-x-1.5 overflow-hidden">
          <span className="shrink-0">Mains for</span>
          <ScrambleText
            words={[...HERO_SCRAMBLE_WORDS]}
            interval={3000}
            className="text-gray-300"
          />
        </span>
      </h1>
      <p className="mt-8 text-base leading-relaxed text-primary-100">
        Run AI coding agents in secure workspaces. Inspect changes, collaborate with agents,
        and ship with confidence.
      </p>
    </motion.div>
  );
}

function HeroActions({ isMac }: { isMac: boolean }) {
  return (
    <motion.div
      {...FADE_IN_BLUR_DELAY(0.45)}
      className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-4"
    >
      {isMac ? (
        <MacDownloadButton
          pillClassName={PILL_CLASS_NAME}
          shortcutClassName="bg-primary-100 text-primary-950"
        />
      ) : (
        <ShortcutPillButton
          ariaLabel="Windows version coming soon (shortcut D)"
          className={cn(PILL_CLASS_NAME, "cursor-default bg-primary-900/50 text-primary-500")}
          shortcut="D"
          shortcutClassName="bg-primary-800 text-primary-300"
        >
          <Windows width={16} height={16} />
          <span>Windows — Coming Soon</span>
        </ShortcutPillButton>
      )}

      <ShortcutPillButton
        href={MAINS_GITHUB_REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        kbdShortcut="github"
        ariaLabel="View source on GitHub (shortcut C)"
        className={cn(
          PILL_CLASS_NAME,
          "bg-primary-950 text-white hover:bg-primary-950",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30"
        )}
        shortcut="C"
        shortcutClassName="bg-primary-800/20 text-primary"
      >
        <Github width={16} height={16} />
        <span>View Source</span>
      </ShortcutPillButton>
    </motion.div>
  );
}

export function HeroSection({
  latestPost,
  appWindow,
}: {
  latestPost?: Post;
  /**
   * The desktop-window mockup, rendered on the server and handed down as a
   * node — importing it here would drag its markdown renderer into this
   * client component's bundle.
   */
  appWindow?: React.ReactNode;
}) {
  const { isMac } = usePlatformDetection();
  // `pointer: fine` keeps tablets out: an iPad is wide enough to pass a width
  // query but rasterizes the blur/filter work on a phone-class GPU.
  const isDesktop = useMediaQuery("(min-width: 64rem) and (pointer: fine)");

  return (
    <div className="relative overflow-hidden">
      <HeroBackground isDesktop={isDesktop} />
      <div className="relative z-10">
        <Header />
        <section className="mx-auto max-w-7xl px-6 pt-10 pb-20">
          <div className="relative flex flex-col items-center text-center">
            {/* Center glow behind headline */}
            <div
              aria-hidden
              className="pointer-events-none absolute top-[-8%] left-1/2 h-[min(420px,55vw)] w-[min(720px,92vw)] -translate-x-1/2 rounded-full bg-gray-400/10 blur-[90px]"
            />

            {latestPost && <HeroReleaseBadge post={latestPost} />}
            <HeroHeadline />
            <HeroActions isMac={isMac} />

            <motion.div
              {...FADE_IN_BLUR_UP_DELAY(0.75)}
              className="relative z-10 mt-14 w-full max-w-6xl sm:rounded-[10px] sm:overflow-hidden"
            >
              {appWindow}
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
