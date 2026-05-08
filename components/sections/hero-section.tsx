"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Header from "@/components/header";
import { ScrambleText } from "@/components/scramble-text";
import { Apple, Github, GrainOverlay, Windows } from "@/components/icons";
import { ShortcutPillButton } from "@/components/shortcut-pill-button";
import { FADE_IN_BLUR_DELAY, FADE_IN_BLUR_UP_DELAY } from "@/lib/animations";
import { MAINS_DOWNLOAD_DMG_URL, MAINS_GITHUB_REPO_URL } from "@/lib/constants";
import { usePlatformDetection } from "@/hooks/usePlatformDetection";
import { cn } from "@/lib/utils";

const HERO_SCRAMBLE_WORDS = ["all.", "agents.", "issues.", "bugs.", "PRs."] as const;
const HERO_SCRAMBLE_LONGEST = [...HERO_SCRAMBLE_WORDS].reduce((a, b) =>
  a.length >= b.length ? a : b
);

export function HeroSection() {
  const { isMac } = usePlatformDetection();

  const pill =
    "inline-flex max-w-full min-w-0 items-center gap-2 rounded-full md:px-6 md:py-3 md:text-sm px-3 py-3 text-xs font-medium transition-colors";

  return (
    <div className="relative overflow-hidden">
      {/* Gradient Blur Background */}
      <div className="absolute inset-0 z-0 bg-[#0E1331]">
        <div
          className="absolute top-[-10%] left-[-5%] h-[60%] w-[50%] rounded-full bg-[#0e122c] opacity-60 blur-[90px]"
          style={{ animation: "blob-float-1 20s ease-in-out infinite" }}
        />
        <div
          className="absolute top-[10%] left-[20%] h-[70%] w-[60%] rounded-full bg-[#080C25] opacity-70 blur-[90px]"
          style={{ animation: "blob-float-2 25s ease-in-out infinite" }}
        />
        <div
          className="absolute top-[5%] right-[-5%] h-[50%] w-[40%] rounded-full bg-[#060534] opacity-50 blur-[90px]"
          style={{ animation: "blob-float-3 22s ease-in-out infinite" }}
        />
        <div
          className="absolute right-[-5%] bottom-[-10%] h-[60%] w-[55%] rounded-full bg-[#121735] opacity-65 blur-[90px]"
          style={{ animation: "blob-float-1 28s ease-in-out infinite reverse" }}
        />
        <div
          className="absolute top-[30%] left-[30%] h-[40%] w-[40%] rounded-full bg-[#06091E] opacity-80 blur-[90px]"
          style={{ animation: "blob-float-2 24s ease-in-out infinite reverse" }}
        />
      </div>
      {/* Noise/Grain Overlay */}
      <GrainOverlay className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.05]" />
      <div className="absolute inset-0 z-0 bg-linear-to-b from-black via-transparent to-primary-950" />
      <div className="relative z-10">
        <Header />
        <section className="mx-auto max-w-7xl px-6 pt-10 pb-20">
          <div className="relative flex flex-col items-center text-center">
            {/* Center glow behind headline */}
            <div
              aria-hidden
              className="pointer-events-none absolute top-[-8%] left-1/2 h-[min(420px,55vw)] w-[min(720px,92vw)] -translate-x-1/2 rounded-full bg-sky-500/[0.07] blur-[100px]"
            />

            <motion.div
              {...FADE_IN_BLUR_DELAY(0.2)}
              className="relative z-10 w-full max-w-2xl text-center"
            >
              <h1 className="font-hero-serif relative mx-auto inline-block w-max max-w-full text-[2rem] leading-[1.15] font-normal tracking-tight text-primary-50/95 sm:text-4xl md:text-5xl lg:text-[3.25rem]">
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
              <p className="mt-8 text-base leading-relaxed text-primary-100 ">
                Run AI coding agents in secure workspaces. Inspect changes, collaborate with
                agents, and ship with confidence.
              </p>
            </motion.div>

            <motion.div
              {...FADE_IN_BLUR_DELAY(0.45)}
              className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              {isMac ? (
                <ShortcutPillButton
                  href={MAINS_DOWNLOAD_DMG_URL}
                  kbdShortcut="download"
                  ariaLabel="Download Mains for macOS (shortcut D)"
                  className={cn(
                    pill,
                    "text-black bg-white hover:bg-neutral-200",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                  )}
                  shortcut="D"
                  shortcutClassName="bg-primary-100 text-primary-950"
                >
                  <Apple width={16} height={16} />
                  <span>Download for macOS</span>
                </ShortcutPillButton>
              ) : (
                <ShortcutPillButton
                  ariaLabel="Windows version coming soon (shortcut D)"
                  className={cn(
                    pill,
                    "cursor-default text-primary-500 bg-primary-900/50"
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
                className={cn(
                  pill,
                  "text-white bg-primary-950 hover:bg-primary-950",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30"
                )}
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
