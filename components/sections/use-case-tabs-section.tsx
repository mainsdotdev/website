"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { MockupSoundContext, unlockAudio } from "@/components/demo/mockup-sound";
import { MockupActiveContext } from "@/components/demo/pr-flow";
import { Refresh, Speaker } from "@/components/icons";
import { WORK_USE_CASES } from "@/components/sections/dev-use-cases-section";
import { MAINS_DOCS_URL } from "@/lib/constants";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

const PANEL_ID = "use-case-tabs-panel";

/** The panel's fade, and none; the same stops, so the one can ease into the other. */
const FADED = "linear-gradient(to bottom, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)";
const UNFADED = "linear-gradient(to bottom, rgba(0,0,0,1) 100%, rgba(0,0,0,0) 100%)";

/** The small pill buttons in a card's corner: Replay and the sound toggle. */
const CARD_CONTROL =
  "flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition-colors glass-button focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500";

/**
 * Use cases as columns over one large screen, after obsidian.md's
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
  // The first tab is shown from the start; its run waits until the screen is
  // on screen, and pauses while it is scrolled away.
  const { ref: panelRef, visible: panelInView } = useInView(0.35, "0px", false);

  // Sound is off until asked for. The player is made, and unlocked, in the
  // toggle's click: browsers only let audio start from a user gesture, and the
  // run starts it seconds later. Turning it on mid-run joins where the run is;
  // Replay is what starts the run over.
  const [sound, setSound] = useState<{ player: HTMLAudioElement | null; on: boolean }>({ player: null, on: false });
  /** Each mockup's Replay count; a new count starts its run over. */
  const [replays, setReplays] = useState(() => WORK_USE_CASES.map(() => 0));

  const toggleSound = (index: number, src: string) => {
    setActiveIndex(index);
    if (sound.on) {
      sound.player?.pause();
      setSound((current) => ({ ...current, on: false }));
      return;
    }
    const player = sound.player?.getAttribute("src") === src ? sound.player : new Audio(src);
    unlockAudio(player);
    setSound((current) => ({ ...current, player, on: true }));
  };

  const replay = (index: number) => {
    setActiveIndex(index);
    setReplays((current) => current.map((count, i) => (i === index ? count + 1 : count)));
  };

  const { player } = sound;
  useEffect(() => () => player?.pause(), [player]);

  return (
    <section aria-labelledby="use-case-tabs-title" className="px-5 py-24 sm:px-8 lg:py-32">
      <h2 id="use-case-tabs-title" className="text-5xl leading-none tracking-tight text-primary-50 sm:text-6xl">
        Work beside your agents.
      </h2>
      <p className="mt-6 max-w-2xl text-xl leading-snug text-pretty text-primary-400">
        Hand off the clicking and talk it through, without leaving Mains.{" "}
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
        <div role="tablist" aria-label="Use cases" className="mt-12 grid gap-2 sm:grid-cols-2">
          {WORK_USE_CASES.map((useCase, index) => {
            const { title, description, Icon } = useCase;
            const soundSrc = "sound" in useCase ? useCase.sound : null;
            const replayable = "replayable" in useCase && useCase.replayable && !prefersReducedMotion;
            const active = index === activeIndex;
            return (
              <div key={title} className="relative">
              <button
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
                    "relative mt-2 block text-base leading-relaxed text-pretty transition-colors duration-200",
                    active ? "text-primary-400" : "text-primary-500"
                  )}
                >
                  {description}
                </span>
              </button>
              {(replayable || soundSrc) && (
                // Beside the tab, not in it: a button can't hold another.
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  {replayable && (
                    <button
                      type="button"
                      onClick={() => replay(index)}
                      className={cn(CARD_CONTROL, "text-primary-300 hover:text-primary-100")}
                    >
                      <Refresh className="size-3 rotate-180" />
                      Replay
                    </button>
                  )}
                  {soundSrc && (
                    <button
                      type="button"
                      onClick={() => toggleSound(index, soundSrc)}
                      aria-pressed={sound.on}
                      aria-label={sound.on ? "Turn sound off" : "Turn sound on"}
                      className={cn(CARD_CONTROL, sound.on ? "text-primary-50" : "text-primary-300 hover:text-primary-100")}
                    >
                      <Speaker muted={!sound.on} className="size-3.5" />
                      {sound.on ? "Sound on" : "Sound off"}
                    </button>
                  )}
                </div>
              )}
              </div>
            );
          })}
        </div>
      </LayoutGroup>

      {/* The frame shows the top of a 16:9 mockup and fades out over its
          lower half, like a screen running off the bottom of the page. A
          mockup whose subject sits at the bottom (the voice orb) asks for no
          fade; the gradient eases between the two as the tabs switch. */}
      <motion.div
        ref={panelRef}
        id={PANEL_ID}
        role="tabpanel"
        aria-label={WORK_USE_CASES[activeIndex].title}
        className="relative mt-10 aspect-16/7.5 overflow-hidden rounded-t-2xl  pb-0"
        initial={false}
        animate={{ maskImage: "unfaded" in WORK_USE_CASES[activeIndex] ? UNFADED : FADED }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: "easeOut" }}
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
                {/* A mockup that plays a run starts it only while shown. */}
                <MockupActiveContext value={active && panelInView}>
                  <MockupSoundContext
                    value={{ audio: sound.on && "sound" in WORK_USE_CASES[index] ? sound.player : null, replay: replays[index] }}
                  >
                    <Mockup className="absolute inset-0" />
                  </MockupSoundContext>
                </MockupActiveContext>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
