"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// VoiceBeam embeds React's useId in generated CSS. Render it after hydration so
// a server/client tree-id difference cannot make the style text mismatch.
const VoiceBeam = dynamic(
  () => import("voice-glow").then((module) => module.VoiceBeam),
  { ssr: false }
);

// A short, uneven phrase gives the demo a voice-like cadence without asking
// for microphone access. VoiceBeam samples this function on its own frame loop.
function ambientVoiceLevel() {
  const time = performance.now() / 1000;
  const phrase = Math.pow(Math.max(0, Math.sin(time * 1.35)), 2.5);
  return 0.06 + phrase * (0.3 + 0.12 * Math.sin(time * 8) ** 2);
}

/** A non-interactive preview of voice dictation between the release cards. */
export function HeroVoiceWave() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      role="img"
      aria-label="Voice dictation coming soon"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="hero-voice-wave pointer-events-auto absolute top-25.5 left-[29%] z-0 hidden h-14 w-40 cursor-default hover:scale-120 transform transition-all duration-200 select-none items-center justify-center xl:top-20.5 xl:left-[21%] 2xl:left-[38%] lg:flex"
    >
      <VoiceBeam
        type="pill"
        theme="auto"
        colorVariant="colorful"
        level={ambientVoiceLevel}
        processing={hovered}
        sensitivity={1.15}
        attack={0.13}
        release={0.42}
        idle={0.3}
        strength={0.85}
        className="hero-voice-beam lg:-rotate-7"
      >
        <div className="relative flex h-14 w-40 items-center justify-center glass-outline overflow-hidden rounded-full ">


          <span
            aria-hidden="true"
            className="hero-voice-soon pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-base tracking-wider text-primary-50"
          >
            {Array.from("soon...").map((letter, index) => (
              <span key={index} className="hero-voice-letter" style={{ animationDelay: `${100 + index * 46}ms` }}>
                {letter}
              </span>
            ))}
          </span>
        </div>
      </VoiceBeam>
    </div>
  );
}
