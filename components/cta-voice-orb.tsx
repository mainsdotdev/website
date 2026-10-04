"use client";

import { useCallback, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ambientVoiceLevels, VoiceOrb } from "@/components/voice-orb";
import { DROP_IN_SPRING } from "@/lib/animations";

/**
 * The voice orb again, above the closing call to action. Its own entrance,
 * not the hero orb arriving: that one stays docked in the app window.
 * Hovering it makes the agent "answer", as in the hero.
 */
export function CtaVoiceOrb() {
  const hovered = useRef(false);
  const reducedMotion = useReducedMotion();

  // Stable, so hovering changes what it returns instead of restarting the orb.
  const getLevels = useCallback((timeMs: number) => {
    const levels = ambientVoiceLevels(timeMs);
    return hovered.current ? { input: 0.35, output: Math.min(1, levels.output + 0.45) } : levels;
  }, []);

  return (
    <motion.div
      {...DROP_IN_SPRING}
      // `initial` must match the server render, so reduced motion only drops
      // the movement: the orb still appears, just without travelling.
      transition={reducedMotion ? { duration: 0 } : DROP_IN_SPRING.transition}
      whileHover={reducedMotion ? undefined : { scale: 1.15 }}
      onPointerEnter={() => (hovered.current = true)}
      onPointerLeave={() => (hovered.current = false)}
      role="img"
      aria-label="Voice chat with Codex"
      className="cursor-default"
    >
      <VoiceOrb getLevels={getLevels} className="size-14 md:size-16" />
    </motion.div>
  );
}
