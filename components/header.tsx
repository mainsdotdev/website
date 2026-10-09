"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Apple, Mains, MenuToggle } from "@/components/icons";
import { MAINS_APP_STORE_URL, MAINS_DOWNLOAD_DMG_URL } from "@/lib/constants";
import { usePlatformDetection, type Platform } from "@/hooks/usePlatformDetection";
import { cn } from "@/lib/utils";

/** Mobile navigation shares the same links as the desktop row. */
const NAV_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Atlas", href: "/atlas" },
  { label: "Bridge", href: "/bridge" },
  { label: "Changelog", href: "/changelog" },
  { label: "Privacy", href: "/privacy" },
] as const satisfies readonly {
  label: string;
  href: string;
  external?: boolean;
}[];

/** A compact navigation bar shaped like the top edge of a MacBook display. */
export default function Header() {
  const pathname = usePathname();
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

          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  target={"external" in link ? "_blank" : undefined}
                  rel={"external" in link ? "noopener noreferrer" : undefined}
                  className={cn(
                    "text-[12px] transition-colors hover:text-primary-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-50 sm:text-sm",
                    isActive ? "font-semibold text-primary-50" : "text-primary-200",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <DownloadPill platform={platform} />
            <MobileMenu key={pathname} pathname={pathname} />
          </div>
        </nav>
      </header>

    </>
  );
}

function MobileMenu({ pathname }: { pathname: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (desktopQuery.matches) setIsOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
      desktopQuery.removeEventListener("change", closeOnDesktop);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="relative md:hidden"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          "flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-primary-50/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-50",
          isOpen && "bg-primary-50/10",
        )}
      >
        <MenuToggle isOpen={isOpen} aria-hidden="true" className="size-5" />
      </button>

      <div
        id={menuId}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={cn(
          "absolute right-0 top-full mt-3 w-52 origin-top-right rounded-2xl border border-primary-700/40 bg-primary-900/95 p-2 shadow-xl shadow-primary-950/20 backdrop-blur-3xl transition-[opacity,translate,scale,visibility] duration-300 ease-spring-critical motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:transition-none",
          isOpen
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible pointer-events-none -translate-y-3 scale-95 opacity-0",
        )}
      >
        {NAV_LINKS.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              target={"external" in link ? "_blank" : undefined}
              rel={"external" in link ? "noopener noreferrer" : undefined}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex min-h-11 items-center rounded-xl px-3 text-sm transition-colors hover:bg-primary-50/10 hover:text-primary-50 focus-visible:outline-2 focus-visible:outline-primary-50",
                isActive
                  ? "bg-primary-50/10 font-semibold text-primary-50"
                  : "text-primary-200",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function HeaderIcon() {
  return <Mains aria-hidden="true" className="h-4 w-auto shrink-0" />;
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
