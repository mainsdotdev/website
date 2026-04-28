"use client";

import { motion } from "framer-motion";
import { PackageGuard } from "@/components/demo/package-guard";
import { SectionHeader } from "@/components/section-header";
import { FADE_IN_UP, FADE_IN_UP_DELAY } from "@/lib/animations";

export function SecuritySection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <motion.div
        {...FADE_IN_UP}
        className="flex flex-col md:flex-row items-start gap-12"
      >
        <div className="md:w-3/8">
          <SectionHeader
            title="Block risky dependencies before they land"
            description="Mains checks every package install against Socket.dev before it executes — across npm, pip, cargo, go, and gems. Malware, typosquats, and vulnerable packages are denied automatically."
            layout="column"
            titleClassName="max-w-xl"
            descriptionClassName="md:text-base"
          />
        </div>

        <motion.div {...FADE_IN_UP_DELAY(0.2)} className="w-full md:w-5/8 min-w-0">
          <PackageGuard />
        </motion.div>
      </motion.div>
    </section>
  );
}
