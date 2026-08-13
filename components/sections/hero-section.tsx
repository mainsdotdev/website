"use client";

import { motion, steps, useReducedMotion, type Variants } from "framer-motion";
import Image from "next/image";
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


const BACKGROUND_CODE_FRAGMENTS = [
  {
    className:
      "top-[13%] -left-20 -rotate-3 text-[#ACD3FF]/25 sm:left-[2%] xl:left-[4%]",
    lines: [
      "const workspace = await",
      "  mains.open({",
      "    repo,",
      '    branch: "main",',
      "  });",
    ],
  },
  {
    className:
      "top-[9%] -right-24 rotate-2 text-[#BDDCFF]/20 sm:right-[-4%] xl:right-[3%]",
    lines: [
      "for (const task of plan) {",
      "  await agent.run(task);",
      "  inspect(diff);",
      "}",
    ],
  },
  {
    className:
      "top-[34%] left-1/2 w-[min(760px,74vw)] -translate-x-1/2 -rotate-1 text-center text-[#C0DDFF]/[0.10]",
    lines: [
      "const release = await Promise.all(workspaces.map(run));",
      "plan  ·  inspect  ·  collaborate  ·  ship",
    ],
  },
  {
    className:
      "top-[39%] left-1/2 w-[min(520px,58vw)] -translate-x-1/2 rotate-1 text-center text-[#79B4F8]/[0.08]",
    lines: [
      "agent.on(\"change\", ({ diff }) => review(diff));",
      "status: ready   checks: passed   branch: main",
    ],
  },
  {
    className:
      "top-[44%] -left-28 rotate-1 text-[#78B2F5]/20 sm:left-[-4%] xl:left-[1%]",
    lines: [
      "$ git diff --stat",
      "src/agent.ts   | +42 -7",
      "src/relay.ts   | +18 -2",
      "",
      "ship({ confidence: true });",
    ],
  },
  {
    className:
      "top-[54%] -right-24 -rotate-2 text-[#9BCAFF]/20 sm:right-[-5%] xl:right-[1%]",
    lines: [
      "type Change = {",
      "  path: string;",
      '  status: "ready";',
      "};",
      "",
      "await review(changes);",
    ],
  },
  {
    className:
      "bottom-[3%] left-[4%] rotate-2 text-[#5A9FED]/15 xl:left-[8%]",
    lines: [
      "while (agent.active) {",
      "  const event = await next();",
      "  relay(event);",
      "}",
    ],
  },
] as const;

const STREAM_CONTAINER_VARIANTS: Variants = {
  hidden: {},
  visible: (delay = 0) => ({
    transition: {
      delayChildren: delay,
      staggerChildren: 0.033,
    },
  }),
};

const STREAM_CHARACTER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.173,
      ease: steps(1, "end"),
    },
  },
};

function HeroCodeTexture() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute top-[4%] right-[2%] size-80 rounded-full bg-[#0C0C0C]/10 blur-[90px]" />
      <div className="absolute bottom-[8%] left-[-4%] size-96 rounded-full bg-[#0C0C0C]/10 blur-[110px]" />

      {BACKGROUND_CODE_FRAGMENTS.map(({ className, lines }, fragmentIndex) => (
        <motion.pre
          key={lines[0]}
          custom={0.15 + fragmentIndex * 0.1}
          variants={STREAM_CONTAINER_VARIANTS}
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          className={cn(
            "absolute font-mono text-[10px] leading-[1.7] tracking-[0.14em] whitespace-pre select-none md:text-xs",
            "mask-[linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]",
            "[text-shadow:0_0_24px_rgba(62,152,255,0.26)]",
            className
          )}
        >
          {Array.from(lines.join("\n")).map((character, characterIndex) =>
            character === "\n" ? (
              <br key={`break-${characterIndex}`} />
            ) : (
              <motion.span
                key={`${character}-${characterIndex}`}
                variants={STREAM_CHARACTER_VARIANTS}
                className="inline-block will-change-opacity"
              >
                {character}
              </motion.span>
            )
          )}
        </motion.pre>
      ))}
    </div>
  );
}

function HeroBackground({ isDesktop }: { isDesktop: boolean }) {
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
        <span className="rounded-full border border-gray-300/20 px-2 py-0.5 text-[10px] uppercase tracking-tight text-gray-300 ">
          New
        </span>
        <span className="text-primary-50">
          Mains {post.version} •
        </span>
        <span className="hidden -ml-2 text-primary-50 sm:inline">
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

export function HeroSection({ latestPost }: { latestPost?: Post }) {
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
              <Image
                src="/hero2.png"
                alt="Mains desktop app"
                width={4094}
                height={2430}
                className="block h-auto w-full"
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
