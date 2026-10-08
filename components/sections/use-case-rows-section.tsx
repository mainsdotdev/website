"use client";

import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { WORK_USE_CASES } from "@/components/sections/dev-use-cases-section";
import { MAINS_DOCS_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Use cases one to a row, after cursor.com's feature cards: the words on one
 * side and the app, whole and framed, on the other.
 *
 * Every second row is mirrored — the app on the left and the words on the
 * right — so the rows zigzag.
 */
export function UseCaseRowsSection() {
  return (
    <section aria-label="Use cases" className="flex flex-col gap-10 px-5 py-24 sm:px-8 lg:gap-20 lg:py-32">
      {WORK_USE_CASES.map(({ title, description, Mockup, docsPath }, index) => {
        const mirrored = index % 2 === 1;
        return (
          <article
            key={title}
            aria-label={title}
            className={cn(
              "grid items-center gap-10 rounded-2xl border border-primary-50/8 bg-primary-900/30 p-5 sm:p-6 lg:gap-12",
              mirrored
                ? "lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)]"
                : "lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]"
            )}
          >
            <div className={mirrored ? "lg:order-2 lg:pr-4" : "lg:pl-4"}>
              <h3 className="text-2xl leading-snug tracking-tight text-primary-50 sm:text-3xl">{title}</h3>
              <p className="mt-1 text-2xl leading-snug tracking-tight text-primary-400 sm:text-3xl">{description}</p>
              <Link
                href={`${MAINS_DOCS_URL}/${docsPath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 text-lg text-blue-400 transition-colors hover:text-blue-300"
              >
                Learn more
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>

            <div
              className={cn(
                "relative aspect-video overflow-hidden rounded-xl border border-primary-700/40 bg-primary-950 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.6)]",
                mirrored && "lg:order-1"
              )}
            >
              <Mockup className="absolute inset-0" />
            </div>
          </article>
        );
      })}
    </section>
  );
}
