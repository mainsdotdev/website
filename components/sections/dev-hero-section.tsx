"use client";

import HeaderSpacer from "@/components/header-spacer";
import { BlueprintRule } from "@/components/blueprint";
import { HeroActions, HeroHeadline, HeroWindow } from "@/components/sections/hero-section";
import { usePlatformDetection } from "@/hooks/usePlatformDetection";

/** What a developer hands Mains: the work of a repository, not everyday asks. */
const DEV_SCRAMBLE_WORDS = [
  "agents.",
  "PRs.",
  "issues.",
  "diffs.",
  "reviews.",
  "bugs.",
  "branches.",
  "refactors.",
  "code.",
] as const;

/**
 * The developer page's hero: the home hero's headline, buttons and window,
 * laid out on the blueprint grid, with a rule between the headline and the
 * window. Render it at the top of a `BlueprintColumn`, so the rails run from
 * the top of the page, behind the header; the page closes it off.
 */
export function DevHeroSection({
  appWindow,
  appWindowAside,
}: {
  /** Rendered on the server and handed down, like the home hero's window. */
  appWindow: React.ReactNode;
  appWindowAside?: React.ReactNode;
}) {
  const { platform } = usePlatformDetection();

  return (
    <>
      <HeaderSpacer />
      <section className="flex flex-col items-center px-5 pt-20 pb-20 text-center sm:px-8 lg:pt-28 lg:pb-24">
        <HeroHeadline words={DEV_SCRAMBLE_WORDS} />
        <HeroActions platform={platform} />
      </section>

      <BlueprintRule />

      <section className="px-5 py-10 sm:px-8 lg:py-16">
        <HeroWindow appWindow={appWindow} aside={appWindowAside} />
      </section>
    </>
  );
}
