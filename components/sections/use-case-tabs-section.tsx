"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { WORK_USE_CASES } from "@/components/sections/dev-use-cases-section";
import { MAINS_DOCS_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const PANEL_ID = "use-case-tabs-panel";

/**
 * Use cases as three columns over one large screen, after obsidian.md's
 * "Publish instantly." section. Hovering a column (or focusing or tapping
 * it) shows its mockup below; the highlight slides between columns.
 *
 * The screen is cut short and fades out at the bottom, so it reads as a
 * glimpse of the app rather than a framed picture. The mockups stay mounted
 * and cross-fade, so switching never resets a demo mid-interaction.
 */
export function UseCaseTabsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section aria-labelledby="use-case-tabs-title" className="px-5 py-24 sm:px-8 lg:py-32">
      <h2 id="use-case-tabs-title" className="text-5xl leading-none tracking-tight text-primary-50 sm:text-6xl">
        Work beside your agents.
      </h2>
      <p className="mt-6 max-w-2xl text-xl leading-snug text-primary-400">
        Preview, review, and open apps next to the chat, without leaving Mains.{" "}
        <Link
          href={MAINS_DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 transition-colors hover:text-blue-300"
        >
          Learn more.
        </Link>
      </p>

      <LayoutGroup id="use-case-tabs">
        <div role="tablist" aria-label="Use cases" className="mt-12 grid gap-2 sm:grid-cols-3">
          {WORK_USE_CASES.map(({ title, description, Icon }, index) => {
            const active = index === activeIndex;
            return (
              <button
                key={title}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={PANEL_ID}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                className="relative cursor-pointer rounded-2xl p-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                {active && (
                  <motion.span
                    layoutId="highlight"
                    aria-hidden
                    className="absolute inset-0 rounded-2xl bg-primary-50/6"
                    transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 36 }}
                  />
                )}
                <Icon aria-hidden className="relative size-6 text-blue-400" />
                <span
                  className={cn(
                    "relative mt-4 block text-xl font-medium tracking-tight transition-colors duration-200",
                    active ? "text-primary-50" : "text-primary-300"
                  )}
                >
                  {title.replace(/\.$/, "")}
                </span>
                <span
                  className={cn(
                    "relative mt-2 block text-base leading-relaxed transition-colors duration-200",
                    active ? "text-primary-400" : "text-primary-500"
                  )}
                >
                  {description}
                </span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      {/* The frame shows the top of a 16:9 mockup and fades out over its
          lower half, like a screen running off the bottom of the page. */}
      <div
        id={PANEL_ID}
        role="tabpanel"
        aria-label={WORK_USE_CASES[activeIndex].title}
        className="relative mt-10 aspect-16/7.5 overflow-hidden rounded-t-2xl border border-b-0 border-primary-700/40 bg-primary-900 p-1 pb-0"
        style={{ maskImage: "linear-gradient(to bottom, #000 55%, transparent)" }}
      >
        <div className="relative aspect-video overflow-hidden rounded-t-xl bg-primary-950">
          {WORK_USE_CASES.map(({ title, Mockup }, index) => {
            const active = index === activeIndex;
            return (
              <div
                key={title}
                aria-hidden={!active}
                inert={!active}
                className={cn(
                  "absolute inset-0 transition-opacity duration-300 ease-out",
                  active ? "opacity-100" : "opacity-0"
                )}
              >
                <Mockup className="absolute inset-0" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
