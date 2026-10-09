"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GenerateSpinner, Shine } from "@/components/demo/spinners";
import {
  Attach,
  Branch,
  CheckCircle,
  Link,
  Menu,
  Minimize,
  Pr,
  Sparkles,
} from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Creating a pull request from the session panel, played out in the mockup
 * the way the app does it: the panel's form expands into the PR dialog, Generate
 * drafts the title and description, and Create closes the dialog and the
 * panel behind a toast. The app expands the form with a view transition; the
 * mockup is drawn scaled, so here the dialog's box grows out of the form's
 * measured place with the Web Animations API, on the app's 340ms curve.
 */

/** Whether a mockup is the one on show. Its section sets it; the flow plays only then. */
export const MockupActiveContext = createContext(false);

type Phase =
  | "panel"
  | "expanding"
  | "modal"
  | "generating"
  | "generated"
  | "creating"
  | "created"
  | "done";

/** When each step begins, in ms from the mockup coming on show. */
const TIMELINE: ReadonlyArray<readonly [Phase, number]> = [
  ["expanding", 900],
  ["modal", 1200],
  ["generating", 2300],
  ["generated", 4800],
  ["creating", 7000],
  ["created", 8300],
  ["done", 11300],
];

const PhaseContext = createContext<Phase>("panel");

const panelOpen = (phase: Phase) => phase === "panel" || phase === "expanding";
const modalOpen = (phase: Phase) =>
  phase === "modal" || phase === "generating" || phase === "generated" || phase === "creating";

function Timeline({ active, children }: { active: boolean; children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("panel");

  useEffect(() => {
    if (!active) return;
    const timers = TIMELINE.map(([next, at]) => setTimeout(() => setPhase(next), at));
    return () => timers.forEach(clearTimeout);
  }, [active]);

  return <PhaseContext value={phase}>{children}</PhaseContext>;
}

/**
 * Runs the flow from the start each time the mockup comes on show, and puts it
 * back to the open panel when it goes. Keyed on that, so a replay starts fresh.
 */
export function PrFlowProvider({ children }: { children: React.ReactNode }) {
  const active = useContext(MockupActiveContext);
  return (
    <Timeline key={active ? "on" : "off"} active={active}>
      {children}
    </Timeline>
  );
}

/** Whether the expand button is being pressed, for the session panel to draw. */
export function usePrExpandPressed() {
  return useContext(PhaseContext) === "expanding";
}

/** The title bar's session-panel toggle: filled while the panel is open. */
export function SessionPanelToggle() {
  const open = panelOpen(useContext(PhaseContext));
  return (
    <Menu
      className={cn("size-3.5 transition-colors", open && "text-primary-100")}
      fill={open ? "currentColor" : "none"}
    />
  );
}

/**
 * The content column while the flow runs: padded out of the session panel's
 * way while it is open, and reclaiming the lane once it closes — as it does
 * the moment the dialog opens, like the app's panel.
 */
export function PrFlowColumn({
  className,
  panel,
  children,
}: {
  className: string;
  panel: React.ReactNode;
  children: React.ReactNode;
}) {
  const open = panelOpen(useContext(PhaseContext));
  return (
    <div className={cn(className, "transition-[padding] duration-300 ease-out motion-reduce:transition-none", open ? "pr-68" : "pr-11")}>
      {children}
      <div
        aria-hidden={!open}
        className={cn(
          "absolute top-2 right-2 origin-top-right transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
          open ? "opacity-100" : "pointer-events-none translate-x-2 scale-98 opacity-0"
        )}
      >
        {panel}
      </div>
    </div>
  );
}

function SelectChevrons({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="M3.5 4.5 6 2l2.5 2.5M3.5 7.5 6 10l2.5-2.5" />
    </svg>
  );
}

const PR_TITLE = "feat(atlas): Add Atlas document and image library";
const PR_BODY = `## Summary

Adds Atlas, an account-scoped library for Pages and generated or saved documents and images. Includes rich-text Page editing and chat, image generation, file previews, and tools for working with Pages.

## Changes

- Add Atlas library views for Pages, Docs, Images, and Trash, with search, filters, tabs, and save-aware navigation.
- Add Page editing, revisions, covers, templates, and provider-powered Page chats.
- Add image generation runs and discovery of generated images from Codex.
- Add Save to Atlas for run outputs and attachments, plus image derivatives and previews.`;

const FIELD = "rounded-xl px-3 py-2 glass-input";
const TOOLBAR = ["H", "B", "I", "❞", "</>"] as const;

/** The dialog's size in the mockup's 1152-wide design: the app's 768×704, at its scale. */
const DIALOG = { width: 540, height: 500 };

function Dialog({ phase }: { phase: Phase }) {
  const generating = phase === "generating";
  const filled = phase === "generated" || phase === "creating";

  return (
    <div className="flex h-full flex-col text-[10.5px] text-primary-100">
      <div className="flex items-center gap-2 px-5 pt-4 pb-2">
        <Pr className="size-3.5 text-primary-400" />
        <span className="flex-1 text-[13px] text-primary-50">Create pull request</span>
        <Minimize className="size-3.5 text-primary-500" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3.5 px-5 py-3">
        <div className="space-y-1.5">
          <span className="block font-medium text-primary-300">Open the pull request into</span>
          <div className={cn(FIELD, "flex items-center gap-2")}>
            <Branch className="size-3 shrink-0" />
            main ← feat/atlas
            <SelectChevrons className="ml-auto size-3 text-primary-400" />
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="block font-medium text-primary-300">Title</span>
          <div className={cn(FIELD, "h-8.5")}>
            {filled ? (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="block truncate text-primary-50">
                {PR_TITLE}
              </motion.span>
            ) : generating ? (
              <Shine>Generating PR title…</Shine>
            ) : (
              <span className="block truncate text-primary-500">PR title (leave blank to generate)…</span>
            )}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-1.5">
          <span className="block font-medium text-primary-300">Description</span>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl glass-input">
            <div className="flex items-center gap-4 border-b border-primary-50/8 px-3">
              <span className="border-b-2 border-(--color-accent,var(--color-blue-400)) py-2 text-primary-50">Write</span>
              <span className="py-2 text-primary-400">Preview</span>
              <span className="ml-auto flex items-center gap-3 text-primary-400">
                {TOOLBAR.map((mark) => (
                  <span key={mark} className={cn(mark === "B" && "font-bold", mark === "I" && "italic")}>
                    {mark}
                  </span>
                ))}
                <Link className="size-3" />
                <span>1.</span>
                <span>•</span>
                <span className="size-2.5 rounded-[2px] border border-primary-400" />
              </span>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden px-3 py-2.5 leading-relaxed">
              {filled ? (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-pre-wrap text-primary-50">
                  {PR_BODY}
                </motion.p>
              ) : generating ? (
                <Shine>Generating description…</Shine>
              ) : (
                <span className="text-primary-500">Description (optional, leave blank to generate)…</span>
              )}
            </div>
            <div className="flex items-center gap-2 border-t border-primary-50/8 px-3 py-1.5 text-primary-400">
              <Attach className="size-3" />
              Paste or drop media
              <span
                className={cn(
                  "ml-auto flex items-center gap-1.5 rounded-lg px-2 py-1 transition-opacity glass-button",
                  generating ? "text-primary-400 opacity-60" : "text-primary-200"
                )}
              >
                {generating ? <GenerateSpinner /> : <Sparkles className="size-3" />}
                {generating ? "Generating" : "Generate"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 pt-1 pb-4">
        <span className="flex items-center gap-2 text-primary-300">
          <span className="size-3 rounded-[4px] bg-primary-800" />
          Create as draft
        </span>
        <span
          className={cn(
            "rounded-xl bg-(--color-accent,#2563eb) px-3.5 py-2 text-[11px] font-medium text-(--color-accent-foreground,#fff) transition-[opacity,transform] duration-150",
            generating && "opacity-50",
            phase === "creating" && "scale-97 opacity-80"
          )}
        >
          Create pull request
        </span>
      </div>
    </div>
  );
}

/** The app's toast, at the top centre of the window. */
function Toast({ phase }: { phase: Phase }) {
  const shown = phase === "creating" || phase === "created";
  const created = phase === "created";
  return (
    <div
      className={cn(
        "absolute top-10 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl px-3.5 py-2 text-[11px] text-primary-50  transition-[opacity,transform] duration-200 ease-out glass-card motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      )}
    >
      {created ? <CheckCircle className="size-3.5 text-green-400" /> : <GenerateSpinner />}
      {created ? "Pull request created" : "Creating pull request…"}
    </div>
  );
}

/**
 * The PR dialog over the whole window, and the toast. Mounted once at the
 * window's root, beside the chrome, so the dialog can cover the sidebar and
 * isn't clipped by the content column.
 */
export function PrFlowDialog() {
  const phase = useContext(PhaseContext);
  const reducedMotion = useReducedMotion();
  const layerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const open = modalOpen(phase);

  // Grow the dialog out of the session panel's form, as the app's view
  // transition does: the box morphs from the form's place to its own, while
  // the dialog's content fades in over it.
  useLayoutEffect(() => {
    if (phase !== "modal" || reducedMotion) return;
    const layer = layerRef.current;
    const box = boxRef.current;
    const form = layer?.parentElement?.querySelector<HTMLElement>("[data-pr-form]");
    if (!layer || !box || !form) return;

    const layerRect = layer.getBoundingClientRect();
    // The mockup is drawn scaled; measure in its own, unscaled pixels.
    const scale = layerRect.width / layer.offsetWidth || 1;
    const from = form.getBoundingClientRect();
    const to = box.getBoundingClientRect();
    const dx = (from.left - to.left) / scale;
    const dy = (from.top - to.top) / scale;

    const curve = { duration: 340, easing: "cubic-bezier(0.22, 1, 0.36, 1)" };
    box.animate(
      [
        { transform: `translate(${dx}px, ${dy}px)`, width: `${from.width / scale}px`, height: `${from.height / scale}px`, borderRadius: "12px" },
        { transform: "translate(0, 0)", width: `${DIALOG.width}px`, height: `${DIALOG.height}px`, borderRadius: "24px" },
      ],
      curve
    );
    contentRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 280, delay: 40, easing: "ease-out", fill: "backwards" });
  }, [phase, reducedMotion]);

  return (
    <div ref={layerRef} aria-hidden className="pointer-events-none absolute inset-0 z-30">
      <div
        className={cn(
          "absolute inset-0 bg-black/55 transition-opacity duration-200 ease-out motion-reduce:transition-none",
          open ? "opacity-100" : "opacity-0"
        )}
      />
      {open && (
        <div
          ref={boxRef}
          className="absolute top-1/2 left-1/2 -mt-62.5 -ml-67.5 overflow-hidden rounded-3xl bg-primary-900  glass-outline"
          style={{ width: DIALOG.width, height: DIALOG.height }}
        >
          {/* Laid out at the dialog's full size, so the growing box reveals
              it from the top left rather than reflowing it. */}
          <div ref={contentRef} style={{ width: DIALOG.width, height: DIALOG.height }}>
            <Dialog phase={phase} />
          </div>
        </div>
      )}
      <Toast phase={phase} />
    </div>
  );
}
