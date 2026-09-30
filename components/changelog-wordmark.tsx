"use client";

import { AnimatedLetterWord, type LetterArt } from "@/components/animated-letter-word";

const LETTERS: readonly LetterArt[] = [
  { character: "c", images: [{ src: "/letter-art/changelog/c-risograph-v1.webp", width: 716, height: 768 }] },
  { character: "h", images: [{ src: "/letter-art/changelog/h-risograph-v1.webp", width: 502, height: 768 }] },
  { character: "a", images: [{ src: "/letter-art/changelog/a-risograph-v1.webp", width: 804, height: 768 }] },
  { character: "n", images: [{ src: "/letter-art/changelog/n-risograph-v1.webp", width: 758, height: 768 }] },
  { character: "g", images: [{ src: "/letter-art/changelog/g-risograph-01.webp", width: 600, height: 768 }] },
  { character: "e", images: [{ src: "/letter-art/changelog/e-risograph-v1.webp", width: 769, height: 768 }] },
  { character: "l", images: [{ src: "/letter-art/changelog/l-risograph-v1.webp", width: 294, height: 768 }] },
  { character: "o", images: [{ src: "/letter-art/changelog/o-risograph-v1.webp", width: 777, height: 768 }] },
  { character: "g", images: [{ src: "/letter-art/changelog/g-risograph-02.webp", width: 578, height: 768 }] },
];

export function ChangelogWordmark() {
  return (
    <AnimatedLetterWord
      letters={LETTERS}
      label="changelog"
      className="flex items-center whitespace-nowrap font-sans text-[clamp(3.5rem,9vw,8rem)] leading-none font-medium tracking-[-0.075em] text-primary-50 select-none"
      imageSizes="(max-width: 640px) 14vw, 9vw"
      fullRevealHoldMs={2000}
    />
  );
}
