"use client";

import HeaderSpacer from "@/components/header-spacer";
import { HeroActions, HeroHeadline, HeroWindow } from "@/components/sections/hero-section";
import { usePlatformDetection } from "@/hooks/usePlatformDetection";

export function AtlasHeroSection({ appWindow }: { appWindow: React.ReactNode }) {
  const { platform } = usePlatformDetection();

  return (
    <>
      <HeaderSpacer />
      <section
        id="atlas-authoring"
        aria-labelledby="try-atlas-title"
        className="relative mx-auto max-w-304 px-5 pt-20 pb-16 sm:px-8 lg:pt-28"
      >
        <div className="relative flex flex-col items-center text-center">
          <HeroHeadline
            id="try-atlas-title"
            title="Try Atlas on Mains"
            tagline="Create with your agents. Keep it all in Atlas."
          />
          <HeroActions platform={platform} />
          <HeroWindow appWindow={appWindow} className="mt-14" />
        </div>
      </section>
    </>
  );
}
