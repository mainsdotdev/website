"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { LazyMount } from "@/components/lazy-mount";
import { SectionHeader } from "@/components/section-header";
import { FADE_IN_UP, FADE_IN_UP_DELAY } from "@/lib/animations";

const DashboardStats = dynamic(
  () => import("@/components/demo/dashboard-stats").then((m) => m.DashboardStats),
  { ssr: false }
);

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
          <LazyMount placeholderClassName="min-h-[1120px] md:min-h-[720px]">
            <DashboardStats />
          </LazyMount>
        </motion.div>
      </motion.div>
    </section>
  );
}
