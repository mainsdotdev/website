import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export function LocalFirstSection() {
  return (
    <section
      aria-labelledby="local-first-title"
      className="px-5 pt-20 pb-6 sm:px-8 lg:pt-28 lg:pb-10"
    >
      <div className="mx-auto max-w-360 py-16 text-center sm:py-20 lg:py-24">
        <h2
          id="local-first-title"
          className="text-[3.5rem] leading-[0.95] tracking-tight text-primary-50 sm:text-[4.2rem] lg:text-[5.5rem]"
        >
          Local first
        </h2>

        <p className="mt-8 text-[2.7rem] leading-[0.98] tracking-tight text-primary-50 sm:mt-8 sm:text-[4rem] lg:text-[5rem]">
          Your Mac is home base.
        </p>

        <div className="mx-auto mt-10 max-w-3xl space-y-4 text-base leading-relaxed text-primary-300 sm:mt-12 sm:text-lg lg:text-xl">
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
          className="mx-auto mt-10 inline-flex max-w-full items-center justify-center gap-3 rounded-full bg-primary-900 px-6 py-3 text-sm font-medium text-primary-50 transition-colors hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500 sm:mt-12 sm:text-base"
        >
          How Mains handles your data
          <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
        </Link>

      </div>
    </section>
  );
}
