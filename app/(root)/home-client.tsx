"use client";

import { USE_CASES } from "@/lib/constants";
import { GlobalDownloadGithubShortcuts } from "@/components/global-download-github-shortcuts";
import { HeroSection } from "@/components/sections/hero-section";
import { UseCasesSection } from "@/components/sections/use-cases-section";
import { IntegrationsSection } from "@/components/sections/integrations-section";
import { ReviewSection } from "@/components/sections/review-section";
import { ChangelogSection } from "@/components/sections/changelog-section";
import { CtaSection } from "@/components/sections/cta-section";
import { DashboardSection } from "@/components/sections/dashboard-section";
import { SentrySection } from "@/components/sections/sentry-section";
import { SecuritySection } from "@/components/sections/security-section";
import type { Post } from "@/lib/types";

export function HomeClient({
  changelogPosts,
  appWindow,
}: {
  changelogPosts: Post[];
  /** Server-rendered hero mockup, passed through so it stays off the client. */
  appWindow?: React.ReactNode;
}) {
  return (
    <main className="min-h-screen ">
      <GlobalDownloadGithubShortcuts />
      <HeroSection latestPost={changelogPosts[0]} appWindow={appWindow} />
      <UseCasesSection useCases={USE_CASES} />
      <ReviewSection />
      <SentrySection />
      <SecuritySection />
      <DashboardSection />
      <IntegrationsSection />
      <ChangelogSection posts={changelogPosts} />
      <CtaSection />
      <hr className="border-primary-900  mt-0.5" />
    </main>
  );
}
