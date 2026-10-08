import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { cn } from "@/lib/utils";

/** `compact` sets it smaller, as one section among many on the developer page. */
export function LocalFirstSection({ compact = false }: { compact?: boolean } = {}) {
  return (
    <section
      aria-labelledby="local-first-title"
      className={cn(
        "px-5 sm:px-8",
        compact ? "py-16 lg:py-24" : "pt-20 pb-6 lg:pt-28 lg:pb-10"
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-360 text-center",
          !compact && "py-16 sm:py-20 lg:py-24"
        )}
      >
        <h2
          id="local-first-title"
          className={cn(
            "leading-[0.95] tracking-tight text-primary-50",
            compact
              ? "text-4xl sm:text-5xl lg:text-6xl"
              : "text-[3.5rem] sm:text-[4.2rem] lg:text-[5.5rem]"
          )}
        >
          Local first
        </h2>

        <p
          className={cn(
            "leading-[0.98] tracking-tight text-primary-50",
            compact
              ? "mt-4 text-3xl sm:mt-5 sm:text-4xl lg:text-5xl"
              : "mt-8 text-[2.7rem] sm:mt-8 sm:text-[4rem] lg:text-[5rem]"
          )}
        >
          Your Mac is home base.
        </p>

        <div
          className={cn(
            "mx-auto space-y-4 leading-relaxed text-primary-300",
            compact
              ? "mt-8 max-w-2xl text-base lg:text-lg"
              : "mt-10 max-w-3xl text-base sm:mt-12 sm:text-lg lg:text-xl"
          )}
        >
          <p>
            Your workspaces and run history stay on your Mac by default. Agents
            work in the repositories you choose, and you can inspect their
            changes before committing.
          </p>
          <p>
            Getting started doesn&apos;t require a Mains account or hosted workspace.
            Your Mac connects to the AI provider and tools you choose for each task.
          </p>
        </div>

        <Link
          href="/privacy"
          className={cn(
            "mx-auto inline-flex max-w-full items-center justify-center gap-3 rounded-full bg-primary-900 px-6 py-3 text-sm font-medium text-primary-50 transition-colors hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500",
            compact ? "mt-8" : "mt-10 sm:mt-12 sm:text-base"
          )}
        >
          How Mains handles your data
          <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
        </Link>

      </div>
    </section>
  );
}
