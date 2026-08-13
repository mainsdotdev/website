"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/types";
import { cn } from "@/lib/utils";

type TableOfContentsProps = {
  items: TocItem[];
};

/**
 * Sticky article outline. Desktop-only by design — it lives in the left gutter
 * and the caller hides it below `lg`.
 */
export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    // Track every heading's viewport position and pick the last one that has
    // crossed the top band — a plain "is intersecting" test leaves long
    // sections with no active entry once their heading scrolls away.
    const observer = new IntersectionObserver(
      () => {
        const scrolledPast = headings.filter(
          (el) => el.getBoundingClientRect().top <= 120
        );
        const current = scrolledPast.at(-1) ?? headings[0];
        setActiveId(current.id);
      },
      { rootMargin: "-120px 0px -66% 0px", threshold: [0, 1] }
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  // `scroll-behavior: smooth` sits on <body>, which the document scroller
  // ignores — so the scroll is driven here instead of by the bare hash jump.
  const onSelect = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const heading = document.getElementById(id);
    if (!heading || event.metaKey || event.ctrlKey || event.shiftKey) return;

    event.preventDefault();
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    heading.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
    setActiveId(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="flex flex-col gap-4">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={(event) => onSelect(event, item.id)}
          className={cn(
            "text-xs leading-snug transition-colors hover:text-white ",
            item.level === 3 && "pl-4",
            activeId === item.id ? "text-white" : "text-primary-400"
          )}
        >
          {item.title}
        </a>
      ))}
    </nav>
  );
}
