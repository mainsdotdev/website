"use client";

import { motion } from "framer-motion";
import { DashboardStats } from "@/components/demo/dashboard-stats";
import { SectionHeader } from "@/components/section-header";
import { FADE_IN_UP, FADE_IN_UP_DELAY } from "@/lib/animations";

export function DashboardSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <motion.div {...FADE_IN_UP}>
        <SectionHeader
          title="Full observability for every agent run"
          description="Monitor agent sessions, model costs, and tool usage across all your workspaces — so you always know where time and money are going."
          className="mb-12"
          titleClassName="max-w-xl"
          descriptionClassName="md:text-base"
        />

        <motion.div {...FADE_IN_UP_DELAY(0.1)}>
          <DashboardStats />
        </motion.div>
      </motion.div>
    </section>
  );
}
