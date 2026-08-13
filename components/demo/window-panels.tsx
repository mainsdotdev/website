"use client";

import { AgentGlyph } from "@/components/agent-glyph";
import { useWindowState } from "@/components/demo/window-state";
import {
  ArrowUp,
  Branch,
  Check,
  Commit,
  Diff,
  Menu,
  Minimize,
  Pr,
  React as ReactFileIcon,
  Terminal,
  Toggle,
  Web,
} from "@/components/icons";
import { cn } from "@/lib/utils";

/** `--color-success` from the app's theme. */
const SUCCESS_TEXT = "text-[#22C55E]";
/** The app's diff colors (features/workspace/lib/severity.ts), dark half. */
const ADDED_TEXT = "text-green-400";
const REMOVED_TEXT = "text-red-400";

/**
 * The panels' open/close curves. Longer than the app's LAYOUT_PANEL_ANIM_MS
 * (150ms) and matched to the content column's slide, so a toggle reads as one
 * motion instead of a panel snapping and the column drifting after it.
 */
const PANEL_ANIM = "duration-300 ease-out";
const POP_EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)";

/** Seeds double as display names — the glyph hashes off the agent's name. */
const SUBAGENTS = [
  "Agent tool safety audit",
  "Command injection audit",
  "Maintainability review",
  "Test gap review",
  "Security risk review",
] as const;

function DiffStat({
  additions,
  deletions,
  className,
}: {
  additions: number;
  deletions: number;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-1 font-medium", className)}>
      <span className={ADDED_TEXT}>+{additions}</span>
      <span className={REMOVED_TEXT}>-{deletions}</span>
    </span>
  );
}

/** The app's PanelItem, flattened to a presentational row. */
function PanelRow({
  icon,
  label,
  trailing,
  className,
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-center gap-2 px-3 py-1.5 text-left text-[11px] text-primary-200",
        className
      )}
    >
      <span className="shrink-0 text-primary-400">{icon}</span>
      <span className="flex-1 truncate font-medium">{label}</span>
      {trailing && (
        <span className="shrink-0 text-[10px] text-primary-400 tabular-nums">
          {trailing}
        </span>
      )}
    </div>
  );
}

const PANEL_SURFACE =
  "w-[230px] overflow-hidden rounded-2xl bg-[#0c0c0c]/95 shadow-2xl shadow-black/50 glass-outline";

function ChangesPanel() {
  return (
    <div className={PANEL_SURFACE}>
      <PanelRow
        icon={<Diff className="size-3.5" />}
        label="Changes"
        trailing={
          <span className="flex items-center gap-1.5">
            <DiffStat additions={1} deletions={11} className="text-[10px]" />
            <ArrowUp className="size-2.5 rotate-180 text-primary-500" />
          </span>
        }
      />

      <div className="bg-primary-50/[0.04]">
        <PanelRow
          icon={<ReactFileIcon className="size-3.5" />}
          label="github-device-flow-panel.tsx"
          trailing={
            <DiffStat additions={1} deletions={11} className="text-[10px]" />
          }
        />
      </div>

      <PanelRow
        icon={<Branch className="size-3.5" />}
        label="feature/issue-pr-screen"
        trailing={<ArrowUp className="size-2.5 rotate-90 text-primary-500" />}
      />
      <PanelRow
        icon={<Commit className="size-3.5" />}
        label="Commit or push"
        trailing={<ArrowUp className="size-2.5 rotate-90 text-primary-500" />}
      />
      <PanelRow
        icon={<Pr className="size-3.5" />}
        label="Create pull request"
        trailing={<ArrowUp className="size-2.5 rotate-90 text-primary-500" />}
      />
    </div>
  );
}

function SubagentsPanel({ onCollapse }: { onCollapse: () => void }) {
  return (
    <div className={PANEL_SURFACE}>
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <span className="text-[11px] font-medium text-primary-200">
          Subagents ({SUBAGENTS.length})
        </span>
        <button
          type="button"
          onClick={onCollapse}
          aria-label="Hide subagents"
          className="cursor-pointer rounded-md p-0.5 text-primary-200 transition-colors hover:text-white"
        >
          <Minimize className="size-3.5 -scale-x-100" />
        </button>
      </div>

      {SUBAGENTS.map((name) => (
        <PanelRow
          key={name}
          icon={<AgentGlyph seed={name} className="size-3" />}
          label={name}
          trailing={<Check className={cn("size-3", SUCCESS_TEXT)} />}
        />
      ))}
    </div>
  );
}

/** Dismissed state: the app's small pill with the agents' glyphs and count. */
function SubagentsPill({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Show subagents"
      className="flex cursor-pointer items-center gap-2 rounded-2xl bg-[#0c0c0c]/95 px-2.5 py-2 shadow-2xl shadow-black/50 transition-colors glass-outline hover:bg-primary-50/5"
    >
      {SUBAGENTS.slice(0, 3).map((name) => (
        <AgentGlyph key={name} seed={name} className="size-3.5" />
      ))}
      <span className="text-[11px] font-medium text-primary-200 tabular-nums">
        {SUBAGENTS.length}
      </span>
    </button>
  );
}

/** The window toolbar. Lives in the title bar; drives the panels below. */
export function WindowToolbar() {
  const { changesOpen, toggleChanges } = useWindowState();

  return (
    <div className="mb-2 ml-auto flex items-center gap-3 text-primary-500">
      <button
        type="button"
        onClick={toggleChanges}
        aria-pressed={changesOpen}
        aria-label="Toggle the session panel"
        className={cn(
          "cursor-pointer transition-colors",
          changesOpen ? "text-primary-100" : "hover:text-primary-300"
        )}
      >
        <Menu className="size-3.5" />
      </button>
      <Web className="size-3.5" />
      <Terminal className="size-3.5" />
      <Toggle className="size-3.5" />
    </div>
  );
}

/**
 * The two floating panels, anchored to the window's corners.
 *
 * They must render as a child of the window frame itself, not of the title
 * bar: the title bar's `backdrop-filter` makes it a containing block, which
 * would re-anchor these to that 40px strip.
 *
 * Open/close follows the app: the box scales out of the corner it lives in
 * (`transformOrigin`), overshooting slightly on the way in.
 */
export function FloatingPanels() {
  const { changesOpen, subagentsOpen, setSubagentsOpen } = useWindowState();

  return (
    <>
      <div
        className={cn(
          "absolute top-12 right-4 origin-top-right transition-all",
          PANEL_ANIM,
          changesOpen
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-90 opacity-0"
        )}
        style={changesOpen ? { transitionTimingFunction: POP_EASE } : undefined}
        aria-hidden={!changesOpen}
      >
        <ChangesPanel />
      </div>

      {/* Panel and pill share the corner; whichever is hidden scales away. */}
      <div
        className={cn(
          "absolute right-4 bottom-6 origin-bottom-right transition-all",
          PANEL_ANIM,
          subagentsOpen
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-90 opacity-0"
        )}
        style={subagentsOpen ? { transitionTimingFunction: POP_EASE } : undefined}
        aria-hidden={!subagentsOpen}
      >
        <SubagentsPanel onCollapse={() => setSubagentsOpen(false)} />
      </div>

      <div
        className={cn(
          "absolute right-4 bottom-6 origin-bottom-right transition-all",
          PANEL_ANIM,
          subagentsOpen
            ? "pointer-events-none scale-90 opacity-0"
            : "scale-100 opacity-100"
        )}
        style={subagentsOpen ? undefined : { transitionTimingFunction: POP_EASE }}
        aria-hidden={subagentsOpen}
      >
        <SubagentsPill onOpen={() => setSubagentsOpen(true)} />
      </div>
    </>
  );
}
