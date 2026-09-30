"use client";

import Image from "next/image";
import { LayoutGroup, motion, useInView, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

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
type FluidFontSize = readonly [minimumRem: number, preferredVw: number, maximumRem: number];

const DEFAULT_FONT_SIZE: FluidFontSize = [3.5, 18, 14];

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
  fontSize,
  loadImages,
  eager,
  onImageSettled,
}: {
  letter: LetterArt;
  intro: IntroState;
  reducedMotion: boolean | null;
  fontSize: FluidFontSize;
  loadImages: boolean;
  eager: boolean;
  onImageSettled: (src: string) => void;
}) {
  const [decodedImages, setDecodedImages] = useState<ReadonlySet<string>>(() => new Set());
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

  const image = letter.images[hoverActive ? hoverVariant : intro.variant];
  // Keep the glyph visible, and its width unchanged, until the art can be painted.
  const active = (intro.active || hoverActive) && decodedImages.has(image.src);
  const imageWidth = `${image.displayWidth ?? 0.70 * (image.width / image.height)}em`;
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
      {/* Mounted art stays decoded between the intro and later hover/touch reveals. */}
      {letter.images.map((variant) => {
        const visible = active && variant.src === image.src;
        const width = variant.displayWidth ?? 0.70 * (variant.width / variant.height);

        return (
          <motion.span
            key={variant.src}
            className="absolute inset-0 inline-flex items-center justify-center"
            initial={false}
            animate={visible
              ? { opacity: 1, scale: 1, y: 0, rotate: 0 }
              : reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.78, y: "0.08em", rotate: -5 }}
            transition={visible ? transition : { duration: 0 }}
          >
            <span className="inline-flex h-[0.86em] w-full min-w-0 items-center justify-center">
              {loadImages && (
                <Image
                  src={variant.src}
                  alt=""
                  width={variant.width}
                  height={variant.height}
                  sizes={`clamp(${fontSize[0] * width}rem, ${fontSize[1] * width}vw, ${fontSize[2] * width}rem)`}
                  loading="eager"
                  fetchPriority={eager ? "high" : "auto"}
                  onLoad={() => {
                    // next/image calls onLoad after decoding, including cache hits.
                    setDecodedImages((current) => current.has(variant.src)
                      ? current
                      : new Set(current).add(variant.src));
                    onImageSettled(variant.src);
                  }}
                  onError={() => onImageSettled(variant.src)}
                  draggable={false}
                  className="pointer-events-none block h-full w-full min-w-0 object-contain select-none"
                />
              )}
            </span>
          </motion.span>
        );
      })}
      <motion.span
        className="absolute inset-0 inline-flex items-center justify-center"
        initial={false}
        animate={active
          ? reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.84, y: "0.07em" }
          : { opacity: 1, scale: 1, y: 0 }}
        transition={active ? { duration: 0 } : transition}
      >
        {letter.character}
      </motion.span>
    </motion.span>
  );
}

export function AnimatedLetterWord({
  letters,
  label,
  as: Heading = "h1",
  className,
  fontSize = DEFAULT_FONT_SIZE,
  eager = false,
  fullRevealHoldMs,
}: {
  letters: readonly LetterArt[];
  label: string;
  as?: "h1" | "h2";
  className: string;
  /** Heading clamp values in rem / vw / rem; each variant scales its own sizes. */
  fontSize?: FluidFontSize;
  /** Above-the-fold wordmarks load in the initial HTML; others warm up near view. */
  eager?: boolean;
  fullRevealHoldMs?: number;
}) {
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const inView = useInView(wordmarkRef, { once: true, amount: 0.35 });
  const nearView = useInView(wordmarkRef, { once: true, margin: "600px 0px" });
  const reducedMotion = useReducedMotion();
  const imageCount = new Set(letters.flatMap((letter) => letter.images.map((image) => image.src))).size;
  const settledImages = useRef(new Set<string>());
  const [imagesReady, setImagesReady] = useState(false);
  const handleImageSettled = useCallback((src: string) => {
    settledImages.current.add(src);
    if (settledImages.current.size === imageCount) setImagesReady(true);
  }, [imageCount]);
  const [intro, setIntro] = useState<IntroState[]>(() =>
    letters.map(() => ({ active: false, variant: 0 })),
  );

  useEffect(() => {
    if (!inView || !imagesReady || reducedMotion !== false) return;

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
  }, [fullRevealHoldMs, imagesReady, inView, letters, reducedMotion]);

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
            fontSize={fontSize}
            loadImages={eager || nearView}
            eager={eager}
            onImageSettled={handleImageSettled}
          />
        ))}
      </Heading>
    </LayoutGroup>
  );
}
