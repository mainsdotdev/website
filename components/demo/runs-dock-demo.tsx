"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { DiffStat } from "@/components/demo/diff-stat";
import { NavigationRail, type IconComponent } from "@/components/demo/navigation-rail";
import { ScaleToFit } from "@/components/demo/scale-to-fit";
import { Shine, SquareSpinner } from "@/components/demo/spinners";
import {
  ArrowUp,
  Attach,
  ClaudeMark,
  Codex,
  Copilot,
  Cursor,
  Document,
  Home,
  Layers,
  MainsStroke,
  Project,
  World,
} from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * The bottom-left corner of the Mains window: the sidebar with its
 * background-runs dock, after the app's `BackgroundRunsDock` — four runs, one
 * per agent, working in workspaces other than the one on screen. The deck
 * stacks and fans on its own, three seconds each way, using the app's own
 * geometry and 200ms transitions.
 */

type Run = {
  title: string;
  provider: string;
  Icon: IconComponent;
  /** The app's provider colors (`--color-claude` and friends), for the spinner. */
  color: string;
  /** Only Claude's mark carries its color in the app; the rest take the text's. */
  iconTint?: string;
  workspace: string;
  /** Seconds the run had been going when the page opened. */
  startedSecondsAgo: number;
  /** The latest line it streamed. */
  activity: string;
};

/** Oldest first, as the app orders them: the newest is the face of the deck. */
const RUNS: Run[] = [
  {
    title: "Fix race in sidebar-order e2e spec",
    provider: "Claude",
    Icon: ClaudeMark,
    color: "#d97757",
    iconTint: "#d97757",
    workspace: "fix/sidebar-flake",
    startedSecondsAgo: 728,
    activity: "Running npx playwright test sidebar-order --repeat-each=50",
  },
  {
    title: "Move run queue to SQLite WAL mode",
    provider: "Codex",
    Icon: Codex,
    color: "#0169cc",
    workspace: "feat/run-queue",
    startedSecondsAgo: 461,
    activity: "Editing packages/backend/src/db/schema.ts",
  },
  {
    title: "Add OAuth device flow to GitHub panel",
    provider: "Copilot",
    Icon: Copilot,
    color: "#8534f3",
    workspace: "feat/device-flow",
    startedSecondsAgo: 242,
    activity: "Reading github-device-flow-panel.tsx",
  },
  {
    title: "Virtualize the transcript list",
    provider: "Cursor",
    Icon: Cursor,
    color: "#727272",
    workspace: "perf/transcript",
    startedSecondsAgo: 79,
    activity: "Searching the code for useTranscriptValue",
  },
];

/** The app's `formatRunElapsed`. */
function formatElapsed(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  if (minutes > 0) return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
  return `${seconds}s`;
}

/** How long the deck stays stacked, then fanned. */
const TOGGLE_MS = 3000;
/** The app's stack geometry: each card behind peeks by this much, and narrows by as much. */
const STACK_PEEK_PX = 5;
const STACK_INSET_PX = 5;
const MAX_STACK_LAYERS = 2;

function RunCard({ run, tick }: { run: Run; tick: number }) {
  const { Icon } = run;
  return (
    <div className="rounded-2xl bg-primary-950 px-2.5 py-2 pr-6 glass-outline">
      <span className="flex min-w-0 items-center gap-1.5">
        <span className="flex size-3 shrink-0 items-center justify-center" style={{ color: run.color }}>
          <SquareSpinner className="size-2.5" />
        </span>
        <span className="truncate text-[11px] text-primary-50">{run.title}</span>
      </span>
      <span className="mt-1 flex min-w-0 items-center gap-1.5">
        <Icon
          className={cn("size-3 shrink-0", !run.iconTint && "text-primary-100")}
          style={run.iconTint ? { color: run.iconTint } : undefined}
        />
        <span className="truncate text-[9px] text-primary-300">
          {run.provider} · {run.workspace} · {formatElapsed(run.startedSecondsAgo + tick)}
        </span>
      </span>
      <Shine className="mt-0.5 text-[8.5px]">{run.activity}</Shine>
    </div>
  );
}

/**
 * The dock, after the app's: the newest run face-up with the next two as
 * edges peeking above it; fanned, every card shows, growing upward from the
 * face card, which stays put. One tree for both states, as in the app.
 */
function RunsDock({ fanned, tick }: { fanned: boolean; tick: number }) {
  const layers = Math.min(RUNS.length - 1, MAX_STACK_LAYERS);
  const face = RUNS[RUNS.length - 1];
  const behind = RUNS.slice(0, -1);

  return (
    <div role="region" aria-label="Runs working in the background" className="px-0.5 pb-1">
      <div
        className="relative transition-[padding] duration-200 ease-out"
        style={{ paddingTop: fanned ? 0 : layers * STACK_PEEK_PX }}
      >
        {Array.from({ length: layers }, (_, index) => {
          const depth = layers - index;
          return (
            <div
              key={depth}
              aria-hidden
              className="absolute h-10 rounded-2xl bg-primary-900 transition-opacity duration-200 ease-out glass-outline"
              style={{
                top: (layers - depth) * STACK_PEEK_PX,
                left: depth * STACK_INSET_PX,
                right: depth * STACK_INSET_PX,
                opacity: fanned ? 0 : 1 - depth * 0.25,
              }}
            />
          );
        })}

        {behind.map((run) => (
          <div
            key={run.title}
            className="grid transition-[grid-template-rows,opacity] duration-200 ease-out"
            style={{ gridTemplateRows: fanned ? "1fr" : "0fr", opacity: fanned ? 1 : 0 }}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="pb-1.5">
                <RunCard run={run} tick={tick} />
              </div>
            </div>
          </div>
        ))}
        <div className="relative">
          <RunCard run={face} tick={tick} />
        </div>
      </div>
    </div>
  );
}

type Workspace = { branch: string; diff?: { additions: number; deletions: number }; active?: boolean };

const PROJECTS: { name: string; icon: IconComponent; tint: string; workspaces: Workspace[] }[] = [
  {
    name: "mains",
    icon: MainsStroke,
    tint: "text-(--color-accent,var(--color-blue-400))",
    workspaces: [
      { branch: "feat/atlas", diff: { additions: 228, deletions: 7 }, active: true },
      { branch: "feat/run-queue", diff: { additions: 184, deletions: 22 } },
      { branch: "fix/sidebar-flake", diff: { additions: 4, deletions: 1 } },
      { branch: "feat/device-flow", diff: { additions: 96, deletions: 3 } },
    ],
  },
  {
    name: "website",
    icon: World,
    tint: "text-orange-500",
    workspaces: [{ branch: "perf/transcript", diff: { additions: 61, deletions: 148 } }],
  },
  { name: "docs", icon: Document, tint: "text-amber-500", workspaces: [{ branch: "master" }] },
  { name: "home", icon: Home, tint: "text-green-500", workspaces: [{ branch: "main" }] },
];

function SidebarPanel({ fanned, tick }: { fanned: boolean; tick: number }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col pr-2 pb-1.5 pl-1">
      <div className="flex items-center gap-1 px-1.5 pb-1 text-xs tracking-tight text-primary-200">
        <span className="font-semibold">Mains</span>
        <span>Code</span>
        <ArrowUp className="size-3 rotate-180 text-primary-400" />
      </div>
      <div className="flex items-center gap-2 rounded-lg px-1.5 py-1 text-[10px] text-primary-100">
        <Project className="size-3 text-primary-100" />
        <span>Add Project</span>
        <span className="ml-auto text-[9px] text-primary-400">⌘N</span>
      </div>
      <div className="mt-2 flex items-center justify-between px-1.5 py-1">
        <span className="text-[10px] font-medium text-primary-400">Workspaces</span>
        <Layers className="size-3 text-primary-200" />
      </div>

      {/* The list gives way as the dock fans up over it. */}
      <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden">
        {PROJECTS.map(({ name, icon: Icon, tint, workspaces }) => (
          <div key={name}>
            <div className="flex items-center gap-1.5 px-1.5 py-1">
              <Icon className={cn("size-2.5 shrink-0", tint)} />
              <span className="truncate text-[10px] font-medium text-primary-50">{name}</span>
            </div>
            {workspaces.map(({ branch, diff, active }) => (
              <div
                key={branch}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg py-1 pr-2 pl-5.5",
                  active && "bg-primary-50/5 glass-outline"
                )}
              >
                <span className="min-w-0 flex-1 truncate text-[10px] text-primary-100">{branch}</span>
                {diff && (
                  <DiffStat additions={diff.additions} deletions={diff.deletions} className="shrink-0 font-mono text-[8px]" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <RunsDock fanned={fanned} tick={tick} />
    </div>
  );
}

/** The chat on screen meanwhile: the tail of its last turn and the composer. */
function ChatTail() {
  return (
    <div className="mr-1 mb-1 flex min-w-0 flex-1 flex-col justify-end rounded-xl bg-(--demo-content) px-8 pb-4">
      <p className="text-[10px] leading-5 text-primary-200">
        All four runs are going in their own workspaces. Atlas stays checked out here, so keep
        working; each one shows up in the dock until it finishes.
      </p>
      <div className="mt-4 rounded-[18px] bg-primary-900/20 pb-1.5 glass-card">
        <div className="px-3.5 pt-1 pb-0.5 text-[10px] text-primary-400">
          Ask a follow-up, use @ or / for commands, files, plugins, and skills
        </div>
        <div className="flex items-center gap-2.5 px-3 pt-3 text-[10px] text-primary-200">
          <Attach className="size-3" />
          <ClaudeMark className="size-3 text-[#d97757]" />
          <span className="text-primary-50">Sonnet 5.5</span>
        </div>
      </div>
    </div>
  );
}

/** The size the view is drawn at; ScaleToFit fits it to the container. */
const DESIGN_WIDTH = 640;
const DESIGN_HEIGHT = 360;

export function RunsDockDemo({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  const [fanned, setFanned] = useState(false);
  const [tick, setTick] = useState(0);

  // Elapsed labels advance on one shared clock, as in the app.
  useEffect(() => {
    const clock = setInterval(() => setTick((value) => value + 1), 1000);
    return () => clearInterval(clock);
  }, []);

  // Stacked, then fanned, three seconds each. With reduced motion the deck
  // stays fanned, so every run can be read without anything moving.
  useEffect(() => {
    if (reducedMotion) return;
    const toggle = setInterval(() => setFanned((value) => !value), TOGGLE_MS);
    return () => clearInterval(toggle);
  }, [reducedMotion]);

  const shownFanned = reducedMotion ? true : fanned;

  return (
    <ScaleToFit designWidth={DESIGN_WIDTH} designHeight={DESIGN_HEIGHT} className={cn("pointer-events-none", className)}>
      <div
        role="img"
        aria-label="The Mains sidebar with four runs, one per agent, working in the background dock"
        className="relative h-full w-full overflow-hidden text-left select-none"
      >
        {/* The window runs off the top and right: only its bottom-left corner shows. */}
        <div className="absolute bottom-6 left-6 h-140 w-215 overflow-hidden rounded-xl bg-(--demo-chrome) text-primary-200 shadow-[0_24px_60px_-20px_var(--demo-shadow)] glass-outline">
          <div className="flex h-full flex-col">
            <div className="flex h-9 shrink-0 items-center gap-1.5 px-3">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex min-h-0 flex-1">
              <aside className="flex w-76 shrink-0">
                <NavigationRail />
                <SidebarPanel fanned={shownFanned} tick={tick} />
              </aside>
              <ChatTail />
            </div>
          </div>
        </div>
      </div>
    </ScaleToFit>
  );
}
