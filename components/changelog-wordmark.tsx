"use client";

import { AnimatedLetterWord, type LetterArt } from "@/components/animated-letter-word";

const LETTERS: readonly LetterArt[] = [
  { character: "c", images: [{ src: "/letter-art/changelog/c-amber-glass.webp", width: 672, height: 768 }] },
  { character: "h", images: [{ src: "/letter-art/changelog/h-cobalt-satin.webp", width: 619, height: 768 }] },
  { character: "a", images: [{ src: "/letter-art/changelog/a-red-ceramic.webp", width: 732, height: 768 }] },
  { character: "n", images: [{ src: "/letter-art/changelog/n-green-terrazzo.webp", width: 917, height: 768 }] },
  { character: "g", images: [{ src: "/letter-art/changelog/g-chrome.webp", width: 562, height: 768 }] },
  { character: "e", images: [{ src: "/letter-art/changelog/e-mother-of-pearl.webp", width: 708, height: 768 }] },
  { character: "l", images: [{ src: "/letter-art/changelog/l-brass.webp", width: 339, height: 768 }] },
  { character: "o", images: [{ src: "/letter-art/changelog/o-coral-gummy.webp", width: 795, height: 768 }] },
  { character: "g", images: [{ src: "/letter-art/changelog/g-chenille.webp", width: 563, height: 768 }] },
];

export function ChangelogWordmark() {
  return (
    <AnimatedLetterWord
      letters={LETTERS}
      label="changelog"
      className="flex items-center whitespace-nowrap font-sans text-[clamp(2.5rem,9vw,8rem)] leading-none font-medium tracking-[-0.075em] text-primary-50 select-none"
      imageSizes="(max-width: 640px) 14vw, 9vw"
      fullRevealHoldMs={2000}
    />
  );
}
