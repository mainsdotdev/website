"use client";

import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { MockupSoundContext } from "@/components/demo/mockup-sound";
import { MockupActiveContext } from "@/components/demo/pr-flow";
import { ScaleToFit } from "@/components/demo/scale-to-fit";
import { Shine } from "@/components/demo/spinners";
import { WorkWindow } from "@/components/demo/work-window";
import {
  Attach,
  BoltFill,
  ChevronDown,
  Codex,
  Goal,
  Mains,
  Microphone,
  VoiceWave,
} from "@/components/icons";
import { VoiceOrb } from "@/components/voice-orb";
import type { VoiceOrbLevels, VoiceOrbStyle } from "@/lib/voice-orb-renderer";
import { cn } from "@/lib/utils";

/**
 * A Codex voice chat in Mains' Work mode, after the app's (0.15): the call is
 * started from an empty chat, and the orb listens while the visitor speaks and
 * talks while Codex does, its replies arriving word by word. A bigger job goes
 * to a chat of its own, which keeps working while the call goes on. It plays
 * once each showing it gets, pausing when not shown; Replay starts it over.
 *
 * The orb takes any of the app's three styles; the switch beside it changes
 * the style live, as Settings › Codex › Voice does.
 */

type Turn = { speaker: "user" | "agent"; text: string };

const TURNS: Turn[] = [
  {
    speaker: "user",
    text: "Hey, I’m thinking about a long weekend in Lisbon next month.",
  },
  {
    speaker: "agent",
    text: "Nice choice. Want me to put a plan together? Flights, where to stay, a few things to do.",
  },
  {
    speaker: "user",
    text: "Yes. Fly out Friday evening, back Monday night. Somewhere I can walk everywhere.",
  },
  {
    speaker: "agent",
    text: "Got it. I’ll work that out in its own chat so it can take its time.",
  },
  {
    speaker: "user",
    text: "While you do that, what’s the weather like there in May?",
  },
  {
    speaker: "agent",
    text: "Mild. Around twenty degrees in the afternoon, cooler by the river at night, so pack a light jacket.",
  },
  {
    speaker: "agent",
    text: "Your plan’s ready: a Friday evening flight, three nights in Príncipe Real, and a day trip to Sintra on Sunday. It’s in its chat whenever you want it.",
  },
];

/** The turn after which the plan goes to its own chat, and the one before which it is ready. */
const DELEGATED_AFTER = 3;
const READY_BEFORE = 6;

const CALL_TITLE = "Weekend in Lisbon";
const PLAN_TITLE = "Lisbon long weekend";

// ─── Timeline, in ms from the mockup coming on show ──────────────────────────

const PRESS = 900;
const START = 1200;
/** The orb settles in before anyone speaks. */
const FIRST_TURN = START + 1100;
const MS_PER_WORD = { user: 240, agent: 290 } as const;
const GAP = 650;

const TURNS_AT = (() => {
  let at = FIRST_TURN;
  return TURNS.map((turn) => {
    const start = at;
    const length = turn.text.split(" ").length * MS_PER_WORD[turn.speaker];
    at += length + GAP;
    return { start, end: start + length };
  });
})();
const DELEGATED = TURNS_AT[DELEGATED_AFTER].end;
const READY = TURNS_AT[READY_BEFORE].start - 400;
const END = TURNS_AT.at(-1)!.end + 800;

type Speaking = "user" | "agent" | "none";

function speakingAt(t: number): Speaking {
  const index = TURNS_AT.findIndex(({ start, end }) => t >= start && t < end);
  return index === -1 ? "none" : TURNS[index].speaker;
}

/**
 * The orb's levels for who is speaking: Codex's voice comes out in uneven
 * syllables, the visitor's goes in, and a quiet line between turns.
 */
function levelsFor(speaking: Speaking, timeMs: number): VoiceOrbLevels {
  const time = timeMs / 1000;
  if (speaking === "agent") {
    const syllables = Math.pow(Math.abs(Math.sin(time * 10.5)), 1.6);
    const phrase = 0.65 + 0.35 * Math.sin(time * 1.9);
    return { input: 0, output: 0.22 + 0.5 * syllables * phrase };
  }
  if (speaking === "user") {
    const syllables = Math.pow(Math.abs(Math.sin(time * 8.5 + 1)), 1.4);
    return { input: 0.16 + 0.34 * syllables, output: 0.04 };
  }
  return { input: 0, output: 0.05 + 0.03 * Math.sin(time * 1.2) ** 2 };
}

// ─── Pieces ──────────────────────────────────────────────────────────────────

/** A turn as it is spoken: its words appear over the time it takes to say them. */
function SpokenTurn({ turn, shownWords }: { turn: Turn; shownWords: number }) {
  const words = turn.text.split(" ");
  const text = (
    <>
      {words.slice(0, shownWords).map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </>
  );
  if (turn.speaker === "user") {
    return (
      <div className="ml-auto max-w-[80%] rounded-2xl bg-primary-900/50 px-3 py-2 text-[11px] leading-relaxed text-primary-100">
        {text}
      </div>
    );
  }
  return <p className="text-[11px] leading-5 text-primary-100">{text}</p>;
}

/** The chat the call handed the plan to, with its state and a way in. */
function DelegatedChat({ ready }: { ready: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 glass-outline"
    >
      <Codex className="size-4 shrink-0 text-primary-100" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[10px] font-medium text-primary-50">
          {PLAN_TITLE}
        </div>
        {ready ? (
          <div className="text-[9px] text-primary-400">Reply ready</div>
        ) : (
          <Shine className="text-[9px]">Working…</Shine>
        )}
      </div>
      <span
        className={cn(
          "shrink-0 rounded-full px-2.5 py-1 text-[9px] font-medium transition-colors duration-300",
          ready
            ? "bg-primary-100 text-primary-950"
            : "bg-primary-800 text-primary-400",
        )}
      >
        Open chat
      </span>
    </motion.div>
  );
}

function Composer({ live, pressed }: { live: boolean; pressed: boolean }) {
  return (
    <div className="rounded-[18px] bg-primary-900/20 pb-2 glass-card">
      <div className="relative min-h-10 px-3.5 pt-2.5 pr-20 text-[11px] leading-relaxed text-primary-400">
        {live
          ? "Ask a follow-up, use @ or / for commands, plugins, and skills"
          : "Describe a task, use @ or / for commands, plugins, and skills"}
        <kbd className="absolute top-2.5 right-3 font-sans text-[8px] text-primary-400">
          ⌘ ⇧ P to focus
        </kbd>
      </div>
      <div className="flex items-center gap-3 px-3.5 pt-2.5 text-[10px] text-primary-200">
        <Attach className="size-3" />
        <span className="flex items-center gap-1">
          <Codex className="size-3" />
          <span className="text-primary-50">GPT 6.1 Sol</span>
          <span className="text-primary-400">Extra High</span>
          <ChevronDown
            className="size-2.5 text-primary-400"
            fill="currentColor"
          />
        </span>
        <span className="flex items-center gap-1 text-[#a78bfa]">
          <BoltFill className="size-3" />
          Fast
        </span>
        <Goal className="size-3" />
        {/* An empty Codex composer offers a voice chat; during one, mute and end. */}
        {live ? (
          <span className="ml-auto flex items-center gap-2">
            <Microphone className="size-3.5 text-primary-300" />
            <span
              aria-label="End voice chat"
              className="flex size-6 items-center justify-center rounded-full bg-primary-50"
            >
              <span className="size-2 rounded-[2px] bg-primary-950" />
            </span>
          </span>
        ) : (
          <span
            aria-label="Start voice chat"
            className={cn(
              "ml-auto flex size-6 items-center justify-center rounded-full bg-primary-50 text-primary-950 transition-transform duration-150",
              pressed && "scale-90",
            )}
          >
            <VoiceWave className="size-3.5" />
          </span>
        )}
      </div>
    </div>
  );
}

// ─── The window ──────────────────────────────────────────────────────────────

/** Drawn to the panel's visible height, so the orb and composer are never faded. */
const DESIGN_WIDTH = 1152;
const DESIGN_HEIGHT = 540;
/** How far up the composer sits, centered, before the call moves it down. */
const COMPOSER_LIFT = 200;
/** The orb's size, `size-24`, for keeping the chat clear of it. */
const ORB_SIZE = 96;

function Window({
  t,
  orbStyle,
  getLevels,
}: {
  t: number;
  orbStyle: VoiceOrbStyle;
  getLevels: (timeMs: number) => VoiceOrbLevels;
}) {
  const live = t >= START;
  const delegated = t >= DELEGATED;
  const ready = t >= READY;

  // Turns under way or done, and how many words of each are out.
  const turns = TURNS.map((turn, index) => {
    const { start, end } = TURNS_AT[index];
    if (t < start) return null;
    const words = turn.text.split(" ").length;
    return Math.min(words, Math.ceil(((t - start) / (end - start)) * words));
  });
  const wordsOut = turns.reduce<number>((sum, shown) => sum + (shown ?? 0), 0);

  const scrollRef = useRef<HTMLDivElement>(null);
  // Keep the newest words in view, as a live chat does.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [wordsOut, delegated]);

  return (
    <WorkWindow
      tabTitle={live ? CALL_TITLE : "New chat"}
      recents={[
        ...(delegated ? [PLAN_TITLE] : []),
        ...(live ? [CALL_TITLE] : []),
      ]}
    >
      {/* The empty chat: the mark over a centered composer. */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-32 flex justify-center transition-opacity duration-300",
          live ? "opacity-0" : "opacity-100",
        )}
      >
        <Mains className="h-8 w-auto text-primary-800" />
      </div>

      {live && (
        <div
          ref={scrollRef}
          className="noscrollbar min-h-0 flex-1 overflow-hidden scroll-smooth px-11 pt-6"
          // Earlier turns fade out at the top rather than being cut off.
          style={{
            maskImage: "linear-gradient(to bottom, transparent, black 48px)",
          }}
        >
          {/* Clear of the orb, which floats over the bottom of the chat. */}
          <div
            className="mx-auto flex w-full max-w-160 flex-col gap-3.5"
            style={{ paddingBottom: ORB_SIZE + 32 }}
          >
            {TURNS.map((turn, index) => {
              const shown = turns[index];
              return (
                shown !== null && (
                  <div key={index} className="flex flex-col gap-3.5">
                    <SpokenTurn turn={turn} shownWords={shown} />
                    {index === DELEGATED_AFTER && delegated && (
                      <DelegatedChat ready={ready} />
                    )}
                  </div>
                )
              );
            })}
          </div>
        </div>
      )}

      {/* The call's orb, over the bottom of the chat, as in the app. */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 flex justify-center transition-[opacity,transform] duration-500 ease-out",
          live ? "scale-100 opacity-100" : "scale-75 opacity-0",
        )}
        style={{ bottom: 118 }}
      >
        <VoiceOrb
          getLevels={getLevels}
          orbStyle={orbStyle}
          className="size-24 shrink-0"
        />
      </div>

      {/* Centered while the chat is empty, then down to its place. */}
      <div
        className="mx-auto mt-auto w-full max-w-160 shrink-0 px-11 pb-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={{
          transform: live ? "translateY(0)" : `translateY(-${COMPOSER_LIFT}px)`,
        }}
      >
        <Composer live={live} pressed={t >= PRESS && t < START} />
      </div>
    </WorkWindow>
  );
}

/**
 * The call, played once: its clock advances only while the mockup is shown.
 * The demo keys it on Replay, which mounts a fresh one at zero.
 */
function Call({
  shown,
  reducedMotion,
  orbStyle,
  onOrbStyle,
}: {
  shown: boolean;
  reducedMotion: boolean;
  orbStyle: VoiceOrbStyle;
  onOrbStyle: (style: VoiceOrbStyle) => void;
}) {
  const [t, setT] = useState(0);
  const elapsed = useRef(0);
  /** Who is speaking, for the orb's frame loop to read without re-rendering. */
  const speaking = useRef<Speaking>("none");

  const running = shown && !reducedMotion;
  useEffect(() => {
    if (!running || elapsed.current > END) return;
    const base = elapsed.current;
    const start = performance.now();
    const clock = setInterval(() => {
      elapsed.current = base + performance.now() - start;
      speaking.current = speakingAt(elapsed.current);
      setT(elapsed.current);
      if (elapsed.current > END) clearInterval(clock);
    }, 40);
    return () => {
      clearInterval(clock);
      speaking.current = "none";
    };
  }, [running]);

  // Stable, so the orb's renderer isn't restarted on every tick.
  const getLevels = useCallback(
    (timeMs: number) => levelsFor(speaking.current, timeMs),
    [],
  );

  const at = reducedMotion ? END : t;
  return (
    <>
      <ScaleToFit
        designWidth={DESIGN_WIDTH}
        designHeight={DESIGN_HEIGHT}
        className="pointer-events-none absolute inset-x-0 top-0"
      >
        <div
          role="img"
          aria-label="Mains in Work mode: a Codex voice chat about a weekend in Lisbon, with the plan handed to a chat of its own"
          className="h-full w-full"
        >
          <Window t={at} orbStyle={orbStyle} getLevels={getLevels} />
        </div>
      </ScaleToFit>
      <OrbStyleSwitch
        value={orbStyle}
        onChange={onOrbStyle}
        shown={at >= START}
        reducedMotion={reducedMotion}
      />
    </>
  );
}

const ORB_STYLES: { value: VoiceOrbStyle; label: string }[] = [
  { value: "cloud", label: "Cloud" },
  { value: "sphere", label: "Sphere" },
  { value: "aurora", label: "Aurora" },
];

/**
 * Beside the orb, at the page's own size: the app's three orb styles. It
 * comes in with the orb, since there is nothing to change before the call.
 */
function OrbStyleSwitch({
  value,
  onChange,
  shown,
  reducedMotion,
}: {
  value: VoiceOrbStyle;
  onChange: (style: VoiceOrbStyle) => void;
  shown: boolean;
  reducedMotion: boolean;
}) {
  return (
    <LayoutGroup id="voice-orb-style">
      <div
        role="radiogroup"
        aria-label="Voice orb style"
        inert={!shown}
        className={cn(
          "absolute top-[64%] left-[64%] hidden -translate-y-1/2 items-center gap-0.5 rounded-full p-1 shadow-lg shadow-(--demo-shadow) transition-opacity duration-500 glass-card md:flex",
          shown ? "opacity-100" : "opacity-0",
        )}
      >
        {ORB_STYLES.map(({ value: style, label }) => {
          const active = style === value;
          return (
            <button
              key={style}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(style)}
              className="relative cursor-pointer rounded-full px-3 py-1 text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              {active && (
                <motion.span
                  layoutId="pill"
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-primary-50/10"
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 420, damping: 36 }
                  }
                />
              )}
              <span
                className={cn(
                  "relative transition-colors",
                  active
                    ? "text-primary-50"
                    : "text-primary-400 hover:text-primary-200",
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

/** Plays the call once, from the first time it is shown; with reduced motion, shows how it ends. */
export function VoiceChatDemo({ className }: { className?: string }) {
  const shown = useContext(MockupActiveContext);
  const { replay } = useContext(MockupSoundContext);
  const reducedMotion = useReducedMotion() ?? false;
  // Kept across replays: a chosen style stays chosen.
  const [orbStyle, setOrbStyle] = useState<VoiceOrbStyle>("cloud");

  return (
    <div className={cn("relative", className)}>
      <Call
        key={replay}
        shown={shown}
        reducedMotion={reducedMotion}
        orbStyle={orbStyle}
        onOrbStyle={setOrbStyle}
      />
    </div>
  );
}
