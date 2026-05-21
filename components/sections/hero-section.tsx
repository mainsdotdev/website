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
    <div className="relative overflow-hidden bg-primary-950">
      {/* Vertical rail lines — outer edges + inner rails aligned to section content area */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 mx-auto w-full max-w-7xl"
      >
        <div className="absolute inset-y-0 inset-x-6">
          <div className="absolute inset-y-0 left-0 w-px bg-white/[0.07]" />
          <div className="absolute inset-y-0 right-0 w-px bg-white/[0.07]" />
          <div className="absolute inset-y-0 left-[12%] hidden w-px bg-white/[0.05] md:block" />
          <div className="absolute inset-y-0 left-[88%] hidden w-px bg-white/[0.05] md:block" />
        </div>
      </div>

      {/* Grain overlay */}
      <GrainOverlay className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.05]" />

      <div className="relative z-10">
        <Header />
        <section className="mx-auto max-w-7xl px-6 pt-10 pb-20">
          <div className="relative flex flex-col items-center text-center">
            {/* Framed text content — horizontal rails close the box on md+ */}
            <div className="relative z-10 w-full py-10 md:w-[76%] md:border-y md:border-white/[0.05] md:py-16">
            <motion.div
              {...FADE_IN_BLUR_DELAY(0.2)}
              className="relative z-10 mx-auto w-full max-w-2xl text-center"
            >
              <h1 className="font-sans relative mx-auto inline-block w-max max-w-full text-[2rem] leading-[1.15] font-medium tracking-tight text-primary-50/95 sm:text-4xl md:text-5xl lg:text-[3.25rem]">
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
                  ariaLabel="Download Mains for macOS"
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
                  ariaLabel="Windows version coming soon"
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
                  "text-white bg-primary-950 hover:bg-primary-900",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30"
                )}
                shortcut="C"
                shortcutClassName="bg-primary-800/20 text-primary"
              >
                <Github width={16} height={16} />
                <span>View Source</span>
              </ShortcutPillButton>
            </motion.div>
            </div>

            <motion.div
              {...FADE_IN_BLUR_UP_DELAY(0.75)}
              className="relative z-10 mt-14 w-full md:w-[76%] sm:rounded-xl sm:overflow-hidden"
            >
              <Image
                src="/hero3.png"
                alt="Mains desktop app"
                width={3600}
                height={2068}
                className="block h-auto w-full"
                priority
                sizes="(min-width: 768px) 76vw, 100vw"
              />
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
