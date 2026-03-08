"use client";

import { usePlatformDetection } from "@/hooks/usePlatformDetection";
import { USE_CASES } from "@/lib/constants";
import { HeroSection } from "@/components/sections/hero-section";
import { UseCasesSection } from "@/components/sections/use-cases-section";
import { IntegrationsSection } from "@/components/sections/integrations-section";
import { ReviewSection } from "@/components/sections/review-section";
import { ChangelogSection } from "@/components/sections/changelog-section";
import { CtaSection } from "@/components/sections/cta-section";
import { DashboardSection } from "@/components/sections/dashboard-section";

export default function Home() {
  const { isMac } = usePlatformDetection();
  return (
    <main className="min-h-screen ">
      <HeroSection platform={isMac ? "macOS" : "Windows"} />
      <UseCasesSection useCases={USE_CASES} />
      <ReviewSection />
      <DashboardSection />
      <IntegrationsSection />
      <ChangelogSection />
      <CtaSection />
      <hr className="border-primary-900  mt-0.5" />
    </main>
  );
}
