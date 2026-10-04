"use client";

import {
  FlyingOrb,
  heroEndRef,
  setOrbHovered,
  useOrbFlight,
  voiceLevelsWithHover,
} from "@/components/orb-flight";
import { VoiceOrb } from "@/components/voice-orb";
import { cn } from "@/lib/utils";

/**
 * Voice chat between the release cards: the app's orb, idling on an ambient
 * cadence. Hovering it is the closest a page gets to talking to it, so the
 * agent "answers" — the orb swirls faster until the pointer leaves.
 *
 * Where a flight is possible this is only the orb's starting point: the orb
 * itself is `FlyingOrb`, which leaves from here for the app window's voice
 * chat as the page scrolls.
 */
export function HeroVoiceOrb() {
  const flying = useOrbFlight();

  return (
    <div
      ref={flying ? heroEndRef : undefined}
      role="img"
      aria-label="Voice chat with Codex"
      onPointerEnter={() => setOrbHovered(true)}
      onPointerLeave={() => setOrbHovered(false)}
      className={cn(
        "pointer-events-auto absolute top-23 left-[31%] z-0 hidden cursor-default select-none lg:block xl:top-18 xl:left-[33%] 2xl:left-[39%]",
        // The flying orb draws its own hover growth.
        !flying && "transition-transform duration-200 hover:scale-120"
      )}
    >
      {flying ? (
        <span aria-hidden className="block size-16 xl:size-20" />
      ) : (
        <VoiceOrb getLevels={voiceLevelsWithHover} className="size-16 xl:size-20" />
      )}
      {flying && <FlyingOrb />}
    </div>
  );
}
