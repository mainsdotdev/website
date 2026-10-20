"use client";

import { motion } from "framer-motion";
import { BridgeMark } from "@/components/bridge-mark";
import HeaderSpacer from "@/components/header-spacer";
import styles from "@/components/sections/bridge-hero-section.module.css";
import { FADE_IN_BLUR_DELAY } from "@/lib/animations";

// The same entrance as the other heroes: headline, then the action, then the note.
export function BridgeHeroSection() {
  return (
    <div className={styles.canvas}>
      {/* Like the other heroes, the backdrop starts behind the navigation. */}
      <div aria-hidden="true" className={styles.backdrop}>
        <div className={styles.flow}>
          <div className={styles.mark}>
            <BridgeMark />
          </div>
        </div>
      </div>

      <HeaderSpacer />
      <section aria-labelledby="bridge-title" className={styles.hero}>
        <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          <motion.div {...FADE_IN_BLUR_DELAY(0.2)} className="flex flex-col items-center">
            <p className="mb-6 text-xl tracking-tight text-primary-300 sm:mb-7 sm:text-2xl">
              Bridge
            </p>
            <h1
              id="bridge-title"
              className="font-sans text-[2rem] leading-[1.15] font-normal tracking-tight text-primary-50/95 sm:text-4xl md:text-5xl lg:text-[3.25rem]"
            >
              Your workspaces,
              <br />
              kept in sync.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-primary-400 sm:mt-7 sm:text-xl">
              Sync your Mains workspaces across devices. Keep your work up to date.
            </p>
          </motion.div>
          <motion.div {...FADE_IN_BLUR_DELAY(0.45)} className="mt-9 sm:mt-10">
            <a
              href="#join"
              className="inline-flex items-center gap-2.5 rounded-full bg-primary-50 px-6 py-3 text-sm font-medium text-primary-950 transition-opacity hover:opacity-90"
            >
              Join the beta
            </a>
          </motion.div>
          <motion.p {...FADE_IN_BLUR_DELAY(0.6)} className="mt-4 text-sm text-primary-500">
            Request access by signing in from the Mains app.
          </motion.p>
        </div>
      </section>
    </div>
  );
}
