"use client";

import { USE_CASES } from "@/lib/constants";
import { GlobalDownloadGithubShortcuts } from "@/components/global-download-github-shortcuts";
import { HeroSection } from "@/components/sections/hero-section";
import { UseCasesSection } from "@/components/sections/use-cases-section";
import { LocalFirstSection } from "@/components/sections/local-first-section";
import { ChangelogSection } from "@/components/sections/changelog-section";
import { CtaSection } from "@/components/sections/cta-section";
import type { Post } from "@/lib/types";

export function HomeClient({
  changelogPosts,
  appWindow,
  releaseCanvas,
}: {
  changelogPosts: Post[];
  /** Server-rendered hero mockup, passed through so it stays off the client. */
  appWindow?: React.ReactNode;
  /** Server-rendered release imagery surrounding the hero mockup. */
  releaseCanvas?: React.ReactNode;
}) {
  return (
    <main className="min-h-screen ">
      <GlobalDownloadGithubShortcuts />
      <HeroSection
        appWindow={appWindow}
        releaseCanvas={releaseCanvas}
      />
      <UseCasesSection useCases={USE_CASES} />
      <LocalFirstSection />
      <ChangelogSection posts={changelogPosts} />
      <CtaSection />
    </main>
  );
}
