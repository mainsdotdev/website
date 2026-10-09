"use client";

import { motion } from "framer-motion";
import { Apple, Github, Windows } from "@/components/icons";
import { MacDownloadButton } from "@/components/mac-download-button";
import { AppStoreButton } from "@/components/app-store-button";
import { CtaVoiceOrb } from "@/components/cta-voice-orb";
import { ShortcutPillButton } from "@/components/shortcut-pill-button";
import { FADE_IN_UP } from "@/lib/animations";
import { MAINS_APP_STORE_URL, MAINS_GITHUB_REPO_URL } from "@/lib/constants";
import { usePlatformDetection } from "@/hooks/usePlatformDetection";
import { cn } from "@/lib/utils";

/**
 * Always offer the macOS download and View Source, with their D and C shortcuts,
 * alongside availability for the visitor's platform.
 */
export function CtaActions({ className }: { className?: string }) {
  const { platform } = usePlatformDetection();

  const pill =
    "inline-flex max-w-full min-w-0 items-center gap-2 rounded-full md:px-6 md:py-3 md:text-sm px-3 py-3 text-xs font-medium transition-colors";

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-3", className)}>
      <MacDownloadButton
        pillClassName={pill}
        shortcutClassName="bg-primary-200 text-primary-950"
      />

      {platform === "ios" ? (
        MAINS_APP_STORE_URL ? (
          <AppStoreButton />
        ) : (
          <ShortcutPillButton
            ariaLabel="iPhone app coming soon"
            className={cn(pill, "cursor-default text-primary-500 bg-primary-900/50")}
          >
            <Apple width={16} height={16} />
            <span>iPhone — Coming Soon</span>
          </ShortcutPillButton>
        )
      ) : platform === "other" ? (
        <ShortcutPillButton
          ariaLabel="Windows version coming soon"
          className={cn(
            pill,
            "cursor-default text-primary-500 bg-primary-900/50"
          )}
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
          pill,
          "text-white bg-primary-900 glass-button",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30"
        )}
        shortcut="C"
        shortcutClassName="bg-primary-800/80 text-primary"
      >
        <Github width={16} height={16} />
        <span>View Source</span>
      </ShortcutPillButton>
    </div>
  );
}

/** `orb: false` leaves out the voice orb, as the developer page does. */
export function CtaSection({ orb = true }: { orb?: boolean } = {}) {
  return (
    <div className=" ">
      <section className="py-24 max-w-3xl mx-auto px-6 text-center ">
        <motion.div {...FADE_IN_UP} className="flex flex-col items-center gap-6">
          {orb && <CtaVoiceOrb />}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-snug font-sans">
            Mains for what&apos;s next.
          </h2>
          <p className="text-sm md:text-base text-primary-400 leading-relaxed max-w-xl">
            Ask a question, plan a trip, create something new, or move a project
            forward. Mains brings your chats and tools together so you can go
            from idea to result.
          </p>
          <CtaActions className="mt-4" />
        </motion.div>
      </section>
    </div>
  );
}
