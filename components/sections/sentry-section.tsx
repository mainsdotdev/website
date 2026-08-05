"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { LazyMount } from "@/components/lazy-mount";
import { SectionHeader } from "@/components/section-header";
import { FADE_IN_UP, FADE_IN_UP_DELAY } from "@/lib/animations";

const SentryIssues = dynamic(
  () => import("@/components/demo/sentry-issues").then((m) => m.SentryIssues),
  { ssr: false }
);

export function SentrySection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <motion.div
        {...FADE_IN_UP}
        className="flex flex-col md:flex-row items-start gap-12"
      >
        <motion.div {...FADE_IN_UP_DELAY(0.1)} className="w-full md:w-5/8 min-w-0 order-2 md:order-1">
          <LazyMount placeholderClassName="min-h-[560px]">
            <SentryIssues />
          </LazyMount>
        </motion.div>

        <div className="md:w-3/8 order-1 md:order-2">
          <SectionHeader
            title="Turn Sentry signals into pull requests"
            description="Connect your Sentry project and let Mains prioritize unresolved issues, analyze stack traces, and generate fix PRs — automatically."
            layout="column"
            titleClassName="max-w-xl"
            descriptionClassName="md:text-base"
          />
        </div>
      </motion.div>
    </section>
  );
}
