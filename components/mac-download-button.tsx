"use client";

import { Apple, DownloadLine } from "@/components/icons";
import { ShortcutPillButton } from "@/components/shortcut-pill-button";
import { MAINS_DOWNLOAD_DMG_URL, MAINS_DOWNLOAD_DMG_X64_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

type MacDownloadButtonProps = {
  /** Shared pill classes from the section (sizing/typography). */
  pillClassName: string;
  /** Styling for the keyboard-shortcut chip, varies per section. */
  shortcutClassName: string;
};

/**
 * Primary macOS (Apple Silicon) download pill with a hover/focus dropdown
 * offering the Intel (x64) build.
 */
export function MacDownloadButton({ pillClassName, shortcutClassName }: MacDownloadButtonProps) {
  return (
    <div className="group/download relative">
      <ShortcutPillButton
        href={MAINS_DOWNLOAD_DMG_URL}
        kbdShortcut="download"
        ariaLabel="Download Mains for macOS (shortcut D)"
        className={cn(
          pillClassName,
          "text-black glass-su bg-primary-50 hover:bg-primary-100"
          
        )}
        shortcut="D"
        shortcutClassName={shortcutClassName}
      >
        <Apple width={16} height={16} />
        <span>Download for macOS</span>
      </ShortcutPillButton>

      {/* pt-2 keeps the hover alive while the pointer travels from pill to dropdown. */}
      <div
        className={cn(
          "pointer-events-none absolute top-full right-0 left-0 z-20 pt-2",
          "-translate-y-1 opacity-0 transition-all duration-150 ease-out",
          "group-hover/download:pointer-events-auto group-hover/download:translate-y-0 group-hover/download:opacity-100",
          "group-focus-within/download:pointer-events-auto group-focus-within/download:translate-y-0 group-focus-within/download:opacity-100"
        )}
      >
        <a
          href={MAINS_DOWNLOAD_DMG_X64_URL}
          aria-label="Download Mains for Intel Mac (x64)"
          className={cn(
            "flex items-center justify-center gap-2 rounded-full",
            " bg-primary-950/80 ",
            "px-4 py-3 text-xs font-medium text-primary-200",
            "transition-colors hover:bg-primary-950 hover:text-white"
          )}
        >
          <DownloadLine className="h-3.5 w-3.5 shrink-0" />
          <span>Download for Intel Mac</span>
        </a>
      </div>
    </div>
  );
}
