"use client";

import { useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * The app's loading affordances for the mockups, after its `ascii-spinner`
 * family and `.shine-text`. `SquareSpinner` runs on the app's own keyframes,
 * lifted into globals.css; `Shine` and `GenerateSpinner` use framer-motion.
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

/** Cycle length and keyframe peak — must match `toolSquarePulse` in globals.css. */
const SQUARE_DUR_MS = 2000;
const SQUARE_PEAK = 0.28;
/** Fraction of a half-cycle that each diagonal sweep spans. */
const SQUARE_SWEEP = 0.25;

/**
 * Per-cell pulse delays, ported from the app's `square-spinner.tsx`. `d1` drives
 * the top-left → bottom-right pass over the first half of the cycle, `d2` the
 * bottom-left → top-right pass over the second. Negative delays put every cell
 * mid-cycle on first paint.
 */
const SQUARE_CELLS = Array.from({ length: 9 }, (_, index) => {
  const row = Math.floor(index / 3);
  const col = index % 3;
  const phase = (target: number) => Math.round((target - SQUARE_PEAK) * SQUARE_DUR_MS);
  return {
    d1: phase(((row + col) / 4) * SQUARE_SWEEP),
    d2: phase(0.5 + ((2 - row + col) / 4) * SQUARE_SWEEP),
  };
});

const SQUARE_TEMPLATE = "repeat(3, minmax(0, 1fr))";

/**
 * The app's square spinner, for a run at work: a 3×3 grid whose lit cells
 * sweep diagonally — top-left to bottom-right, then bottom-left to top-right —
 * once each per two-second cycle. Takes its color from the text. Cell styling
 * and keyframes live in globals.css (`.tool-square`), lifted from the app.
 */
export function SquareSpinner({ className = "size-2.75" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("grid shrink-0 gap-px", className)}
      style={{ gridTemplateColumns: SQUARE_TEMPLATE, gridTemplateRows: SQUARE_TEMPLATE }}
    >
      {SQUARE_CELLS.map(({ d1, d2 }, index) => (
        <span
          key={index}
          className="tool-square"
          style={{ "--tsq-d1": `${d1}ms`, "--tsq-d2": `${d2}ms` } as CSSProperties}
        />
      ))}
    </span>
  );
}
