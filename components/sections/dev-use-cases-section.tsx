"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { BrowserDemo, DevBrowserDemo } from "@/components/demo/browser-demo";
import { McpAppDemo } from "@/components/demo/mcp-app-demo";
import { MockupActiveContext } from "@/components/demo/pr-flow";
import { ReviewDemo } from "@/components/demo/review-demo";
import { Apps, Pr, Review, Web } from "@/components/icons";
import { MAINS_DOCS_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const PREVIEW = {
  title: "Preview and annotate live.",
  description: "Watch changes land in the built-in browser and point at what to fix.",
  Icon: Web,
  Mockup: BrowserDemo,
  docsPath: "browser",
} as const;

/** The same, with the browser on the developer home page itself. */
const PREVIEW_DEV = { ...PREVIEW, Mockup: DevBrowserDemo } as const;

const REVIEW = {
  title: "Review in context.",
  description: "Comment on any line of the diff and send it straight to the agent.",
  Icon: Review,
  Mockup: ReviewDemo,
  docsPath: "reviews",
} as const;

const APPS = {
  title: "Apps beside your agents.",
  description: "Open MCP apps next to the chat and shape the first draft together.",
  Icon: Apps,
  Mockup: McpAppDemo,
  docsPath: "plugins",
} as const;

/**
 * Its window renders markdown, so the page draws it on the server and hands
 * it in as `shipMockup` rather than this client component importing it.
 */
const SHIP = {
  title: "Ship from the session panel.",
  description: "Commit, push, and open a pull request with its title and description drafted for you.",
  Icon: Pr,
  Mockup: null,
  docsPath: "git-actions",
} as const;

/** The home page's use cases, each with its mockup, list icon and docs page. */
export const DEV_USE_CASES = [PREVIEW_DEV, REVIEW, SHIP] as const;

/** The Work page keeps the apps case: shipping a pull request is developer work. */
export const WORK_USE_CASES = [PREVIEW, REVIEW, APPS] as const;

/**
 * The developer page's use cases, after obsidian.md's feature rows: a list on
 * the left whose hovered row picks the mockup shown on the right, in the same
 * window frame as the rest of the page.
 *
 * Hover (or focus, or a tap) decides what is shown — not the scroll position —
 * and the row highlight slides to the new row rather than jumping. The three
 * mockups stay mounted and cross-fade, so moving between rows never resets a
 * demo someone was playing with.
 */
export function DevUseCasesSection({ shipMockup }: { shipMockup: React.ReactNode }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section aria-labelledby="dev-use-cases-title" className="px-5 py-24 sm:px-8 lg:py-32">
      <div className="max-w-2xl">
        <h2
          id="dev-use-cases-title"
          className="text-5xl leading-none tracking-tight text-primary-50 sm:text-6xl"
        >
          Built for agent workflows.
        </h2>
        <p className="mt-6 text-xl leading-snug text-primary-400">
          Preview, review, and work beside your agents without leaving Mains.{" "}
          <Link
            href={MAINS_DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 transition-colors hover:text-blue-300"
          >
            Learn more.
          </Link>
        </p>
      </div>

      {/* The list and the screen share a row and center on each other, so
          the heading above doesn't push the list below the screen. */}
      <div className="mt-12 grid items-center gap-10 lg:mt-16 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-14">
        <div>
          <LayoutGroup id="dev-use-case-highlight">
            <ul className="flex flex-col gap-1">
              {DEV_USE_CASES.map(({ title, description, Icon }, index) => {
                const active = index === activeIndex;
                return (
                  <li key={title}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(index)}
                      onFocus={() => setActiveIndex(index)}
                      onClick={() => setActiveIndex(index)}
                      aria-pressed={active}
                      className="relative flex w-full cursor-pointer gap-3.5 rounded-2xl px-4 py-3.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    >
                      {active && (
                        <motion.span
                          layoutId="highlight"
                          aria-hidden
                          className="absolute inset-0 rounded-2xl bg-primary-50/8"
                          transition={
                            prefersReducedMotion
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 380, damping: 36 }
                          }
                        />
                      )}
                      <Icon aria-hidden className="relative mt-0.5 size-4.5 shrink-0 text-blue-400" />
                      <span className="relative text-base leading-relaxed text-primary-400">
                        <span className="font-medium text-primary-50">{title}</span>{" "}
                        {description}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </LayoutGroup>
        </div>

        {/* The window frame the page's other mockups use; the selected
            mockup fills it exactly. */}
        <div className="overflow-hidden rounded-xl border border-primary-700/40 bg-primary-900 p-1 shadow-[0_32px_80px_-24px_var(--demo-shadow)]">
          <div className="relative aspect-video overflow-hidden rounded-lg border border-primary-700/20 bg-primary-950">
            {DEV_USE_CASES.map(({ title, Mockup }, index) => {
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
                  {/* The ship mockup plays its pull request flow only while shown. */}
                  <MockupActiveContext value={active}>
                    {Mockup ? <Mockup className="absolute inset-0" /> : shipMockup}
                  </MockupActiveContext>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
