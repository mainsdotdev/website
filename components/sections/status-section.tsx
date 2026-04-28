"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeader } from "@/components/section-header";
import { FADE_IN_UP, FADE_IN_UP_DELAY } from "@/lib/animations";

export function StatusSection() {
  return (
    <section className="py-20 max-w-6xl mx-auto px-6">
      <motion.div
        {...FADE_IN_UP}
        className="flex flex-col md:flex-row items-center gap-12"
      >
        <div className="md:w-2/6">
          <SectionHeader
            title="Agents turn ideas into code"
            description="Accelerate development by handing off tasks to Mains, while you focus on making decisions."
            layout="column"
            descriptionClassName="md:text-base"
          />
        </div>

        <motion.div
          {...FADE_IN_UP_DELAY(0.2)}
          className="md:w-4/6 rounded-xl overflow-hidden border border-white/10 shadow-[0_0_80px_-20px_rgba(255,255,255,0.08)]"
        >
          <Image
            src="/status2.png"
            alt="Agent status view"
            width={1920}
            height={1080}
            className="w-full h-auto"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
