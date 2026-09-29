"use client";

import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export type LetterImage = {
  src: string;
  width: number;
  height: number;
  /** Visual width relative to the heading's font size, for padded cutouts. */
  displayWidth?: number;
};

export type LetterArt = {
  character: string;
  images: readonly LetterImage[];
};

type IntroState = { active: boolean; variant: number };

const INTRO_START_MS = 120;
const INTRO_STAGGER_MS = 155;
const IMAGE_REVEAL_MS = 360;
const OUTRO_STAGGER_MS = 105;

function randomVariant(count: number) {
  return Math.floor(Math.random() * count);
}

function AnimatedLetter({
  letter,
  intro,
  reducedMotion,
  imageSizes,
}: {
  letter: LetterArt;
  intro: IntroState;
  reducedMotion: boolean | null;
  imageSizes: string;
}) {
  const [hoverActive, setHoverActive] = useState(false);
  const [hoverVariant, setHoverVariant] = useState(0);
  const hoverActiveRef = useRef(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
  const imageWidth = `${image.displayWidth ?? 0.86 * (image.width / image.height)}em`;
  const transition = reducedMotion
    ? { duration: 0.12 }
    : { duration: IMAGE_REVEAL_MS / 1000, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.span
      className="relative inline-flex h-[1em] shrink-0 items-center justify-center align-middle"
      layout={reducedMotion ? false : "position"}
      style={active ? { width: imageWidth } : undefined}
      transition={{ layout: { type: "spring", stiffness: 290, damping: 31, mass: 0.85 } }}
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
      {/* The hidden glyph reserves its width before hydration and whenever art is inactive. */}
      <span
        className={active ? "pointer-events-none invisible absolute whitespace-nowrap" : "pointer-events-none invisible whitespace-nowrap"}
      >
        {letter.character}
      </span>
      <AnimatePresence initial={false} mode="wait">
        {active ? (
          <motion.span
            key={`image-${image.src}`}
            className="absolute inset-0 inline-flex items-center justify-center"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.78, y: "0.08em", rotate: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            transition={transition}
          >
            <span className="inline-flex h-[0.86em] w-full min-w-0 items-center justify-center">
              <Image
                src={image.src}
                alt=""
                width={image.width}
                height={image.height}
                sizes={imageSizes}
                unoptimized
                draggable={false}
                className="pointer-events-none block h-full w-full min-w-0 object-contain select-none"
              />
            </span>
          </motion.span>
        ) : (
          <motion.span
            key="character"
            className="absolute inset-0 inline-flex items-center justify-center"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.84, y: "0.07em" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            transition={transition}
          >
            {letter.character}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  );
}

export function AnimatedLetterWord({
  letters,
  label,
  as: Heading = "h1",
  className,
  imageSizes = "(max-width: 640px) 19vw, 18vw",
  fullRevealHoldMs,
}: {
  letters: readonly LetterArt[];
  label: string;
  as?: "h1" | "h2";
  className: string;
  imageSizes?: string;
  fullRevealHoldMs?: number;
}) {
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const inView = useInView(wordmarkRef, { once: true, amount: 0.35 });
  const reducedMotion = useReducedMotion();
  const [intro, setIntro] = useState<IntroState[]>(() =>
    letters.map(() => ({ active: false, variant: 0 })),
  );

  useEffect(() => {
    if (!inView || reducedMotion) return;

    const outroStartMs = fullRevealHoldMs === undefined
      ? 1330
      : INTRO_START_MS + Math.max(0, letters.length - 1) * INTRO_STAGGER_MS + IMAGE_REVEAL_MS + fullRevealHoldMs;

    const timers = letters.flatMap((letter, index) => [
      setTimeout(() => {
        setIntro((current) =>
          current.map((state, stateIndex) =>
            stateIndex === index
              ? { active: true, variant: randomVariant(letter.images.length) }
              : state,
          ),
        );
      }, INTRO_START_MS + index * INTRO_STAGGER_MS),
      setTimeout(() => {
        setIntro((current) =>
          current.map((state, stateIndex) =>
            stateIndex === index ? { ...state, active: false } : state,
          ),
        );
      }, outroStartMs + index * OUTRO_STAGGER_MS),
    ]);

    return () => timers.forEach(clearTimeout);
  }, [fullRevealHoldMs, inView, letters, reducedMotion]);

  return (
    <LayoutGroup>
      <Heading
        ref={wordmarkRef}
        aria-label={label}
        className={className}
      >
        {letters.map((letter, index) => (
          <AnimatedLetter
            key={`${letter.character}-${index}`}
            letter={letter}
            intro={intro[index]}
            reducedMotion={reducedMotion}
            imageSizes={imageSizes}
          />
        ))}
      </Heading>
    </LayoutGroup>
  );
}
