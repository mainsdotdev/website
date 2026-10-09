"use client";

import { createContext } from "react";

/**
 * Sound and replay for a mockup that plays a run, controlled from outside it —
 * the use case card's buttons. `audio` is set only while sound is on: the card
 * creates and unlocks it in the toggle's click, since browsers won't start
 * audio later without one. `replay` changes each time Replay is pressed, so
 * the mockup plays its run again from the top.
 */
export const MockupSoundContext = createContext<{ audio: HTMLAudioElement | null; replay: number }>({
  audio: null,
  replay: 0,
});

/**
 * Lets a player start later without a click of its own: called from inside a
 * click, a silent play-and-pause marks it as user-started, which Safari needs.
 */
export function unlockAudio(player: HTMLAudioElement) {
  player.muted = true;
  void player
    .play()
    .then(() => {
      player.pause();
      player.muted = false;
    })
    .catch(() => {});
}
