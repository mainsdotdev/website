"use client";

import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Confetti, type ConfettiHandle } from "@/components/demo/confetti";
import { MockupSoundContext } from "@/components/demo/mockup-sound";
import { MockupActiveContext } from "@/components/demo/pr-flow";
import { ScaleToFit } from "@/components/demo/scale-to-fit";
import { Shine } from "@/components/demo/spinners";
import { WorkWindow } from "@/components/demo/work-window";
import {
  ArrowUp,
  Attach,
  BoltFill,
  BrowserCursor,
  ChevronDown,
  Clipboard,
  Codex,
  Fork,
  Goal,
  Mains,
  VoiceWave,
} from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * A Codex chat in Mains' Work mode driving the Mac through Computer Use,
 * from the app's own run ("Play Let It Happen With Confetti"): the request is
 * typed into a new chat, the computer-use steps stream in, the track starts,
 * and Raycast's confetti fires ten times. It plays once each time the mockup
 * comes on show. The run was stopped at the third confetti; the rest of the
 * steps and the closing reply follow its pattern.
 *
 * The track is a separate clip (`public/let-it-happen.wav`), silent until the
 * visitor turns sound on from the use case card — browsers won't start audio
 * without a click, and a page shouldn't anyway.
 */

const PROMPT_BEFORE = "Open ";
const PROMPT_AFTER = ", play “Let It Happen” by Tame Impala, seek to 5:02, then trigger Raycast Confetti 10 times on repeat.";
/** The Music mention counts as one character while typing: it lands as a chip. */
const PROMPT_LENGTH = PROMPT_BEFORE.length + 1 + PROMPT_AFTER.length;

const MESSAGE_1 = "I’ll open Music, cue the track at 5:02, and trigger Raycast Confetti ten times.";
const MESSAGE_2 = "The track is cued at 5:02 and playing. I’m repeating the Confetti command now.";
const MESSAGE_3 = "Done. “Let It Happen” is playing from 5:02, and Raycast Confetti went off ten times on repeat.";

/** The first stretch of steps, as the run named them. */
const STEPS_1 = [
  "Open Music",
  "Inspect playback controls",
  "Read track position control",
  "Cue 5:02",
  "Seek on playback bar",
  "Start playback and open Raycast",
  "Prepare Confetti and check playback",
  "Set playing track to 5:02",
  "Seek to requested moment during playback",
];
/** The step after which the track is playing. */
const PLAYBACK_STEP = 5;

type Step2 = { title: string; confetti?: boolean };
/** The repeats; the run's own until it was stopped, then the same pattern. */
const STEPS_2: Step2[] = [
  { title: "Trigger Confetti 1 of 10", confetti: true },
  { title: "Verify Confetti and prepare repeat" },
  { title: "Select Confetti for repetition" },
  ...Array.from({ length: 9 }, (_, index) => ({ title: `Trigger Confetti ${index + 2} of 10`, confetti: true })),
];

// ─── Timeline, in ms from the mockup coming on show ───────────────────────────

const TYPE_START = 700;
const TYPE_MS_PER_CHAR = 26;
const TYPE_END = TYPE_START + PROMPT_LENGTH * TYPE_MS_PER_CHAR;
const SEND = TYPE_END + 450;
const MSG_1 = SEND + 700;
const STEPS_1_START = MSG_1 + 900;
const STEP_1_MS = 420;
const STEPS_1_AT = STEPS_1.map((_, index) => STEPS_1_START + index * STEP_1_MS);
const MUSIC_START = STEPS_1_AT[PLAYBACK_STEP] + STEP_1_MS;
const MSG_2 = STEPS_1_AT.at(-1)! + STEP_1_MS + 300;
/**
 * The clip starts at 5:02; the first confetti lands three seconds in, as the
 * song reaches 5:05. The rest fire every 700ms, so all ten land before the
 * 10.2-second clip ends; the in-between steps come quicker.
 */
const FIRST_CONFETTI = MUSIC_START + 3000;
const STEPS_2_AT = (() => {
  let at = FIRST_CONFETTI;
  return STEPS_2.map((step, index) => {
    const start = at;
    const next = STEPS_2[index + 1];
    at += next?.confetti && !step.confetti ? 400 : next?.confetti ? 700 : 360;
    return start;
  });
})();
const MSG_3 = STEPS_2_AT.at(-1)! + 1200;
/** The clip is 10.2 seconds: it ends just after the tenth confetti. */
const MUSIC_END = MUSIC_START + 10_200;
const END = MSG_3 + 1600;

/** The total tool calls, for the fold over the finished turn. */
const TOOL_CALLS = STEPS_1.length + STEPS_2.length;
/** How many rows the open group shows; the app caps its list and fades the top. */
const VISIBLE_ROWS = 7;

// ─── Pieces ──────────────────────────────────────────────────────────────────

/** Apple Music's tile, for the mention chip and the now-playing card. */
function MusicTile({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center rounded-[4px] bg-linear-to-b from-[#fd5c7a] to-[#f9314c]", className)}>
      <svg viewBox="0 0 12 12" aria-hidden className="size-[70%] text-white" fill="currentColor">
        <path d="M9.5 1.2v6.6a1.6 1.6 0 1 1-1-1.48V3.1L4.6 3.9v4.9a1.6 1.6 0 1 1-1-1.48V2.6Z" />
      </svg>
    </span>
  );
}

function MusicChip() {
  return (
    <span className="inline-flex items-center gap-1 align-baseline text-(--color-accent,var(--color-blue-400))">
      <MusicTile className="size-3 self-center" />
      Music
    </span>
  );
}

function Prompt({ typed }: { typed: number }) {
  const before = PROMPT_BEFORE.slice(0, typed);
  const chip = typed > PROMPT_BEFORE.length;
  const after = PROMPT_AFTER.slice(0, Math.max(0, typed - PROMPT_BEFORE.length - 1));
  return (
    <>
      {before}
      {chip && <MusicChip />}
      {after}
    </>
  );
}

/** A reply fading in word by word, as the app streams them. */
function Reply({ text }: { text: string }) {
  return (
    <p className="text-[11px] leading-5 text-primary-100">
      {text.split(" ").map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: index * 0.03 }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </p>
  );
}

function ToolRow({ title, running }: { title: string; running: boolean }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px]">
      <BrowserCursor className="size-3 shrink-0 text-primary-500" />
      <span className="shrink-0 text-primary-300">Computer use</span>
      {running ? <Shine className="min-w-0">{title}</Shine> : <span className="truncate text-primary-500">{title}</span>}
      <ArrowUp className="size-2.5 shrink-0 rotate-90 text-primary-600" />
    </div>
  );
}

/** A run of computer-use steps: open while it streams, folded once the reply moves on. */
function ToolGroup({ titles, shown, open }: { titles: string[]; shown: number; open: boolean }) {
  if (!open) {
    return (
      <div className="flex items-center gap-1.5 text-[10px] text-primary-500">
        <BrowserCursor className="size-3 shrink-0" />
        Used the Computer use integration
        <ArrowUp className="size-2.5 rotate-90" />
      </div>
    );
  }
  const rows = titles.slice(0, shown);
  const hidden = Math.max(0, rows.length - VISIBLE_ROWS);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1 text-[10px] text-primary-500">
        Used the Computer use integration
        <ArrowUp className="size-2.5 rotate-180" />
      </div>
      <div
        className="flex flex-col gap-1.5"
        style={hidden ? { maskImage: "linear-gradient(to bottom, transparent, #000 2.5rem)" } : undefined}
      >
        {rows.slice(hidden).map((title, index) => (
          <ToolRow key={hidden + index} title={title} running={hidden + index === rows.length - 1 && open} />
        ))}
      </div>
    </div>
  );
}

/** The now-playing pill that appears once the track starts, clear of the chat column. */
function NowPlaying({ playing }: { playing: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 rounded-full py-1 pr-2.5 pl-1 shadow-lg shadow-(--demo-shadow) glass-card"
    >
      <MusicTile className="size-4 rounded-full" />
      <span className="text-[9.5px] text-primary-50">Let It Happen</span>
      <span aria-hidden className="flex h-2.5 items-end gap-px">
        {[0.5, 0.9, 0.65, 1].map((peak, index) => (
          <motion.span
            key={index}
            className="h-full w-0.5 origin-bottom rounded-full bg-[#fd5c7a]"
            animate={playing ? { scaleY: [0.3, peak, 0.45, peak * 0.8, 0.3] } : { scaleY: 0.3 }}
            transition={playing ? { duration: 0.9 + index * 0.13, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
          />
        ))}
      </span>
    </motion.div>
  );
}

const CHAT_TITLE = "Play Let It Happen With Confetti";

function Composer({ typed, phase }: { typed: number; phase: "typing" | "running" | "done" }) {
  return (
    <div className="rounded-[18px] bg-primary-900/20 pb-2 glass-card">
      <div className="relative min-h-10 px-3.5 pt-2.5 pr-20 text-[11px] leading-relaxed text-primary-100">
        {phase === "typing" && typed > 0 ? (
          <>
            <Prompt typed={typed} />
            <span aria-hidden className="ml-px inline-block h-3.5 w-px translate-y-0.5 animate-blink bg-primary-100" />
          </>
        ) : (
          <span className="text-primary-400">
            {phase === "typing"
              ? "Describe a task, use @ or / for commands, plugins, and skills"
              : "Ask a follow-up, use @ or / for commands, plugins, and skills"}
          </span>
        )}
        <kbd className="absolute top-2.5 right-3 font-sans text-[8px] text-primary-400">⌘ ⇧ P to focus</kbd>
      </div>
      <div className="flex items-center gap-3 px-3.5 pt-2.5 text-[10px] text-primary-200">
        <Attach className="size-3" />
        <span className="flex items-center gap-1">
          <Codex className="size-3" />
          <span className="text-primary-50">GPT 6.1 Sol</span>
          <span className="text-primary-400">Extra High</span>
          <ChevronDown className="size-2.5 text-primary-400" fill="currentColor" />
        </span>
        <span className="flex items-center gap-1 text-[#a78bfa]">
          <BoltFill className="size-3" />
          Fast
        </span>
        <Goal className="size-3" />
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="flex">
            <span className="size-2.5 rounded-[3px] bg-[#3b82f6] ring-1 ring-(--demo-content)" />
            <span className="-ml-1 size-2.5 rounded-[3px] bg-[#f9314c] ring-1 ring-(--demo-content)" />
            <span className="-ml-1 size-2.5 rounded-[3px] bg-[#22c55e] ring-1 ring-(--demo-content)" />
          </span>
          Plugins
        </span>
        <span className="ml-auto flex size-6 items-center justify-center rounded-full bg-primary-50 text-primary-950">
          {phase === "running" ? (
            <span className="size-2 rounded-[2px] bg-primary-950" />
          ) : phase === "done" ? (
            <VoiceWave className="size-3.5" />
          ) : (
            <ArrowUp className="size-3.5" />
          )}
        </span>
      </div>
    </div>
  );
}

// ─── The window ──────────────────────────────────────────────────────────────

const DESIGN_WIDTH = 1152;
const DESIGN_HEIGHT = 648;
/** How far up the composer sits, centered, before the first message moves it down. */
const COMPOSER_LIFT = 290;

/** Everything on screen at `t` ms in. */
function Window({ t }: { t: number }) {
  const typed = Math.max(0, Math.min(PROMPT_LENGTH, Math.floor((t - TYPE_START) / TYPE_MS_PER_CHAR)));
  const sent = t >= SEND;
  const done = t >= MSG_3;
  const steps1 = STEPS_1_AT.filter((at) => t >= at).length;
  const steps2 = STEPS_2_AT.filter((at) => t >= at).length;
  const playing = t >= MUSIC_START && t < MUSIC_END;

  const replied1 = t >= MSG_1;
  const replied2 = t >= MSG_2;

  const scrollRef = useRef<HTMLDivElement>(null);
  // Keep the newest line in view, as a live chat does.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [steps1, steps2, sent, done, replied1, replied2]);

  return (
    <WorkWindow tabTitle={sent ? CHAT_TITLE : "New chat"} recents={sent ? [CHAT_TITLE] : []}>
              {/* The empty chat: the mark over a centered composer. */}
              <div
                className={cn(
                  "pointer-events-none absolute inset-x-0 top-36 flex justify-center transition-opacity duration-300",
                  sent ? "opacity-0" : "opacity-100"
                )}
              >
                <Mains className="h-12 w-auto text-primary-800" />
              </div>

              {sent && (
                <div ref={scrollRef} className="noscrollbar min-h-0 flex-1 overflow-hidden scroll-smooth px-11 pt-6">
                  {/* The space under the last line keeps it clear of the page's
                      fade at the bottom of the screen, as the chat scrolls. */}
                  <div className="mx-auto flex w-full max-w-160 flex-col gap-3.5 pb-40">
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="ml-auto max-w-[80%] rounded-2xl bg-primary-900/50 px-3 py-2 text-[11px] leading-relaxed text-primary-100"
                    >
                      <Prompt typed={PROMPT_LENGTH} />
                    </motion.div>

                    {done && (
                      <div className="flex items-center gap-1 border-b border-primary-50/8 pb-1 text-[10px] text-primary-500">
                        2 messages · {TOOL_CALLS} tool calls
                        <ArrowUp className="size-2.5 rotate-180" />
                      </div>
                    )}
                    {replied1 && <Reply text={MESSAGE_1} />}
                    {steps1 > 0 && <ToolGroup titles={STEPS_1} shown={steps1} open={!replied2} />}
                    {replied2 && <Reply text={MESSAGE_2} />}
                    {steps2 > 0 && <ToolGroup titles={STEPS_2.map((step) => step.title)} shown={steps2} open />}
                    {done && (
                      <>
                        <Reply text={MESSAGE_3} />
                        <div className="flex items-center gap-2 text-[10px] text-primary-400">
                          <span>1m 35s</span>
                          <span>·</span>
                          <Clipboard className="size-3" />
                          <Fork className="size-3" />
                          <span className="ml-1">11:55 PM</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {t >= MUSIC_START && (
                <div className="absolute top-3 right-3">
                  <NowPlaying playing={playing} />
                </div>
              )}

              {/* Centered while the chat is empty, then down to its place. */}
              <div
                className="mx-auto mt-auto w-full max-w-160 shrink-0 px-11 pb-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                style={{ transform: sent ? "translateY(0)" : `translateY(-${COMPOSER_LIFT}px)` }}
              >
                <Composer typed={typed} phase={done ? "done" : sent ? "running" : "typing"} />
              </div>
    </WorkWindow>
  );
}

// The shared player belongs to the card that switched sound on; the run only
// starts, fades and stops it.
function startClip(player: HTMLAudioElement, at: number) {
  player.volume = 1;
  player.currentTime = at;
  void player.play().catch(() => {});
}

function stopClip(player: HTMLAudioElement) {
  player.pause();
}

function setClipVolume(player: HTMLAudioElement, volume: number) {
  player.volume = Math.min(1, Math.max(0, volume));
}

/**
 * The run, played once: its clock advances only while the mockup is shown,
 * so switching tabs or scrolling away pauses it, and coming back picks up
 * where it was. It stays on its last frame when done. The demo keys it on
 * the card's Replay, which mounts a fresh one at zero.
 */
function Run({ shown, audio, reducedMotion }: { shown: boolean; audio: HTMLAudioElement | null; reducedMotion: boolean }) {
  const [t, setT] = useState(0);
  const confetti = useRef<ConfettiHandle>(null);
  const fired = useRef(0);
  /** Time run so far, kept across pauses. */
  const elapsed = useRef(0);

  const running = shown && !reducedMotion;
  useEffect(() => {
    if (!running || elapsed.current > END) return;
    const base = elapsed.current;
    const start = performance.now();
    const clock = setInterval(() => {
      elapsed.current = base + performance.now() - start;
      setT(elapsed.current);
      if (elapsed.current > END) clearInterval(clock);
    }, 40);
    return () => clearInterval(clock);
  }, [running]);

  // A burst each time a Trigger Confetti step lands.
  useEffect(() => {
    const due = STEPS_2.filter((step, index) => step.confetti && t >= STEPS_2_AT[index]).length;
    while (fired.current < due) {
      fired.current += 1;
      confetti.current?.burst();
    }
  }, [t]);

  // The track plays while the run has it playing, if sound is on and the
  // mockup is shown; resumed or turned on partway, it joins where the run is.
  const musicOn = running && audio !== null && t >= MUSIC_START && t < MUSIC_END;
  useEffect(() => {
    if (!musicOn || !audio) return;
    startClip(audio, Math.max(0, (elapsed.current - MUSIC_START) / 1000));
    return () => stopClip(audio);
  }, [musicOn, audio]);

  // Eased out over its last half second rather than cut.
  useEffect(() => {
    if (musicOn && audio && t > MUSIC_END - 500) setClipVolume(audio, (MUSIC_END - t) / 500);
  }, [t, musicOn, audio]);

  return (
    <>
      <ScaleToFit designWidth={DESIGN_WIDTH} designHeight={DESIGN_HEIGHT} className="pointer-events-none absolute inset-0">
        <div
          role="img"
          aria-label="Mains in Work mode: a Codex chat uses Computer Use to open Music, play a track from 5:02, and fire Raycast confetti ten times"
          className="h-full w-full"
        >
          <Window t={reducedMotion ? END : t} />
        </div>
      </ScaleToFit>
      <Confetti ref={confetti} className="absolute inset-0" />
    </>
  );
}

/**
 * Plays the run once, from the first time it is shown; with reduced motion,
 * shows how it ends. Sound and Replay come from the card, through
 * `MockupSoundContext`.
 */
export function ComputerUseDemo({ className }: { className?: string }) {
  const shown = useContext(MockupActiveContext);
  const { audio, replay } = useContext(MockupSoundContext);
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <div className={cn("relative", className)}>
      <Run key={replay} shown={shown} audio={audio} reducedMotion={reducedMotion} />
    </div>
  );
}
