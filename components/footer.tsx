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
      { src: "/letter-art/m-05-risograph.webp", width: 1354, height: 768 },
      { src: "/letter-art/m-06-risograph.webp", width: 1271, height: 768 },
    ],
  },
  {
    character: "a",
    images: [
      { src: "/letter-art/a-05-risograph.webp", width: 789, height: 768 },
      { src: "/letter-art/a-06-risograph.webp", width: 741, height: 768 },
    ],
  },
  {
    character: "i",
    images: [
      { src: "/letter-art/i-05-risograph.webp", width: 252, height: 768 },
      { src: "/letter-art/i-06-risograph.webp", width: 241, height: 768 },
    ],
  },
  {
    character: "n",
    images: [
      { src: "/letter-art/n-05-risograph.webp", width: 825, height: 768 },
      { src: "/letter-art/n-06-risograph.webp", width: 811, height: 768 },
    ],
  },
  {
    character: "s",
    images: [
      { src: "/letter-art/s-05-risograph.webp", width: 683, height: 768 },
      { src: "/letter-art/s-06-risograph.webp", width: 674, height: 768 },
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
          fontSize={[3.5, 18, 14]}
          className="mt-20 flex items-center justify-center whitespace-nowrap font-sans text-[clamp(3.5rem,18vw,14rem)] leading-none font-medium tracking-[-0.085em] select-none sm:mt-12"
        />
      </div>
    </footer>
  );
}
