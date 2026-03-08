"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function DashboardSection() {
  return (
    <section className="py-20 max-w-6xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-snug font-sans">
            Understand
            <br />
            progress at scale
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed max-w-sm md:pt-2">
            Take the guesswork out of product development with project updates,
            analytics, and dashboards that surface what needs your attention.
          </p>
        </div>

        {/* Dashboard Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-xl overflow-hidden border border-white/10 shadow-[0_0_80px_-20px_rgba(255,255,255,0.08)]"
        >
          <Image
            src="/dashboard.png"
            alt="Dashboard analytics view"
            width={1920}
            height={1080}
            className="w-full h-auto"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
