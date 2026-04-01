"use client";

import { USE_CASES } from "@/lib/constants";
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

export function HomeClient({ changelogPosts }: { changelogPosts: Post[] }) {
  return (
    <main className="min-h-screen ">
      <HeroSection />
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
