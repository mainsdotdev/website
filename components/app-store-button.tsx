"use client";

import Link from "next/link";
import { Apple } from "@/components/icons";
import { MAINS_APP_STORE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

type AppStoreButtonProps = {
  className?: string;
};

/**
 * Apple's App Store badge, built in markup rather than shipped as artwork: it
 * stays crisp at any size, inherits the site's font, and costs no request.
 *
 * The white variant, so the lockup keeps its edge on the page's near-black
 * ground the way the .dmg pill does. Height matches the pills it sits beside,
 * and clears Apple's 40px minimum at both breakpoints.
 */
export function AppStoreButton({ className }: AppStoreButtonProps) {
  // No listing yet — render nothing rather than a badge that leads nowhere.
  if (!MAINS_APP_STORE_URL) return null;

  return (
    <Link
      href={MAINS_APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download Mains for iPhone on the App Store"
      className={cn(
        "inline-flex h-11 shrink-0 items-center gap-2.5 rounded-full bg-white px-3.5 text-black",
        "transition-colors hover:bg-primary-100",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30",
        className
      )}
    >
      {/* Proportions taken off Apple's own badge: the mark is ~2/3 the badge
          height, the two lines ~19% and ~40% of it. */}
      <Apple fill="currentColor" className="h-6 w-auto" />
      <span className="flex flex-col items-start">
        <span className="text-[9px] leading-none font-normal">Download on the</span>
        <span className="text-[15px] leading-tight font-medium tracking-tight">
          App Store
        </span>
      </span>
    </Link>
  );
}
