"use client";

import { usePrExpandPressed } from "@/components/demo/pr-flow";
import {
  ArrowUp,
  Attach,
  Branch,
  ChevronRight,
  Commit,
  Diff,
  Link,
  Maximize,
  Pr,
  Sparkles,
} from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * The app's session panel with Create pull request open, after the app's
 * git-actions panel: the workspace's changes and branch, commit and pull,
 * then the PR form — base branch, a title and a Markdown description that
 * Mains drafts when left blank. Nothing is wired up; inside a `PrFlowProvider`
 * its expand button is pressed on cue, and the form grows into the PR dialog.
 */

/** Up and down chevrons, the app's select affordance. */
function SelectChevrons({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="M3.5 4.5 6 2l2.5 2.5M3.5 7.5 6 10l2.5-2.5" />
    </svg>
  );
}

function Row({
  icon,
  label,
  trailing,
  muted = false,
}: {
  icon?: React.ReactNode;
  label: string;
  trailing?: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2 px-3 py-1.5", muted ? "text-primary-500" : "text-primary-100")}>
      {icon && <span className="flex size-3 shrink-0 items-center justify-center [&>svg]:size-3">{icon}</span>}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {trailing && <span className="flex shrink-0 items-center gap-1.5 text-primary-400">{trailing}</span>}
    </div>
  );
}

const FIELD = "rounded-lg px-2 py-1.5 glass-input";
const TOOLBAR = ["H", "B", "I", "❞", "</>"] as const;

export function SessionPanel({ className }: { className?: string }) {
  const expandPressed = usePrExpandPressed();

  return (
    <div
      className={cn(
        "flex w-60 flex-col rounded-2xl bg-primary-950 py-1.5 text-[10px] shadow-2xl shadow-(--demo-shadow) glass-outline",
        className
      )}
    >
      <div className="px-3 pt-1 pb-1 text-[9px] text-primary-400">mains</div>

      <Row
        icon={<Diff />}
        label="Changes"
        muted
        trailing={
          <>
            <span className="text-green-400/70">+0</span>
            <span className="text-red-400/70">-0</span>
            <ChevronRight className="size-2.5" />
          </>
        }
      />
      <Row icon={<Branch />} label="feat/atlas" trailing={<ChevronRight className="size-2.5" />} />
      <Row icon={<Commit />} label="Commit or push" trailing={<ChevronRight className="size-2.5" />} />
      <Row icon={<ArrowUp className="rotate-180" />} label="Pull" />
      <Row icon={<Pr />} label="Create pull request" trailing={<ArrowUp className="size-2.5 rotate-180" />} />

      {/* The open form. */}
      <div data-pr-form className="mx-1.5 mt-0.5 rounded-xl bg-primary-900/70 px-2 pt-2 pb-2 text-[9px]">
        <div className="flex items-center justify-between px-0.5 text-primary-400">
          Open the pull request into
          <span
            className={cn(
              "-m-1 rounded-md p-1 transition-colors duration-150",
              expandPressed && "bg-primary-50/15 text-primary-50"
            )}
          >
            <Maximize className="size-2.5" />
          </span>
        </div>

        <div className={cn(FIELD, "mt-1.5 flex items-center gap-1.5 text-[10px] text-primary-100")}>
          <Branch className="size-3 shrink-0" />
          main ← feat/atlas
          <SelectChevrons className="ml-auto size-2.5 text-primary-400" />
        </div>

        <div className={cn(FIELD, "mt-1.5 text-primary-500")}>PR title (leave blank to generate)…</div>

        <div className="mt-1.5 overflow-hidden rounded-lg glass-input">
          <div className="flex gap-3 px-2 pt-1.5">
            <span className="border-b border-(--color-accent,var(--color-blue-400)) pb-1 text-primary-50">Write</span>
            <span className="pb-1 text-primary-400">Preview</span>
          </div>
          <div className="flex items-center gap-2.5 border-t border-primary-50/8 px-2 py-1.5 text-primary-400">
            {TOOLBAR.map((mark) => (
              <span key={mark} className={cn(mark === "B" && "font-bold", mark === "I" && "italic")}>
                {mark}
              </span>
            ))}
            <Link className="size-2.5" />
            <span>1.</span>
            <span>•</span>
            <span className="size-2 rounded-[2px] border border-primary-400" />
          </div>
          <div className="h-16 border-t border-primary-50/8 px-2 py-1.5 text-primary-500">
            Description (optional, leave blank to generate)…
          </div>
          <div className="flex items-center gap-1.5 border-t border-primary-50/8 px-2 py-1 text-primary-400">
            <Attach className="size-2.5" />
            Paste or drop media
            <span className="ml-auto flex items-center gap-1 rounded-md px-1.5 py-0.5 text-primary-200 glass-button">
              <Sparkles className="size-2.5" />
              Generate
            </span>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-1.5 px-0.5 text-primary-300">
          <span className="size-2.5 rounded-[3px] border border-primary-50/25" />
          Create as draft
        </div>
        <div className="mt-2 flex items-center gap-1.5 px-0.5 text-[10px] text-primary-50">
          <Pr className="size-3" />
          Create pull request
        </div>
      </div>

      <div className="mt-1.5 border-t border-primary-50/8" />
      <Row label="Sources" trailing={<ChevronRight className="size-2.5" />} />
    </div>
  );
}
