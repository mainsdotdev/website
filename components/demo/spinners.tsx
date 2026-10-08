"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * The app's loading affordances for the mockups, after its `ascii-spinner`
 * family and `.shine-text`. The app animates them from index.css keyframes;
 * these use framer-motion, so they need nothing from the site's stylesheet.
 */

/** The app's "Generating…" text: muted, with a highlight sweeping across. */
export function Shine({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.span
      className={cn("block truncate bg-clip-text text-transparent", className)}
      style={{
        backgroundImage:
          "radial-gradient(circle at center, var(--color-primary-100), transparent), linear-gradient(var(--color-primary-600), var(--color-primary-600))",
        backgroundSize: "200% 100%, 100% 100%",
        backgroundRepeat: "no-repeat",
      }}
      initial={{ backgroundPosition: "200% 0%, 0 0" }}
      animate={{ backgroundPosition: "-200% 0%, 0 0" }}
      transition={{ duration: 2, ease: "linear", repeat: Infinity }}
    >
      {children}
    </motion.span>
  );
}

/** The app's generate spinner: a 3×3 grid of squares twinkling at random. */
export function GenerateSpinner({ className = "size-2.5" }: { className?: string }) {
  const [cells] = useState(() =>
    Array.from({ length: 9 }, () => ({ duration: 0.9 + Math.random() * 1.1, delay: Math.random() * 1.5 }))
  );
  return (
    <span aria-hidden className={cn("grid shrink-0 grid-cols-3 grid-rows-3 gap-px", className)}>
      {cells.map(({ duration, delay }, index) => (
        <motion.span
          key={index}
          className="rounded-[1px] bg-current"
          animate={{ opacity: [0.15, 1, 0.15] }}
          transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

/**
 * The app's square spinner, for a run at work: a 3×3 grid whose lit cells
 * sweep diagonally — top-left to bottom-right, then bottom-left to top-right —
 * once each per two-second cycle. Takes its color from the text.
 */
const SQUARE_CELLS = Array.from({ length: 9 }, (_, index) => {
  const row = Math.floor(index / 3);
  const col = index % 3;
  // Each cell peaks once per sweep, at its place along that sweep's diagonal.
  const first = 0.1 + ((row + col) / 4) * 0.25;
  const second = 0.6 + ((2 - row + col) / 4) * 0.25;
  return {
    times: [0, first - 0.08, first, first + 0.08, second - 0.08, second, second + 0.08, 1],
    opacity: [0.25, 0.25, 1, 0.25, 0.25, 1, 0.25, 0.25],
  };
});

export function SquareSpinner({ className = "size-2.5" }: { className?: string }) {
  return (
    <span aria-hidden className={cn("grid shrink-0 grid-cols-3 grid-rows-3 gap-px", className)}>
      {SQUARE_CELLS.map(({ times, opacity }, index) => (
        <motion.span
          key={index}
          className="rounded-[1px] bg-current"
          animate={{ opacity }}
          transition={{ duration: 2, times, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </span>
  );
}
