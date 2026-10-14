import HeaderSpacer from "@/components/header-spacer";
import { BlueprintRule } from "@/components/blueprint";
import { HeroActions, HeroHeadline, HeroWindow } from "@/components/sections/hero-section";

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
 * The home page's hero: the shared headline, buttons and window, laid out on
 * the blueprint grid, with a rule between the headline and the window. Render
 * it at the top of a `BlueprintColumn`, so the rails run from the top of the
 * page, behind the header; the page closes it off.
 */
export function DevHeroSection({
  appWindow,
  appWindowAside,
}: {
  appWindow: React.ReactNode;
  /** Overlaps the window's edge; see `HeroWindow`'s `aside`. */
  appWindowAside?: React.ReactNode;
}) {
  return (
    <>
      <HeaderSpacer />
      <section className="flex flex-col items-center px-5 pt-20 pb-20 text-center sm:px-8 lg:pt-28 lg:pb-24">
        <HeroHeadline words={DEV_SCRAMBLE_WORDS} />
        <HeroActions />
      </section>

      <BlueprintRule />

      <section className="px-5 py-10 sm:px-8 lg:py-16">
        <HeroWindow appWindow={appWindow} aside={appWindowAside} />
      </section>
    </>
  );
}
