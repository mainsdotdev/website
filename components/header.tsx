"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Apple, Mains } from "@/components/icons";
import {
  MAINS_APP_STORE_URL,
  MAINS_DOCS_URL,
  MAINS_DOWNLOAD_DMG_URL,
} from "@/lib/constants";
import { usePlatformDetection, type Platform } from "@/hooks/usePlatformDetection";
import { cn } from "@/lib/utils";

/**
 * Narrow screens can't fit the whole row beside the wordmark and download
 * pill, so the later links join as the bar widens — Privacy and Support are
 * always one scroll away in the footer.
 */
const NAV_LINKS = [
  { label: "Changelog", href: "/blog" },
  { label: "Docs", href: MAINS_DOCS_URL, external: true, className: "hidden sm:inline" },
  { label: "Privacy", href: "/privacy", className: "hidden md:inline" },
  { label: "Support", href: "/support", className: "hidden md:inline" },
] as const satisfies readonly {
  label: string;
  href: string;
  external?: boolean;
  className?: string;
}[];

/** A compact navigation bar shaped like the top edge of a MacBook display. */
export default function Header() {
  const { platform } = usePlatformDetection();
  const [isDetached, setIsDetached] = useState(false);

  useEffect(() => {
    const updatePosition = () => setIsDetached(window.scrollY > 80);

    updatePosition();
    window.addEventListener("scroll", updatePosition, { passive: true });
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  return (
    <>
      <header
        className={cn(
          "pointer-events-none fixed inset-x-0 z-50 transition-[top] duration-500 ease-[var(--ease-spring-critical)] motion-reduce:transition-none",
          isDetached ? "top-5" : "top-0",
        )}
      >
        <nav
          aria-label="Primary navigation"
          className={cn(
            "pointer-events-auto mx-auto flex h-16 w-fit max-w-[calc(100%-16px)] items-center justify-between gap-4 bg-primary-900/40 px-4 text-primary-50 shadow-primary-500/10 backdrop-blur-3xl transition-[border-radius] duration-500 ease-[var(--ease-spring-critical)] motion-reduce:transition-none sm:h-18 sm:gap-8 sm:px-6",
            isDetached
              ? "rounded-[28px] sm:rounded-4xl"
              : "rounded-b-[28px] sm:rounded-b-4xl",
          )}
        >
          <Link
            href="/"
            aria-label="Mains — home"
            className="flex h-9 shrink-0 items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-50"
          >
            <Mains aria-hidden className="h-5 w-auto" />
            <span className="text-lg font-semibold tracking-tight">
              Mains
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={"external" in link ? "_blank" : undefined}
                rel={"external" in link ? "noopener noreferrer" : undefined}
                className={cn(
                  "text-[12px]  text-primary-200 transition-colors hover:text-primary-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-50 sm:text-sm",
                  "className" in link && link.className,
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <DownloadPill platform={platform} />
        </nav>
      </header>

      <div aria-hidden className="h-24 sm:h-27" />
    </>
  );
}

function DownloadPill({ platform }: { platform: Platform }) {
  if (platform === "other" || (platform === "ios" && !MAINS_APP_STORE_URL)) {
    return (
      <span
        aria-disabled
        className="flex h-8 shrink-0 cursor-default items-center rounded-full border border-primary-700/50 px-4 text-xs font-medium text-primary-300 sm:text-sm"
      >
        Coming Soon
      </span>
    );
  }

  return (
    <Link
      href={platform === "ios" ? MAINS_APP_STORE_URL! : MAINS_DOWNLOAD_DMG_URL}
      target={platform === "ios" ? "_blank" : undefined}
      rel={platform === "ios" ? "noopener noreferrer" : undefined}
      aria-label={platform === "ios" ? "Download Mains for iPhone on the App Store" : "Download Mains for macOS"}
      className="flex h-9 shrink-0 items-center gap-2 rounded-full bg-primary-50 px-4 text-xs font-medium text-primary-950 transition-colors hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-50 sm:text-sm"
    >
      <Apple width={14} height={14} />
      {platform === "ios" ? "App Store" : "Download"}
    </Link>
  );
}
