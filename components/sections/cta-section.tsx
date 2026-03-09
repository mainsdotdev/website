"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Download, Github } from "@/components/icons";

export function CtaSection() {
  return (
    <div className="border-b border-primary-900 ">
    <section className="py-24 max-w-3xl mx-auto px-6 text-center ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-6"
      >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-snug font-sans">
          Jinzo for AI coding agents
        </h2>
        <p className="text-sm md:text-base text-neutral-400 leading-relaxed max-w-xl">
          Run autonomous agents in secure workspaces, connect your repositories,
          and move from task to reviewed pull request without leaving Jinzo.
        </p>
        <div className="flex items-center gap-3 mt-4">
          <Link
            href=""
            className="inline-flex items-center gap-2 md:px-6 px-3 md:py-3 py-3 text-xs md:text-sm font-medium text-black bg-white rounded-full hover:bg-neutral-200 transition-colors"
          >
            Download for macOS
            <Download width={16} height={16} />
          </Link>
          <Link
            href="https://github.com/OkanBilal/jinzo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 md:px-6 px-3 md:py-3 py-3 text-xs md:text-sm font-medium text-white bg-black  rounded-full  transition-colors"
          >
            <Github width={16} height={16} />
            View Source
          </Link>
        </div>
      </motion.div>
    </section>
    </div>
  );
}
