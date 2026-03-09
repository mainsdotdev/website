"use client";

import { motion } from "framer-motion";
import { DiffViewer } from "@/components/demo/diff-viewer";

export function ReviewSection() {
  return (
    <section className="py-20 max-w-6xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-snug font-sans max-w-lg">
            Review every change before it ships
          </h2>
          <p className="text-sm md:text-base text-neutral-400 max-w-sm leading-relaxed">
            Inspect diffs, catch issues with inline annotations, and approve
            with confidence — before any code reaches your main branch.
          </p>
        </div>

        {/* Interactive Diff Viewer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <DiffViewer />
        </motion.div>
      </motion.div>
    </section>
  );
}
