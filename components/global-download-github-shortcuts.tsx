"use client";

import { useEffect } from "react";
import { usePlatformDetection } from "@/hooks/usePlatformDetection";

function visibleIntersectionArea(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const top = Math.max(0, r.top);
  const left = Math.max(0, r.left);
  const bottom = Math.min(window.innerHeight, r.bottom);
  const right = Math.min(window.innerWidth, r.right);
  const w = Math.max(0, right - left);
  const h = Math.max(0, bottom - top);
  return w * h;
}

function pickBestAnchor(candidates: HTMLAnchorElement[]) {
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0]!;
  let best = candidates[0]!;
  let bestArea = visibleIntersectionArea(best);
  for (let i = 1; i < candidates.length; i++) {
    const el = candidates[i]!;
    const a = visibleIntersectionArea(el);
    if (a > bestArea) {
      bestArea = a;
      best = el;
    }
  }
  return best;
}

/** One listener for the homepage: D / C target the most visible matching link (hero vs CTA). */
export function GlobalDownloadGithubShortcuts() {
  const { isMac } = usePlatformDetection();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      const el = e.target as HTMLElement | null;
      if (!el) return;
      if (el.closest("input, textarea, select, [contenteditable=true]")) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const k = e.key.toLowerCase();
      if (k === "d") {
        if (!isMac) return;
        const anchors = [
          ...document.querySelectorAll<HTMLAnchorElement>("a[data-kbd-shortcut='download']"),
        ];
        if (anchors.length === 0) return;
        const visible = anchors.filter((a) => visibleIntersectionArea(a) > 0);
        const target = pickBestAnchor(visible.length ? visible : anchors);
        if (target) {
          e.preventDefault();
          target.click();
        }
        return;
      }
      if (k === "c") {
        const anchors = [
          ...document.querySelectorAll<HTMLAnchorElement>("a[data-kbd-shortcut='github']"),
        ];
        if (anchors.length === 0) return;
        const visible = anchors.filter((a) => visibleIntersectionArea(a) > 0);
        const target = pickBestAnchor(visible.length ? visible : anchors);
        if (target) {
          e.preventDefault();
          target.click();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMac]);

  return null;
}
