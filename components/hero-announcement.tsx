"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "@/components/icons";
import { FADE_IN_BLUR_DELAY } from "@/lib/animations";
import { HERO_ANNOUNCEMENT } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** The "what's new" pill above a hero headline; hidden while `HERO_ANNOUNCEMENT` is null. */
export function HeroAnnouncement({ className }: { className?: string }) {
  if (!HERO_ANNOUNCEMENT) return null;
  const { label, text, shortText, href } = HERO_ANNOUNCEMENT;

  return (
    <motion.div {...FADE_IN_BLUR_DELAY(0.1)} className={cn("relative z-10", className)}>
      <Link
        href={href}
        className="group glass-outline inline-flex max-w-full items-center gap-2.5 rounded-full bg-primary-900/60 py-1 pr-3.5 pl-1 text-sm text-primary-200 backdrop-blur-sm transition-colors hover:bg-primary-900 hover:text-primary-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
      >
        <span className="shrink-0 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-950">
          {label}
        </span>
        <span className="truncate sm:hidden">{shortText}</span>
        <span className="hidden truncate sm:inline">{text}</span>
        <ArrowRight
          aria-hidden
          className="size-3.5 shrink-0 text-primary-400 transition-transform group-hover:translate-x-0.5 group-hover:text-primary-50 motion-reduce:transition-none"
        />
      </Link>
    </motion.div>
  );
}
