"use client";

import { motion } from "framer-motion";
import { Github, Windows } from "@/components/icons";
import { MacDownloadButton } from "@/components/mac-download-button";
import { ShortcutPillButton } from "@/components/shortcut-pill-button";
import { FADE_IN_UP } from "@/lib/animations";
import { MAINS_GITHUB_REPO_URL } from "@/lib/constants";
import { usePlatformDetection } from "@/hooks/usePlatformDetection";
import { cn } from "@/lib/utils";

export function CtaSection() {
  const { isMac } = usePlatformDetection();

  const pill =
    "inline-flex max-w-full min-w-0 items-center gap-2 rounded-full md:px-6 md:py-3 md:text-sm px-3 py-3 text-xs font-medium transition-colors";

  return (
    <div className="border-b border-primary-900 ">
      <section className="py-24 max-w-3xl mx-auto px-6 text-center ">
        <motion.div {...FADE_IN_UP} className="flex flex-col items-center gap-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-snug font-sans">
            Mains for AI coding agents
          </h2>
          <p className="text-sm md:text-base text-neutral-400 leading-relaxed max-w-xl">
            Run autonomous agents in secure workspaces, connect your repositories, and move
            from task to reviewed pull request without leaving Mains.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {isMac ? (
              <MacDownloadButton
                pillClassName={pill}
                shortcutClassName="bg-neutral-300 text-neutral-900"
              />
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
                "text-white bg-black hover:bg-primary-950",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30"
              )}
              shortcut="C"
              shortcutClassName="bg-primary-850 text-white"
            >
              <Github width={16} height={16} />
              <span>View Source</span>
            </ShortcutPillButton>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
