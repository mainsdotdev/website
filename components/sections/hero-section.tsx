"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import HeaderSpacer from "@/components/header-spacer";
import { ScrambleText } from "@/components/scramble-text";
import { Apple, Github, Windows } from "@/components/icons";
import { MacDownloadButton } from "@/components/mac-download-button";
import { AppStoreButton } from "@/components/app-store-button";
import { ShortcutPillButton } from "@/components/shortcut-pill-button";
import { FADE_IN_BLUR_DELAY, FADE_IN_BLUR_UP_DELAY } from "@/lib/animations";
import { MAINS_APP_STORE_URL, MAINS_GITHUB_REPO_URL } from "@/lib/constants";
import { usePlatformDetection, type Platform } from "@/hooks/usePlatformDetection";
import { cn } from "@/lib/utils";

const HERO_SCRAMBLE_WORDS = [
  "agents.",
  "chats.",
  "issues.",
  "plans.",
  "PRs.",
  "ideas.",
  "bugs.",
  "you.",
  "all.",
] as const;
const PILL_CLASS_NAME =
  "inline-flex max-w-full min-w-0 items-center gap-2 rounded-full px-3 py-3 text-xs font-medium transition-colors md:px-6 md:py-3 md:text-sm";

/** Shared hero typography and entrance, with an optional fixed headline. */
export function HeroHeadline({
  words = HERO_SCRAMBLE_WORDS,
  tagline = "Run coding agents. Review diffs. Manage runs.",
  title,
  id,
}: {
  words?: readonly string[];
  /** The line under the headline. */
  tagline?: string;
  /** A fixed headline instead of the cycling "Mains for …" copy. */
  title?: string;
  id?: string;
}) {
  // Sizes the headline to its longest word, so it never reflows mid-cycle.
  const longest = words.reduce((a, b) => (a.length >= b.length ? a : b));

  return (
    <motion.div
      {...FADE_IN_BLUR_DELAY(0.2)}
      className="relative z-10 w-full max-w-2xl text-center"
    >
      <h1 id={id} className="font-sans relative mx-auto inline-block w-max max-w-full text-[2rem] leading-[1.15] font-normal tracking-tight text-primary-50/95 sm:text-4xl md:text-5xl lg:text-[3.25rem]">
        {title ?? (
          <>
            <span
              aria-hidden
              className="invisible flex flex-nowrap items-baseline justify-start gap-x-1.5"
            >
              <span>Mains for</span>
              <span>{longest}</span>
            </span>
            <span className="absolute inset-0 flex min-w-0 flex-nowrap items-baseline justify-start gap-x-1.5 overflow-hidden">
              <span className="shrink-0">Mains for</span>
              <ScrambleText
                words={[...words]}
                interval={3000}
                className="text-primary-200"
              />
            </span>
          </>
        )}
      </h1>
      <p className="mt-3 text-lg leading-snug text-primary-400 sm:text-xl md:text-xl">
        {tagline}
      </p>
    </motion.div>
  );
}

/** Explain that the iPhone app pairs with Mains running on a Mac. */
function CompanionNote({ platform }: { platform: Platform }) {
  if (platform === "other") return null;

  const released = MAINS_APP_STORE_URL !== null;
  const text =
    platform === "ios"
      ? released
        ? "Mains runs on your Mac — the iPhone app pairs with it over your network."
        : "Mains runs on your Mac — an iPhone app to pair with it is coming soon."
      : released
        ? "Also on iPhone: drive your runs from the couch."
        : "Coming soon to iPhone: drive your runs from the couch.";

  return (
    <motion.p
      {...FADE_IN_BLUR_DELAY(0.6)}
      className="pointer-events-auto relative z-10 mt-5 text-xs text-primary-400 md:text-sm"
    >
      {text}{" "}
      {platform === "mac" && MAINS_APP_STORE_URL && (
        <Link
          href={MAINS_APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-200 underline underline-offset-4 transition-colors hover:text-white"
        >
          Available on the App Store
        </Link>
      )}
    </motion.p>
  );
}

export function HeroActions({ platform }: { platform: Platform }) {
  return (
    <>
      <motion.div
        {...FADE_IN_BLUR_DELAY(0.45)}
        // Above the note: the Intel dropdown opens across it, and z-20 inside
        // this row can't outrank a later sibling that shares its z-index.
        className="pointer-events-auto relative z-20 mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <MacDownloadButton
          pillClassName={PILL_CLASS_NAME}
          shortcutClassName="bg-primary-200 text-primary-950"
        />

        {platform === "ios" ? (
          MAINS_APP_STORE_URL ? (
            <AppStoreButton />
          ) : (
            <ShortcutPillButton
              ariaLabel="iPhone app coming soon"
              className={cn(PILL_CLASS_NAME, "cursor-default bg-primary-900/50 text-primary-500")}
            >
              <Apple width={16} height={16} />
              <span>iPhone — Coming Soon</span>
            </ShortcutPillButton>
          )
        ) : platform === "other" ? (
          <ShortcutPillButton
            ariaLabel="Windows version coming soon"
            className={cn(PILL_CLASS_NAME, "cursor-default bg-primary-900/50 text-primary-500")}
          >
            <Windows width={16} height={16} />
            <span>Windows — Coming Soon</span>
          </ShortcutPillButton>
        ) : null}

        <ShortcutPillButton
          href={MAINS_GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          kbdShortcut="github"
          ariaLabel="View source on GitHub (shortcut C)"
          className={cn(
            PILL_CLASS_NAME,
            " text-white  glass-button",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30"
          )}
          shortcut="C"
          shortcutClassName="bg-primary-800/80 text-primary"
        >
          <Github width={16} height={16} />
          <span>View Source</span>
        </ShortcutPillButton>
      </motion.div>

      <CompanionNote platform={platform} />
    </>
  );
}

/** The framed desktop window under the hero's buttons. */
export function HeroWindow({
  appWindow,
  aside,
  className,
}: {
  appWindow?: React.ReactNode;
  /**
   * Positioned against the window from outside its clipped frame, so it can
   * overlap the window's edge — the developer page's phone.
   */
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      {...FADE_IN_BLUR_UP_DELAY(0.75)}
      className={cn("pointer-events-auto relative z-20 mx-auto w-full max-w-6xl", className)}
    >
      {/* The voice orb docks in this window once it is centred on screen. */}
      <div
        data-orb-frame
        className="overflow-hidden rounded-xl bg-primary-900"
      >
        {appWindow}
      </div>
      {aside}
    </motion.div>
  );
}

export function HeroSection({
  appWindow,
  releaseCanvas,
  words,
  tagline,
}: {
  /**
   * The desktop-window mockup, rendered on the server and handed down as a
   * node — importing it here would drag its markdown renderer into this
   * client component's bundle.
   */
  appWindow?: React.ReactNode;
  /** Server-rendered images from recent releases, arranged around the demo. */
  releaseCanvas?: React.ReactNode;
  /** What "Mains for …" cycles through; the home page's words when unset. */
  words?: readonly string[];
  /** The line under the headline; the home page's when unset. */
  tagline?: string;
}) {
  const { platform } = usePlatformDetection();

  return (
    <div className="relative">
      {/* From the very top of the page, behind the fixed header, down through
          the hero — not just from where the hero's own section begins. */}
      <div
        aria-hidden
        className="hero-canvas-grid pointer-events-none absolute inset-0 text-primary-700/30"
      />

      <HeaderSpacer />
      {/* Clips sideways only: the tile backdrop reaches up over the dots
          above the hero, and must not be cut off at the wrapper's top. */}
      <div className="relative isolate overflow-x-clip">
        <section className="relative mx-auto mt-16 max-w-420 px-5 pt-8 pb-20 sm:px-8 lg:pt-64 2xl:pt-72">
          <div className="pointer-events-none relative z-20 flex flex-col items-center text-center">
            <HeroHeadline words={words} tagline={tagline} />
            <HeroActions platform={platform} />

            <HeroWindow appWindow={appWindow} className="mt-14" />
          </div>

          {releaseCanvas}
        </section>
      </div>
    </div>
  );
}
