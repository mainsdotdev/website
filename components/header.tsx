"use client";

import React from "react";
import Link from "next/link";
import { Apple, Mains, Windows } from "@/components/icons";
import { ShortcutPillButton } from "@/components/shortcut-pill-button";
import { MAINS_DOWNLOAD_DMG_URL } from "@/lib/constants";
import { usePlatformDetection } from "@/hooks/usePlatformDetection";
import { cn } from "@/lib/utils";

const headerPill =
  "inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition-colors md:px-4 md:py-2";

export default function Header() {
  const { isMac } = usePlatformDetection();

  return (
    <header className="max-w-7xl mx-auto px-6">
      <nav className="flex items-center justify-between py-5 font-sans">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Mains className="size-6 text-primary-200" />
             <span className="text-2xl text-primary-200 font-sans">mains</span>
        </Link>

        <div className="flex items-center gap-3">
          {isMac ? (
            <ShortcutPillButton
              href={MAINS_DOWNLOAD_DMG_URL}
              kbdShortcut="download"
              ariaLabel="Download Mains for macOS (shortcut D)"
              className={cn(
                headerPill,
                "bg-white text-black hover:bg-neutral-200",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
              )}
              shortcut="D"
              shortcutClassName="bg-primary-100 text-primary-950"
            >
              <Apple width={14} height={14} />
              <span>Download</span>
            </ShortcutPillButton>
          ) : (
            <ShortcutPillButton
              ariaLabel="Windows version coming soon (shortcut D)"
              className={cn(
                headerPill,
                "cursor-default text-primary-400 bg-primary-900/60"
              )}
              shortcut="D"
              shortcutClassName="bg-primary-800 text-primary-300"
            >
              <Windows width={14} height={14} />
              <span>Windows soon</span>
            </ShortcutPillButton>
          )}
        </div>
      </nav>
    </header>
  );
}
