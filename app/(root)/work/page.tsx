import type { Metadata } from "next";
import { AppWindow } from "@/components/demo/app-window";
import { GlobalDownloadGithubShortcuts } from "@/components/global-download-github-shortcuts";
import { HeroReleaseCanvas } from "@/components/hero-release-canvas";
import { NoOrbFlight } from "@/components/orb-flight";
import { HeroSection } from "@/components/sections/hero-section";
import { IntegrationsSection } from "@/components/sections/integrations-section";
import { TryNowSection } from "@/components/sections/try-now-section";
import { UseCaseTabsSection } from "@/components/sections/use-case-tabs-section";
import { UseCasesSection } from "@/components/sections/use-cases-section";
import { USE_CASES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Work",
  alternates: { canonical: "/work" },
  // Work in progress: kept out of search results until the page has content.
  robots: { index: false, follow: false },
};

/** What everyday work hands Mains: the things people make and plan, not code. */
const WORK_SCRAMBLE_WORDS = [
  "ideas.",
  "plans.",
  "trips.",
  "reports.",
  "slides.",
  "images.",
  "research.",
  "notes.",
  "you.",
] as const;

export default function WorkPage() {
  return (
    <main className="min-h-screen">
      <GlobalDownloadGithubShortcuts />
      <HeroSection
        appWindow={<AppWindow />}
        releaseCanvas={<HeroReleaseCanvas />}
        words={WORK_SCRAMBLE_WORDS}
        tagline="Think, create, and get things done."
      />

      {/* The home page's use cases, full width as there. The hero orb flies
          on into each of them as the page scrolls. */}
      <UseCasesSection useCases={USE_CASES} />

      <div className="mx-auto max-w-304">
        {/* The same mockups again, so their orb stops would collide with the
            ones above: each draws its own orb instead. */}
        <NoOrbFlight>
          <UseCaseTabsSection />
        </NoOrbFlight>

        <IntegrationsSection />
        <TryNowSection />
      </div>
    </main>
  );
}
