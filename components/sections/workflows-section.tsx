"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/section-header";
import { FADE_IN_UP, FADE_IN_UP_DELAY } from "@/lib/animations";
import { cn } from "@/lib/utils";

type WorkflowPreview =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string };

type WorkflowItem = {
  title: string;
  description: string;
  preview: WorkflowPreview;
};

const WORKFLOWS: WorkflowItem[] = [
  {
    title: "Agentic Editing",
    description:
      "Delegate tasks to any coding agent and watch them work in real time. Review every edit before it touches your branch.",
    preview: { type: "image", src: "/review.png", alt: "Agent editing files in a workspace" },
  },
  {
    title: "Diff Review",
    description:
      "Side-by-side diffs with inline annotations. Approve, request changes, or roll back individual hunks before opening a PR.",
    preview: { type: "image", src: "/header.png", alt: "Diff review interface" },
  },
  {
    title: "Task Orchestration",
    description:
      "Pipe issues from Linear, Jira, GitHub, and Asana straight into a workspace so agents start with the right context.",
    preview: { type: "image", src: "/dashboard.png", alt: "Task orchestration dashboard" },
  },
  {
    title: "Any Agent, Any Tool",
    description:
      "Run Claude Code, Copilot, Codex, or your own custom agent inside isolated, sandboxed workspaces — side by side.",
    preview: { type: "image", src: "/status2.png", alt: "Multiple agents running side by side" },
  },
];

export function WorkflowsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = WORKFLOWS[activeIndex];

  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <motion.div {...FADE_IN_UP}>
        <SectionHeader
          title="One studio for every coding agent"
          description="Mains doesn't lock you into a single workflow. Pick the right agent, give it context, and review every change in one place."
          layout="row"
          className="mb-12"
          titleClassName="max-w-xl"
          descriptionClassName="md:text-base"
        />

        <motion.div
          {...FADE_IN_UP_DELAY(0.1)}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start"
        >
          <div className="flex flex-col">
            {WORKFLOWS.map((item, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-expanded={isActive}
                  className={cn(
                    "group relative text-left border-l-2 px-5 py-5 transition-colors duration-300 cursor-pointer",
                    isActive
                      ? "border-white bg-primary-900/40"
                      : "border-primary-800 hover:border-primary-600"
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={cn(
                        "text-base md:text-lg tracking-tight transition-colors",
                        isActive
                          ? "text-white"
                          : "text-primary-400 group-hover:text-primary-200"
                      )}
                    >
                      {item.title}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "text-lg leading-none shrink-0 transition-all duration-300",
                        isActive
                          ? "opacity-0 scale-75"
                          : "text-primary-500 group-hover:text-primary-300"
                      )}
                    >
                      +
                    </span>
                  </div>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm md:text-base text-primary-300 leading-relaxed mt-3 max-w-md">
                          {item.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>

          <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-primary-800 bg-primary-900 shadow-2xl md:sticky md:top-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.title}
                initial={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-0"
              >
                {active.preview.type === "video" ? (
                  <video
                    src={active.preview.src}
                    poster={active.preview.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={active.preview.src}
                    alt={active.preview.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                    priority={activeIndex === 0}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
