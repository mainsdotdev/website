"use client";

import Image from "next/image";
import Link from "next/link";
import { MAINS_APP_STORE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

type AppStoreButtonProps = {
  className?: string;
};

/**
 * Apple's official "Download on the App Store" badge, used as supplied:
 * Apple's marketing guidelines forbid recreating, recoloring or animating it,
 * so no hover effect either. The preferred black badge — its gray rim keeps
 * its edge on both themes. 44px tall to match the pills it sits beside, above
 * Apple's 40px onscreen minimum; the rows' 12–16px gaps clear the required
 * quarter-height of clear space.
 *
 * Source: https://developer.apple.com/app-store/marketing/guidelines/
 */
export function AppStoreButton({ className }: AppStoreButtonProps) {
  // No listing yet — render nothing rather than a badge that leads nowhere.
  if (!MAINS_APP_STORE_URL) return null;

  return (
    <Link
      href={MAINS_APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex shrink-0 rounded-[9px]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
        className
      )}
    >
      <Image
        src="/app-store-badge.svg"
        alt="Download Mains on the App Store"
        width={132}
        height={44}
        className="h-11 w-auto"
      />
    </Link>
  );
}
