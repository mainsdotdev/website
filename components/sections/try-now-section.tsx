"use client";

import { motion } from "framer-motion";
import { CtaActions } from "@/components/sections/cta-section";
import { FADE_IN_UP } from "@/lib/animations";

/** The page's last word, after cursor.com's: one large line, and the buttons under it. */
export function TryNowSection() {
  return (
    <section aria-labelledby="try-now-title" className="px-5 py-32 text-center sm:px-8 lg:py-44">
      <motion.div {...FADE_IN_UP} className="flex flex-col items-center">
        <h2
          id="try-now-title"
          className="text-6xl leading-none tracking-tight text-primary-50 sm:text-7xl lg:text-8xl"
        >
          Try Mains now.
        </h2>
        <CtaActions className="mt-10" />
      </motion.div>
    </section>
  );
}
