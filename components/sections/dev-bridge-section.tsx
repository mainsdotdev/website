import Link from "next/link";
import { BridgeMark } from "@/components/bridge-mark";
import { ArrowRight } from "@/components/icons";

/**
 * Bridge's place on the developer page: right after "Local first", as the
 * answer to "and on my other computers?". The mark is the Bridge hero's,
 * drawn small, so the two pages read as one story.
 */
export function DevBridgeSection() {
  return (
    <section aria-labelledby="dev-bridge-title" className="px-5 py-16 sm:px-8 lg:py-24">
      <div className="mx-auto grid max-w-304 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <p className="flex items-center gap-2.5 text-base text-primary-300">
            Bridge
            <span className="rounded-full border border-primary-700 px-2 py-0.5 text-xs text-primary-300">Beta</span>
          </p>
          <h2
            id="dev-bridge-title"
            className="mt-4 text-3xl leading-tight tracking-tight text-balance text-primary-50 sm:text-4xl lg:text-5xl"
          >
            Keep your computers in sync.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-primary-300 lg:text-lg">
            Your work stays on your computer by default. When you want it on your other computers too, Bridge carries your
            Atlas pages and chats there, encrypted before they leave.
          </p>
          <Link
            href="/bridge"
            className="mt-8 inline-flex max-w-full items-center justify-center gap-3 rounded-full bg-primary-900 px-6 py-3 text-sm font-medium text-primary-50 transition-colors hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
          >
            Learn about Bridge
            <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
          </Link>
        </div>

        <div aria-hidden className="mx-auto w-full max-w-sm lg:max-w-md">
          <BridgeMark />
        </div>
      </div>
    </section>
  );
}
