"use client";

import { motion } from "framer-motion";
import { DashboardStats } from "@/components/demo/dashboard-stats";

export function DashboardSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-snug font-sans">
            Full observability for every agent run
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed max-w-sm md:pt-2">
            Monitor agent sessions, model costs, and tool usage across all your
            workspaces — so you always know where time and money are going.
          </p>
        </div>

        {/* Interactive Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <DashboardStats />
        </motion.div>
      </motion.div>
    </section>
  );
}
