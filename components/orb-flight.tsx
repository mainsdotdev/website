"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ambientVoiceLevels, VoiceOrb } from "@/components/voice-orb";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

/**
 * One voice orb that travels down the page with the scroll: from the hero
 * into the hero window's voice chat, then into each use case in turn — the
 * floating decoration turning out to be part of the product, and staying
 * with the reader.
 *
 * Every stop is an empty placeholder that only reports where it is. The orb
 * itself is a single element in document coordinates (absolute on <body>), so
 * ordinary scrolling moves it with the page on the compositor while it sits
 * at a stop; script only supplies the in-between positions. One orb means one
 * WebGL context, and never two orbs on screen at once.
 *
 * Desktop widths only (the hero orb is hidden below `lg`), and never with
 * reduced motion: every stop then draws its own orb in place.
 */

/** The stops, in the order the orb visits them down the page. */
const STOPS = ["hero", "app-window", "case-browser", "case-review", "case-app"] as const;
export type OrbStop = (typeof STOPS)[number];

const stops = new Map<OrbStop, HTMLElement>();
let heroHovered = false;

/** The orb is drawn at this size and scaled to each stop, so the canvas never resizes mid-flight. */
const BASE_SIZE = 96;
/** Consecutive stops are never closer than this much scroll, even when both start on screen. */
const MIN_FLIGHT = 160;
/**
 * The share of the scroll between two use cases spent travelling. Before it,
 * the orb rides along with the stop it is leaving; the first flight, out of
 * the hero, travels the whole way.
 */
const TRAVEL_SHARE = 0.55;
/**
 * How long, in seconds, the orb takes to close most of the gap to where the
 * scroll position puts it. A wheel moves the page in ~100px steps; following
 * scroll directly would make the orb hop with every one of them, so it glides
 * after the scroll position instead.
 */
const FOLLOW_TIME = 0.14;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function useOrbFlight() {
  const wide = useMediaQuery("(min-width: 1024px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  return wide && !reducedMotion;
}

/** Hovering the hero end makes the agent "answer": the orb swirls faster. */
export function voiceLevelsWithHover(timeMs: number) {
  const levels = ambientVoiceLevels(timeMs);
  return heroHovered ? { input: 0.35, output: Math.min(1, levels.output + 0.45) } : levels;
}

export function setOrbHovered(hovered: boolean) {
  heroHovered = hovered;
}

function register(stop: OrbStop, element: HTMLElement | null) {
  if (element) stops.set(stop, element);
  else stops.delete(stop);
}

/** Registers the hero end. Stable, so it is called once on mount and once on unmount. */
export function heroEndRef(element: HTMLElement | null) {
  register("hero", element);
}

/**
 * A stop along the way: an empty slot while the flying orb is in charge, or
 * the orb itself where there is no flight (narrow screens, reduced motion).
 */
export function OrbFlightSlot({ stop, className }: { stop: Exclude<OrbStop, "hero">; className?: string }) {
  const flying = useOrbFlight();
  const slotRef = useCallback((element: HTMLElement | null) => register(stop, element), [stop]);

  if (!flying) return <VoiceOrb className={className} />;
  return <span ref={slotRef} aria-hidden data-orb-stop={stop} className={cn("block shrink-0", className)} />;
}

type Point = { x: number; y: number; size: number };
type Placed = Point & { dock: number; visible: number };

/**
 * The orb in flight. Mounted by the hero end only once `useOrbFlight` is true,
 * which it never is on the server or during hydration — so `document` exists
 * by the time this renders.
 */
export function FlyingOrb() {
  const orbRef = useRef<HTMLDivElement>(null);
  const body = typeof document === "undefined" ? null : document.body;

  useEffect(() => {
    if (!body) return;
    let frame = 0;
    let hover = 0;
    let written = "";
    // Where each stop last was. A stop that leaves the DOM (its chat tab
    // closed) keeps its place on the route, invisible, so the orb fades out
    // there instead of the route — and the orb — jumping.
    const lastKnown = new Map<OrbStop, Point & { dock: number }>();
    // The scroll position the orb is drawn at, trailing the real one. Starts
    // on it, so a page restored mid-scroll doesn't fly in.
    let scroll: number | null = null;
    let lastTime: number | undefined;

    const measure = (): Placed[] => {
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const route: Placed[] = [];
      for (const stop of STOPS) {
        const element = stops.get(stop);
        const r = element?.getBoundingClientRect();
        if (element && r && r.width > 0) {
          // A stop is reached when the frame it sits in is centred on screen;
          // the hero is where the page starts.
          const frame = element.closest("[data-orb-frame]")?.getBoundingClientRect() ?? r;
          const dock = stop === "hero" ? 0 : frame.top + scrollY + frame.height / 2 - window.innerHeight / 2;
          const point = { x: r.left + scrollX + r.width / 2, y: r.top + scrollY + r.height / 2, size: r.width, dock };
          lastKnown.set(stop, point);
          route.push({ ...point, visible: 1 });
        } else {
          const known = lastKnown.get(stop);
          if (known) route.push({ ...known, visible: 0 });
        }
      }
      // Keep the route moving forward even where two stops dock close together.
      for (let i = 1; i < route.length; i++) {
        route[i].dock = Math.max(route[i].dock, route[i - 1].dock + MIN_FLIGHT);
      }
      return route;
    };

    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      const dt = lastTime === undefined ? 0 : Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;
      const orb = orbRef.current;
      if (!orb || !stops.has("hero")) return;

      const route = measure();
      if (route.length === 0) return;

      const target = window.scrollY;
      if (scroll === null || Math.abs(target - scroll) < 0.5) scroll = target;
      else scroll += (target - scroll) * (1 - Math.exp(-dt / FOLLOW_TIME));

      // The leg the orb is on, and how far along it.
      let from = route[0];
      let to = route[0];
      let t = 0;
      for (let i = 0; i < route.length - 1; i++) {
        if (scroll < route[i + 1].dock || i === route.length - 2) {
          from = route[i];
          to = route[i + 1];
          const span = to.dock - from.dock;
          const share = i === 0 ? 1 : TRAVEL_SHARE;
          const start = to.dock - span * share;
          t = easeInOutCubic(clamp01((scroll - start) / (to.dock - start)));
          break;
        }
      }

      // Hover only means something while the orb is still in the hero.
      const inHero = from === route[0] && t < 0.1;
      hover += ((heroHovered && inHero ? 1 : 0) - hover) * 0.2;
      const size = lerp(from.size, to.size, t);
      const scale = (size / BASE_SIZE) * (1 + 0.2 * hover);
      const x = lerp(from.x, to.x, t) - BASE_SIZE / 2;
      const y = lerp(from.y, to.y, t) - BASE_SIZE / 2;
      const opacity = lerp(from.visible, to.visible, t);

      const next = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})|${opacity.toFixed(3)}`;
      if (next === written) return;
      written = next;
      orb.style.transform = next.split("|")[0];
      orb.style.opacity = next.split("|")[1];
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [body]);

  if (!body) return null;
  return createPortal(
    <div
      ref={orbRef}
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 z-30 transition-opacity duration-200"
      style={{ width: BASE_SIZE, height: BASE_SIZE, opacity: 0, willChange: "transform" }}
    >
      <VoiceOrb getLevels={voiceLevelsWithHover} className="size-full" />
    </div>,
    body
  );
}
