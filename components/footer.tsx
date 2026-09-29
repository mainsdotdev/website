"use client";

import Link from "next/link";
import { AnimatedLetterWord } from "@/components/animated-letter-word";
import {
  MAINS_DOCS_URL,
  MAINS_DOWNLOAD_DMG_URL,
  MAINS_GITHUB_REPO_URL,
} from "@/lib/constants";

const FOOTER_COLUMNS = [
  {
    title: "product",
    links: [
      { label: "features", href: "/#use-cases" },
      { label: "changelog", href: "/changelog" },
      { label: "download for mac", href: MAINS_DOWNLOAD_DMG_URL },
    ],
  },
  {
    title: "explore",
    links: [
      { label: "docs", href: MAINS_DOCS_URL },
      { label: "privacy", href: "/privacy" },
      { label: "terms", href: "/terms" },
      { label: "license", href: "/license" },
    ],
  },
  {
    title: "contact",
    links: [
      { label: "github", href: MAINS_GITHUB_REPO_URL },
      { label: "issues", href: `${MAINS_GITHUB_REPO_URL}/issues` },
      { label: "support", href: "/support" },
      { label: "email", href: "mailto:team@mains.dev" },
    ],
  },
] as const;

const LETTERS = [
  {
    character: "m",
    images: [
      { src: "/letter-art/m-01-glass.webp", width: 730, height: 768 },
      { src: "/letter-art/m-02-embroidered.webp", width: 832, height: 768 },
      { src: "/letter-art/m-03-mosaic.webp", width: 1152, height: 768 },
      { src: "/letter-art/m-04-gummy.webp", width: 1152, height: 768 },
    ],
  },
  {
    character: "a",
    images: [
      { src: "/letter-art/a-01-biscuit.webp", width: 734, height: 768 },
      { src: "/letter-art/a-02-foil.webp", width: 739, height: 768 },
      { src: "/letter-art/a-03-tufted.webp", width: 768, height: 768 },
      { src: "/letter-art/a-04-jewels.webp", width: 722, height: 768 },
    ],
  },
  {
    character: "i",
    images: [
      { src: "/letter-art/i-01-marquee.webp", width: 512, height: 768 },
      { src: "/letter-art/i-02-botanical.webp", width: 512, height: 768 },
      { src: "/letter-art/i-03-candle.webp", width: 512, height: 768 },
      { src: "/letter-art/i-04-ice.webp", width: 512, height: 768 },
    ],
  },
  {
    character: "n",
    images: [
      { src: "/letter-art/n-01-knit.webp", width: 746, height: 768 },
      { src: "/letter-art/n-02-brass.webp", width: 759, height: 768 },
      { src: "/letter-art/n-03-jade.webp", width: 758, height: 768 },
      { src: "/letter-art/n-04-origami.webp", width: 794, height: 768 },
    ],
  },
  {
    character: "s",
    images: [
      { src: "/letter-art/s-01-stamps.webp", width: 711, height: 768 },
      { src: "/letter-art/s-02-neon.webp", width: 720, height: 768 },
      { src: "/letter-art/s-03-ribbon.webp", width: 640, height: 768 },
      { src: "/letter-art/s-04-beads.webp", width: 730, height: 768 },
    ],
  },
] as const;

export default function Footer() {
  return (
    <footer
      className="relative isolate overflow-hidden bg-primary-950 text-primary-50"
    >
      <div className="mx-auto w-full max-w-7xl px-6 pt-16 pb-5 sm:px-10 sm:pt-20 lg:px-12 lg:pt-24">
        <nav
          aria-label="Footer navigation"
          className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4 lg:gap-x-12"
        >
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-base font-medium leading-tight text-primary-50">
                {column.title}
              </p>
              <ul className="mt-5 space-y-3 text-[15px] leading-snug text-primary-500">
                {column.links.map((link) => {
                  const external = link.href.startsWith("https://");

                  return (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="inline-block rounded-sm transition-colors duration-200 hover:text-primary-50 focus-visible:text-primary-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-50"
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-base font-medium leading-tight text-primary-50">
              mains
            </p>
            <p className="mt-5 max-w-64 text-[15px] leading-relaxed text-primary-500">
              Your workspaces and run history stay on your Mac by default. You choose the AI providers and tools for each task.
            </p>
          </div>
        </nav>

        <AnimatedLetterWord
          letters={LETTERS}
          label="mains"
          as="h2"
          className="mt-20 flex items-center justify-center whitespace-nowrap font-sans text-[clamp(3.5rem,18vw,18rem)] leading-none font-medium tracking-[-0.085em] select-none sm:mt-24"
        />
      </div>
    </footer>
  );
}
