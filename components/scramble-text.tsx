"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

type ScrambleTextProps = {
  words: string[];
  interval?: number;
  className?: string;
};

export function ScrambleText({
  words,
  interval = 3000,
  className,
}: ScrambleTextProps) {
  const [display, setDisplay] = useState(words[0] ?? "");
  const indexRef = useRef(0);
  const displayRef = useRef(display);
  const animationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cycleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotionRef = useRef(false);
  const maxWordLength = useMemo(
    () => words.reduce((max, word) => Math.max(max, word.length), 0),
    [words]
  );

  useEffect(() => {
    displayRef.current = display;
  }, [display]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      prefersReducedMotionRef.current = mediaQuery.matches;
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    // Keep display in sync only when words are replaced from outside.
    if (!words.length) {
      setDisplay("");
      indexRef.current = 0;
      return;
    }

    const currentIndex = words.indexOf(displayRef.current);
    if (currentIndex === -1) {
      setDisplay(words[0] ?? "");
      indexRef.current = 0;
    } else {
      indexRef.current = currentIndex;
    }
  }, [words]);

  const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

  const encryptedLike = (target: string) =>
    target
      .split("")
      .map((char) => {
        if (char === " ") return " ";
        return randomChar();
      })
      .join("");

  useEffect(() => {
    if (!words.length) {
      setDisplay("");
      return;
    }

    let cancelled = false;

    const clearTimers = () => {
      if (cycleTimerRef.current) {
        clearTimeout(cycleTimerRef.current);
        cycleTimerRef.current = null;
      }
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;
      }
    };

    const animateTo = (target: string, onDone: () => void) => {
      if (prefersReducedMotionRef.current) {
        setDisplay(target);
        onDone();
        return;
      }

      const source = displayRef.current;
      const finalChars = target.split("");
      const maxLength = Math.max(source.length, target.length, 1);
      const encryptionFrames = Math.max(10, Math.min(18, target.length + 5));
      const decryptStepEvery = 2;
      const decryptFrames = maxLength * decryptStepEvery + 4;
      let step = 0;

      animationTimerRef.current = setInterval(() => {
        if (step < encryptionFrames) {
          setDisplay(encryptedLike(target));
        } else {
          const revealCount = Math.floor((step - encryptionFrames) / decryptStepEvery);
          setDisplay(
            Array.from({ length: maxLength }, (_, i) => {
              const finalChar = finalChars[i] ?? "";
              if (!finalChar) return "";
              if (i < revealCount) return finalChar;
              if (finalChar === " ") return " ";
              return randomChar();
            }).join("")
          );
        }

        step += 1;
        if (step > encryptionFrames + decryptFrames) {
          if (animationTimerRef.current) {
            clearInterval(animationTimerRef.current);
            animationTimerRef.current = null;
          }
          setDisplay(target);
          onDone();
        }
      }, 38);
    };

    const scheduleNext = () => {
      cycleTimerRef.current = setTimeout(() => {
        if (cancelled || !words.length) return;

        const nextIndex = (indexRef.current + 1) % words.length;
        const target = words[nextIndex] ?? "";

        animateTo(target, () => {
          if (cancelled) return;
          indexRef.current = nextIndex;
          scheduleNext();
        });
      }, interval);
    };

    clearTimers();
    scheduleNext();

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [interval, words]);

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        minWidth: maxWordLength ? `${maxWordLength}ch` : undefined,
      }}
      aria-live="polite"
    >
      {display}
    </span>
  );
}
