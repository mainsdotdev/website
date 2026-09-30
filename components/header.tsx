"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAnimate, useReducedMotion } from "framer-motion";
import { Apple, Mains } from "@/components/icons";
import {
  MAINS_APP_STORE_URL,
  MAINS_DOCS_URL,
  MAINS_DOWNLOAD_DMG_URL,
} from "@/lib/constants";
import { usePlatformDetection, type Platform } from "@/hooks/usePlatformDetection";
import { cn } from "@/lib/utils";
import headerArt from "@/public/logo-art/mains-risograph-header.webp";

/**
 * Narrow screens can't fit the whole row beside the wordmark and download
 * pill, so the later links join as the bar widens — Privacy and Support are
 * always one scroll away in the footer.
 */
const NAV_LINKS = [
  { label: "Changelog", href: "/changelog" },
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
          "pointer-events-none fixed inset-x-0 z-50 transition-[top] duration-500 ease-spring-critical motion-reduce:transition-none",
          isDetached ? "top-5" : "top-0",
        )}
      >
        <nav
          aria-label="Primary navigation"
          className={cn(
            "pointer-events-auto mx-auto flex h-16 w-fit max-w-[calc(100%-16px)] items-center justify-between gap-4 bg-primary-900/40 px-4 text-primary-50 shadow-primary-500/10 backdrop-blur-3xl transition-[border-radius] duration-500 ease-spring-critical motion-reduce:transition-none sm:h-18 sm:gap-8 sm:px-6",
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
            <HeaderIcon />
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

    </>
  );
}

function HeaderIcon() {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const imageRef = useRef<HTMLImageElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion === null) return;

    let cancelled = false;
    let startTimer: ReturnType<typeof setTimeout> | undefined;

    async function reveal() {
      // Keep the original icon visible until the replacement can be painted.
      try {
        await imageRef.current?.decode();
      } catch {
        return;
      }
      if (cancelled) return;

      startTimer = setTimeout(async () => {
        if (cancelled || !scope.current) return;

        const fade = { duration: reducedMotion ? 0.15 : 0.3 };
        await Promise.all([
          animate("[data-logo-original]", { opacity: 0 }, fade),
          animate("[data-logo-risograph]", { opacity: 1 }, fade),
          ...(reducedMotion ? [] : [
            animate(scope.current, { scale: 1.5, rotate: -30 }, {
              type: "spring", duration: 0.45, bounce: 0,
            }),
          ]),
        ]);

        if (!cancelled && !reducedMotion) {
          await animate(scope.current, { scale: 1, rotate: 0 }, {
            type: "spring", duration: 0.55, bounce: 0, delay: 0.15,
          });
        }
      }, 120);
    }

    // Unrelated images and videos should not delay the already-decoded logo.
    void reveal();

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
    };
  }, [animate, reducedMotion, scope]);

  return (
    <span
      ref={scope}
      aria-hidden="true"
      className="pointer-events-none relative inline-block h-5 aspect-720/666 shrink-0"
    >
      <span data-logo-original className="absolute inset-0">
        <Mains className="h-full w-full" />
      </span>
      <span data-logo-risograph className="absolute inset-0" style={{ opacity: 0 }}>
        <Image
          ref={imageRef}
          src={headerArt}
          alt=""
          fill
          sizes="24px"
          loading="eager"
          fetchPriority="high"
          unoptimized
          draggable={false}
          className="object-contain"
        />
      </span>
    </span>
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
