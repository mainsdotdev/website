import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * The developer page's blueprint layout, after zed.dev: content sits in a
 * column between two hairline rails, sections are divided by rules that run
 * the full width of the page, and every place a rule crosses a rail is marked
 * with a crosshair. Ruler ticks run along the rails and under each rule, over
 * a faint grid that fades out toward the sides of the page.
 *
 * All of it is decoration — `aria-hidden` and click-through — drawn in
 * `currentColor` at low opacity, so it follows the theme like everything else.
 */

/** The rails' and rules' line color. */
const LINE = "bg-primary-50/10";
/** Fade a rule out toward the page edges instead of cutting it off. */
const RULE_MASK = "linear-gradient(to right, transparent, #000 15%, #000 85%, transparent)";
/** Fade a rail's ticks out at its top and bottom. */
const RAIL_MASK = "linear-gradient(to bottom, transparent, #000 10%, #000 90%, transparent)";

const hairline = (direction: "right" | "bottom") =>
  `linear-gradient(to ${direction}, currentColor 1px, transparent 1px)`;

/**
 * A 48px square grid behind one soft radial fade, so it shows through in
 * places and is gone in others. One only: a second radial over it (the old
 * vignette) drew its edge as nested arcs across the sections.
 */
const GRID: CSSProperties = {
  backgroundImage: `${hairline("right")}, ${hairline("bottom")}`,
  backgroundSize: "48px 48px",
  backgroundPosition: "center top",
  maskImage: "radial-gradient(ellipse 60% 55% at 50% 30%, #000 10%, transparent 75%)",
};

/** Ruler ticks along a rule: a short one every 8px, a full-height one every 64px. */
const TICKS_X: CSSProperties = {
  backgroundImage: `${hairline("right")}, ${hairline("right")}`,
  backgroundSize: "64px 100%, 8px 50%",
  backgroundRepeat: "repeat-x",
  maskImage: RULE_MASK,
};

/** The same ticks down a rail; `side` anchors the short ones to its line. */
const ticksY = (side: "left" | "right"): CSSProperties => ({
  backgroundImage: `${hairline("bottom")}, ${hairline("bottom")}`,
  backgroundSize: "100% 64px, 50% 8px",
  backgroundRepeat: "repeat-y",
  backgroundPosition: `${side} top`,
  maskImage: RAIL_MASK,
});

/** A small + where a rule crosses a rail, centered on the intersection. */
function Crosshair({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("absolute size-2.5 -translate-x-1/2 -translate-y-1/2", className)}>
      <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-primary-50/40" />
      <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-primary-50/40" />
    </span>
  );
}

/**
 * The page-wide grid under the column. Its parent must be `relative isolate`
 * so this sits under the content without falling behind the page background.
 * It fades out at the bottom, so it meets the footer without a seam.
 */
export function BlueprintBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{ maskImage: "linear-gradient(to bottom, #000 calc(100% - 16rem), transparent)" }}
    >
      <div className="absolute inset-0 text-primary-50/5" style={GRID} />
    </div>
  );
}

/**
 * The column between the rails: the window's `max-w-6xl` plus the sections'
 * `px-8` on each side, so the window sits inside the rails with room to
 * breathe, as on zed.dev.
 */
export function BlueprintColumn({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative mx-auto w-full max-w-304", className)}>
      <span aria-hidden className={cn("pointer-events-none absolute inset-y-0 left-0 w-px", LINE)} />
      <span aria-hidden className={cn("pointer-events-none absolute inset-y-0 right-0 w-px", LINE)} />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-px hidden w-1.5 text-primary-50/15 sm:block"
        style={ticksY("left")}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-px hidden w-1.5 text-primary-50/15 sm:block"
        style={ticksY("right")}
      />
      {children}
    </div>
  );
}

/**
 * A section divider: a hairline across the whole page, crosshairs where it
 * meets the rails, and a strip of ruler ticks under it inside the column.
 * The page must clip sideways (`overflow-x-clip`), since the line is as wide
 * as the viewport wherever the column sits.
 */
export function BlueprintRule() {
  return (
    <div aria-hidden className="pointer-events-none relative h-px">
      <span
        className={cn("absolute top-0 left-1/2 h-px w-screen -translate-x-1/2", LINE)}
        style={{ maskImage: RULE_MASK }}
      />
      <span className="absolute inset-x-0 top-px hidden h-1.5 text-primary-50/15 sm:block" style={TICKS_X} />
      <Crosshair className="top-0 left-0" />
      <Crosshair className="top-0 left-full" />
    </div>
  );
}

/**
 * A finer 16px grid, centered so its edge lines sit a half cell in from the
 * rules and rails around it rather than doubling them.
 */
const FINE_GRID: CSSProperties = {
  backgroundImage: `${hairline("right")}, ${hairline("bottom")}`,
  backgroundSize: "16px 16px",
  backgroundPosition: "center",
};

/** Hatching for the bands between sections, as on zed.dev: a 1px line every 8px, at 45°. */
const HATCH: CSSProperties = {
  backgroundImage: "repeating-linear-gradient(-45deg, currentColor 0 1px, transparent 1px 8px)",
};

/**
 * Breathing room between two sections: each is closed off by its own rule,
 * with a hatched band between them that the rails run through. The band is
 * filled solid first, so the page grid doesn't show through and cross it.
 */
export function BlueprintGap() {
  return (
    <>
      <BlueprintRule />
      <div aria-hidden className="h-16 bg-primary-950 text-primary-50/8 lg:h-24" style={HATCH} />
      <BlueprintRule />
    </>
  );
}

/**
 * A section on the finer 16px grid instead of the page grid, like the closing
 * call to action. The grid is its own layer behind the content, so it never
 * colors the section's text.
 */
export function BlueprintGridPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate">
      <div aria-hidden className="absolute inset-0 -z-10 bg-primary-950 text-primary-50/6" style={FINE_GRID} />
      {children}
    </div>
  );
}
