"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { EDITED_FILES } from "@/components/demo/full-access-data";
import { ScaleToFit } from "@/components/demo/scale-to-fit";
import { Shine } from "@/components/demo/spinners";
import { TurnChangesCard } from "@/components/demo/turn-changes-card";
import {
  ArrowUp,
  Attach,
  Bolt,
  ChevronDown,
  Clipboard,
  Codex,
  Edit,
  Goal,
  Chat,
  Pr,
  React as ReactFileIcon,
  Sparkles,
  VoiceWave,
} from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * The end of a Codex chat and its composer, after the app's workspace input:
 * a review request is written, `@` opens the unified context menu, Code Review
 * is picked from the plugins and lands as a chip, and the message is sent.
 * It loops like the clip it replaces.
 */

type Step = "idle" | "at" | "messages" | "review" | "picked" | "sending" | "sent";

/** When each step begins, in ms into the loop; the loop restarts at LOOP_MS. */
const STEPS: ReadonlyArray<readonly [Step, number]> = [
  ["at", 1400],
  ["messages", 2100],
  ["review", 2600],
  ["picked", 3300],
  ["sending", 4300],
  ["sent", 4550],
];
const LOOP_MS = 8500;

/** Which menu row is highlighted at each step while the menu is open. */
const ACTIVE_ROW: Partial<Record<Step, number>> = { at: 0, messages: 1, review: 2 };

type Plugin = { name: string; description: string; tile: string; glyph: React.ReactNode };

const ICON_GLYPH = "size-3 text-white";

/** The Codex plugin catalog's first rows, as the app lists them under Plugins. */
const PLUGINS: Plugin[] = [
  {
    name: "Computer Use",
    description: "Control Mac apps from ChatGPT",
    tile: "bg-linear-to-br from-[#f472b6] via-[#a78bfa] to-[#38bdf8]",
    glyph: (
      <svg viewBox="0 0 12 12" aria-hidden className={ICON_GLYPH} fill="currentColor">
        <path d="M2 1.5 10.5 5 6.6 6.4 5.2 10.3Z" />
      </svg>
    ),
  },
  {
    name: "Messages",
    description: "Read, search, and send with Messages on this Mac",
    tile: "bg-[#34c759]",
    glyph: <Chat className={ICON_GLYPH} />,
  },
  {
    name: "Code Review",
    description: "Review and manage GitHub pull requests",
    tile: "bg-white",
    glyph: <Pr className="size-3 text-black" />,
  },
  {
    name: "Visualize",
    description: "Create interactive visuals",
    tile: "bg-[#2f6fe4]",
    glyph: <Sparkles className={ICON_GLYPH} />,
  },
];

const CODE_REVIEW = PLUGINS[2];

function PluginTile({ plugin, className }: { plugin: Plugin; className?: string }) {
  return (
    <span className={cn("flex shrink-0 items-center justify-center rounded-md", plugin.tile, className)}>
      {plugin.glyph}
    </span>
  );
}

/** The file mention in the prompt: its icon and name, in the accent. */
function FileChip() {
  return (
    <span className="inline-flex items-center gap-1 align-baseline text-(--color-accent,var(--color-blue-400))">
      <ReactFileIcon className="size-3 self-center text-sky-400" />
      full-access-confirmation-modal.tsx
    </span>
  );
}

/** A picked plugin in the prompt: its tile and name, muted. */
function PluginChip() {
  return (
    <span className="inline-flex items-center gap-1 align-baseline text-primary-300">
      <PluginTile plugin={CODE_REVIEW} className="size-3.5 self-center rounded-[4px] [&>svg]:size-2.5" />
      Code Review
    </span>
  );
}

function Prompt({ chip }: { chip: React.ReactNode }) {
  return (
    <>
      Review <FileChip /> and its integration for bugs, edge cases, and code quality. Verify
      confirmation behavior, check for duplicated logic, and ensure consistency with existing app
      conventions. {chip}
    </>
  );
}

/** The unified context menu, opening upward from the composer, after the app's. */
function ContextMenu({ activeRow }: { activeRow: number }) {
  return (
    <div className="absolute bottom-full left-2 mb-1.5 w-80 rounded-2xl bg-(--glass-fill-surface) p-1.5 shadow-2xl shadow-(--demo-shadow) glass-outline">
      <div className="px-2.5 pt-1 pb-1 text-[9px] font-medium text-primary-400">Plugins</div>
      {PLUGINS.map((plugin, index) => (
        <div
          key={plugin.name}
          className={cn(
            "flex items-start gap-2 rounded-xl px-2.5 py-1.5 transition-colors duration-150",
            index === activeRow && "bg-primary-50/8"
          )}
        >
          <PluginTile plugin={plugin} className="mt-0.5 size-5" />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="flex items-center gap-1.5">
              <span className="truncate text-[10.5px] font-medium text-primary-50">{plugin.name}</span>
              <span className="ml-auto shrink-0 rounded-full px-1.5 py-px text-[8.5px] text-primary-400 glass-surface">
                Plugin
              </span>
            </span>
            <span className="line-clamp-2 text-[9.5px] text-primary-400">{plugin.description}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

/** The size the view is drawn at; ScaleToFit fits it to the container. */
const DESIGN_WIDTH = 640;
const DESIGN_HEIGHT = 360;

export function ComposerMentionDemo({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState<Step>("idle");
  const [loop, setLoop] = useState(0);

  // One pass of the loop; bumping `loop` schedules the next.
  useEffect(() => {
    if (reducedMotion) return;
    const timers = STEPS.map(([next, at]) => setTimeout(() => setStep(next), at));
    timers.push(
      setTimeout(() => {
        setStep("idle");
        setLoop((value) => value + 1);
      }, LOOP_MS)
    );
    return () => timers.forEach(clearTimeout);
  }, [loop, reducedMotion]);

  // With reduced motion, one still: the plugin picked, ready to send.
  const shown: Step = reducedMotion ? "picked" : step;
  const menuOpen = shown in ACTIVE_ROW;
  const picked = shown === "picked" || shown === "sending";
  const sent = shown === "sent";

  return (
    <ScaleToFit designWidth={DESIGN_WIDTH} designHeight={DESIGN_HEIGHT} className={cn("pointer-events-none", className)}>
      <div
        role="img"
        aria-label="A Codex chat in Mains: a review request mentions a file, @ opens the context menu, and the Code Review plugin is picked and sent"
        className="relative flex h-full w-full flex-col justify-end overflow-hidden bg-(--demo-content) px-10 pb-5 text-left text-primary-200 select-none"
      >
        {/* The end of the transcript, sitting on the composer. Its items keep
            their size, so a new message pushes the rest up and out of view,
            as a chat scrolls, rather than squeezing them. */}
        <div className="flex min-h-0 flex-col justify-end gap-3 overflow-hidden *:shrink-0">
          <p className="text-[10px] leading-5 text-primary-200">
            Added a Codex Full Access confirmation modal to the project composer and Codex
            settings. Full Access is applied only when the user confirms; Cancel leaves the
            current mode unchanged.
          </p>
          <TurnChangesCard files={EDITED_FILES} />
          <div className="flex items-center gap-2 text-[10px] text-primary-400">
            <span>6m 14s</span>
            <span>·</span>
            <Clipboard className="size-3" />
          </div>
          {sent && (
            <div className="flex flex-col gap-2">
              <div className="ml-auto max-w-[85%] rounded-2xl bg-primary-900/50 px-3 py-2 text-[10px] leading-relaxed text-primary-200">
                <Prompt chip={<PluginChip />} />
              </div>
              <Shine className="text-[10px]">Reading full-access-confirmation-modal.tsx</Shine>
            </div>
          )}
        </div>

        {/* The composer. */}
        <div className="relative mt-3 shrink-0 rounded-[18px] bg-primary-900/20 pb-2 glass-card">
          {menuOpen && <ContextMenu activeRow={ACTIVE_ROW[shown] ?? 0} />}
          <div className="relative min-h-16 px-3.5 pt-2.5 pr-20 text-[11px] leading-relaxed text-primary-100">
            {sent ? (
              <span className="text-primary-400">
                Ask a follow-up, use @ or / for commands, files, plugins, and skills
              </span>
            ) : (
              <>
                <Prompt chip={picked ? <PluginChip /> : menuOpen ? "@" : null} />
                <span aria-hidden className="ml-px inline-block h-3.5 w-px translate-y-0.5 animate-blink bg-primary-100" />
              </>
            )}
            <kbd className="absolute top-2.5 right-3 font-sans text-[8px] text-primary-400">⌘ ⇧ P to focus</kbd>
          </div>
          <div className="flex items-center gap-3 px-3.5 pt-3 text-[10px] text-primary-200">
            <Attach className="size-3" />
            <span className="flex items-center gap-1">
              <Codex className="size-3" />
              <span className="text-primary-50">GPT 6 Sol</span>
              <span className="text-primary-400">Extra High</span>
              <ChevronDown className="size-2.5 text-primary-400" fill="currentColor" />
            </span>
            <Bolt className="size-3" />
            <span className="flex items-center gap-1 text-primary-50">
              <Edit className="size-3" />
              Write
              <ChevronDown className="size-2.5 text-primary-400" fill="currentColor" />
            </span>
            <Goal className="size-3" />
            {/* Send while there is text; voice once the composer is empty, as in a Codex chat. */}
            <span
              className={cn(
                "ml-auto flex size-6 items-center justify-center rounded-full bg-primary-50 text-primary-950 transition-transform duration-150",
                shown === "sending" && "scale-90"
              )}
            >
              {sent ? <VoiceWave className="size-3.5" /> : <ArrowUp className="size-3.5" />}
            </span>
          </div>
        </div>
      </div>
    </ScaleToFit>
  );
}
