"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
      { label: "changelog", href: "/blog" },
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

type Letter = (typeof LETTERS)[number];
type IntroState = { active: boolean; variant: number };

function randomVariant(count: number) {
  return Math.floor(Math.random() * count);
}

function FooterLetter({
  letter,
  intro,
  reducedMotion,
}: {
  letter: Letter;
  intro: IntroState;
  reducedMotion: boolean | null;
}) {
  const [hoverActive, setHoverActive] = useState(false);
  const [hoverVariant, setHoverVariant] = useState(0);
  const hoverActiveRef = useRef(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [metrics, setMetrics] = useState<{ textWidth: number; fontSize: number } | null>(null);

  useLayoutEffect(() => {
    const measureElement = measureRef.current;
    if (!measureElement) return;

    const measure = () => {
      const textWidth = measureElement.getBoundingClientRect().width;
      const fontSize = Number.parseFloat(getComputedStyle(measureElement).fontSize);
      setMetrics((current) =>
        current?.textWidth === textWidth && current.fontSize === fontSize
          ? current
          : { textWidth, fontSize },
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(measureElement);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, []);

  function activate() {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    if (!hoverActiveRef.current) {
      hoverActiveRef.current = true;
      setHoverVariant(randomVariant(letter.images.length));
      setHoverActive(true);
    }
  }

  function release(delay = 520) {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      hoverActiveRef.current = false;
      setHoverActive(false);
      leaveTimer.current = null;
    }, delay);
  }

  const active = intro.active || hoverActive;
  const image = letter.images[hoverActive ? hoverVariant : intro.variant];
  const targetWidth = metrics
    ? active
      ? metrics.fontSize * 0.86 * (image.width / image.height)
      : metrics.textWidth
    : undefined;
  const transition = reducedMotion
    ? { duration: 0.12 }
    : { duration: 0.36, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.span
      className="relative inline-flex h-[1em] shrink-0 items-center justify-center align-middle"
      initial={false}
      animate={targetWidth === undefined ? undefined : { width: targetWidth }}
      style={{ width: targetWidth === undefined ? "auto" : undefined }}
      transition={{ width: reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 290, damping: 31, mass: 0.85 } }}
      aria-hidden="true"
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") activate();
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch") release();
      }}
      onPointerDown={(event) => {
        if (event.pointerType === "touch") {
          activate();
          release(950);
        }
      }}
    >
      <span
        ref={measureRef}
        className={metrics ? "pointer-events-none invisible absolute whitespace-nowrap" : "pointer-events-none invisible whitespace-nowrap"}
      >
        {letter.character}
      </span>
      <AnimatePresence initial={false}>
        {active ? (
          <motion.span
            key={`image-${image.src}`}
            className="absolute inset-0 inline-flex items-center justify-center"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.78, y: "0.08em", rotate: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.86, y: "-0.05em", rotate: 3 }}
            transition={transition}
          >
            <span className="inline-flex h-[0.86em] shrink-0 items-center justify-center">
              <Image
                src={image.src}
                alt=""
                width={image.width}
                height={image.height}
                sizes="(max-width: 640px) 19vw, 18vw"
                unoptimized
                draggable={false}
                className="pointer-events-none block h-full w-auto max-w-none select-none"
              />
            </span>
          </motion.span>
        ) : (
          <motion.span
            key="character"
            className="absolute inset-0 inline-flex items-center justify-center"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.84, y: "0.07em" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.84, y: "-0.06em" }}
            transition={transition}
          >
            {letter.character}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  );
}

export default function Footer() {
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const inView = useInView(wordmarkRef, { once: true, amount: 0.35 });
  const reducedMotion = useReducedMotion();
  const [intro, setIntro] = useState<IntroState[]>(() =>
    LETTERS.map(() => ({ active: false, variant: 0 })),
  );

  useEffect(() => {
    if (!inView || reducedMotion) return;

    const timers = LETTERS.flatMap((_, index) => [
      setTimeout(() => {
        setIntro((current) =>
          current.map((state, stateIndex) =>
            stateIndex === index
              ? { active: true, variant: randomVariant(LETTERS[index].images.length) }
              : state,
          ),
        );
      }, 120 + index * 155),
      setTimeout(() => {
        setIntro((current) =>
          current.map((state, stateIndex) =>
            stateIndex === index ? { ...state, active: false } : state,
          ),
        );
      }, 1330 + index * 105),
    ]);

    return () => timers.forEach(clearTimeout);
  }, [inView, reducedMotion]);

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
              disclaimer
            </p>
            <p className="mt-5 max-w-64 text-[15px] leading-relaxed text-primary-500">
              Your workspaces and run history stay on your Mac by default. You choose the AI providers and tools for each task.
            </p>
          </div>
        </nav>

        <h2
          ref={wordmarkRef}
          aria-label="mains"
          className="mt-20 flex items-center justify-center whitespace-nowrap font-sans text-[clamp(3.5rem,18vw,18rem)] leading-none font-medium tracking-[-0.085em] select-none sm:mt-24"
        >
          {LETTERS.map((letter, index) => (
            <FooterLetter
              key={letter.character}
              letter={letter}
              intro={intro[index]}
              reducedMotion={reducedMotion}
            />
          ))}
        </h2>
      </div>
    </footer>
  );
}
