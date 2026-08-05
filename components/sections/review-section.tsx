"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { LazyMount } from "@/components/lazy-mount";
import { SectionHeader } from "@/components/section-header";
import { FADE_IN_UP, FADE_IN_UP_DELAY } from "@/lib/animations";

const DiffViewer = dynamic(
  () => import("@/components/demo/diff-viewer").then((m) => m.DiffViewer),
  { ssr: false }
);

export function ReviewSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <motion.div {...FADE_IN_UP}>
        <SectionHeader
          title="Review every change before it ships"
          description="Inspect diffs, catch issues with inline annotations, and approve with confidence — before any code reaches your main branch."
          className="mb-10"
          titleClassName="max-w-lg"
          descriptionClassName="md:text-base"
        />

        <motion.div {...FADE_IN_UP_DELAY(0.1)}>
          <LazyMount placeholderClassName="min-h-[548px]">
            <DiffViewer />
          </LazyMount>
        </motion.div>
      </motion.div>
    </section>
  );
}
