"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Apple, ArrowRightLine, Close, Github, Menu } from "@/components/icons";
import { MAINS_DOWNLOAD_DMG_URL, MAINS_GITHUB_REPO_URL } from "@/lib/constants";
import { usePlatformDetection } from "@/hooks/usePlatformDetection";
import { cn } from "@/lib/utils";

type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

const NAV_LINKS: NavLink[] = [
  { label: "Blog", href: "/blog" },
  { label: "Docs", href: "https://docs.mains.dev", external: true },
  { label: "Contact", href: "mailto:team@mains.dev" },
];

const externalProps = (link: NavLink) =>
  link.external ? { target: "_blank", rel: "noopener noreferrer" } : {};

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isMac } = usePlatformDetection();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* Backdrop only materializes once the page moves under it. */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 -z-10 border-b transition-all duration-300",
            scrolled
              ? "border-primary-900/60 bg-primary-950/60 backdrop-blur-xl"
              : "border-transparent bg-transparent"
          )}
        />
        <nav
          aria-label="Primary navigation"
          className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3"
        >
          {/* Logo + Menu */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center" aria-label="Mains — home">
              <Image
                src="/logo.png"
                alt="Mains — AI coding agent desktop app"
                width={480}
                height={480}
                className="object-contain w-auto h-8"
                priority
              />
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  {...externalProps(link)}
                  className="text-sm text-primary-300 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={MAINS_GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
              className="flex size-9 items-center justify-center rounded-full text-primary-300 glass-outline transition-colors hover:bg-primary-50/5 hover:text-white"
            >
              <Github width={16} height={16} />
            </Link>

            <DownloadPill isMac={isMac} />

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="flex size-9 items-center justify-center rounded-full text-primary-200 glass-outline transition-colors hover:bg-primary-50/5 hover:text-white md:hidden"
            >
              <Menu width={16} height={16} />
            </button>
          </div>
        </nav>

        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} isMac={isMac} />
      </header>

      {/* Reserves the fixed bar's height (py-2 + the 36px action row). */}
      <div aria-hidden className="h-13 mb-8" />
    </>
  );
}

function DownloadPill({ isMac, className }: { isMac: boolean; className?: string }) {
  if (!isMac) {
    return (
      <span
        aria-disabled
        className={cn(
          "flex h-8 cursor-default items-center rounded-full px-4 text-xs font-medium text-primary-500 glass-outline sm:text-sm",
          className
        )}
      >
        Coming Soon
      </span>
    );
  }

  return (
    <Link
      href={MAINS_DOWNLOAD_DMG_URL}
      aria-label="Download Mains for macOS"
      className={cn(
        "flex h-9 items-center gap-2 rounded-full bg-primary-50 px-4 text-xs font-medium text-black transition-colors hover:bg-primary-100 sm:text-sm",
        className
      )}
    >
      <Apple width={14} height={14} />
      Download
    </Link>
  );
}

function MobileMenu({
  open,
  onClose,
  isMac,
}: {
  open: boolean;
  onClose: () => void;
  isMac: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-50 flex flex-col bg-primary-950 md:hidden"
        >
          {/* Menu bar — mirrors the closed header so the logo never jumps */}
          <div className="flex items-center justify-between px-4 py-2">
            <Link href="/" onClick={onClose} aria-label="Mains — home">
              <Image
                src="/logo.png"
                alt="Mains — AI coding agent desktop app"
                width={480}
                height={480}
                className="h-8 w-auto object-contain"
              />
            </Link>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex size-9 items-center justify-center rounded-full text-primary-200 glass-outline transition-colors hover:bg-primary-50/5 hover:text-white"
            >
              <Close width={14} height={14} />
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, delay: 0.15 }}
            className="flex flex-1 flex-col overflow-y-auto px-4 pt-6 pb-10"
          >
            <div className="flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  {...externalProps(link)}
                  onClick={onClose}
                  className="flex items-center gap-2 text-3xl font-medium tracking-tight text-white"
                >
                  {link.label}
                  {link.external && (
                    <ArrowRightLine className="size-5 -rotate-45 text-primary-400" />
                  )}
                </Link>
              ))}
            </div>

            <hr className="my-8 border-primary-900" />

            <div className="flex flex-col gap-6">
              {isMac ? (
                <Link
                  href={MAINS_DOWNLOAD_DMG_URL}
                  onClick={onClose}
                  className="text-3xl font-medium tracking-tight text-white"
                >
                  Download
                </Link>
              ) : (
                <span className="text-3xl font-medium tracking-tight text-primary-500">
                  Coming Soon
                </span>
              )}

              <Link
                href={MAINS_GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex items-center gap-3 text-3xl font-medium tracking-tight text-primary-400"
              >
                GitHub
                <ArrowRightLine className="size-5 -rotate-45" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
