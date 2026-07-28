"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Header from "@/components/header";
import { ScrambleText } from "@/components/scramble-text";
import { Github, GrainOverlay, Windows } from "@/components/icons";
import { MacDownloadButton } from "@/components/mac-download-button";
import { ShortcutPillButton } from "@/components/shortcut-pill-button";
import { FADE_IN_BLUR_DELAY, FADE_IN_BLUR_UP_DELAY } from "@/lib/animations";
import { MAINS_GITHUB_REPO_URL } from "@/lib/constants";
import { usePlatformDetection } from "@/hooks/usePlatformDetection";
import { cn } from "@/lib/utils";

const HERO_SCRAMBLE_WORDS = ["all.", "agents.", "issues.", "bugs.", "PRs."] as const;
const HERO_SCRAMBLE_LONGEST = [...HERO_SCRAMBLE_WORDS].reduce((a, b) =>
  a.length >= b.length ? a : b
);
const HERO_BACKGROUND_BLOBS = [
  {
    className:
      "top-[-10%] left-[-5%] h-[60%] w-[50%] bg-[#0e122c] opacity-60",
    animation: "blob-float-1 20s ease-in-out infinite",
  },
  {
    className:
      "top-[10%] left-[20%] h-[70%] w-[60%] bg-[#080C25] opacity-70",
    animation: "blob-float-2 25s ease-in-out infinite",
  },
  {
    className:
      "top-[5%] right-[-5%] h-[50%] w-[40%] bg-[#060534] opacity-50",
    animation: "blob-float-3 22s ease-in-out infinite",
  },
  {
    className:
      "right-[-5%] bottom-[-10%] h-[60%] w-[55%] bg-[#121735] opacity-65",
    animation: "blob-float-1 28s ease-in-out infinite reverse",
  },
  {
    className:
      "top-[30%] left-[30%] h-[40%] w-[40%] bg-[#06091E] opacity-80",
    animation: "blob-float-2 24s ease-in-out infinite reverse",
  },
] as const;

const PILL_CLASS_NAME =
  "inline-flex max-w-full min-w-0 items-center gap-2 rounded-full px-3 py-3 text-xs font-medium transition-colors md:px-6 md:py-3 md:text-sm";
const GITHUB_BUTTON_CLASS_NAME = cn(
  PILL_CLASS_NAME,
  "bg-primary-950 text-white hover:bg-primary-950",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30"
);

function HeroBackground() {
  return (
    <>
      <div className="absolute inset-0 z-0 bg-[#0E1331]">
        {HERO_BACKGROUND_BLOBS.map(({ className, animation }) => (
          <div
            key={animation}
            className={cn("absolute rounded-full blur-[90px]", className)}
            style={{ animation }}
          />
        ))}
      </div>
      <GrainOverlay className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.05]" />
      <div className="absolute inset-0 z-0 bg-linear-to-b from-black via-transparent to-primary-950" />
    </>
  );
}

function HeroHeadline() {
  return (
    <motion.div
      {...FADE_IN_BLUR_DELAY(0.2)}
      className="relative z-10 w-full max-w-2xl text-center"
    >
      <h1 className="relative mx-auto inline-block w-max max-w-full font-sans text-[2rem] leading-[1.15] font-normal tracking-tight text-primary-50/95 sm:text-4xl md:text-5xl lg:text-[3.25rem]">
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
            className="text-sky-200"
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

export function HeroSection() {
  const { isMac } = usePlatformDetection();

  return (
    <div className="relative overflow-hidden">
      <HeroBackground />
      <div className="relative z-10">
        <Header />
        <section className="mx-auto max-w-7xl px-6 pt-10 pb-20">
          <div className="relative flex flex-col items-center text-center">
            <div
              aria-hidden
              className="pointer-events-none absolute top-[-8%] left-1/2 h-[min(420px,55vw)] w-[min(720px,92vw)] -translate-x-1/2 rounded-full bg-sky-500/[0.07] blur-[100px]"
            />
            <HeroHeadline />

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
                  className={cn(
                    PILL_CLASS_NAME,
                    "cursor-default bg-primary-900/50 text-primary-500"
                  )}
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
                className={GITHUB_BUTTON_CLASS_NAME}
                shortcut="C"
                shortcutClassName="bg-primary-800/20 text-primary"
              >
                <Github width={16} height={16} />
                <span>View Source</span>
              </ShortcutPillButton>
            </motion.div>

            <motion.div
              {...FADE_IN_BLUR_UP_DELAY(0.75)}
              className="relative z-10 mt-14 w-full max-w-7xl sm:rounded-xl sm:overflow-hidden"
            >
              <Image
                src="/hero3.png"
                alt="Mains desktop app"
                width={3600}
                height={2068}
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
