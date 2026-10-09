import type { Metadata } from "next";
import { AtlasBackdrop } from "@/components/atlas-backdrop";
import { AtlasDemo } from "@/components/demo/atlas-demo";
import { GlobalDownloadGithubShortcuts } from "@/components/global-download-github-shortcuts";
import HeaderSpacer from "@/components/header-spacer";
import { AtlasFeaturesSection } from "@/components/sections/atlas-features-section";
import { AtlasImageCreationSection } from "@/components/sections/atlas-image-creation-section";
import { AtlasLibrarySection } from "@/components/sections/atlas-library-section";
import { CtaActions } from "@/components/sections/cta-section";

export const metadata: Metadata = {
  title: "Atlas",
  alternates: { canonical: "/atlas" },
  // Work in progress: kept out of search results until the page has content.
  robots: { index: false, follow: false },
};

export default function AtlasPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <GlobalDownloadGithubShortcuts />
      <AtlasBackdrop />
      <HeaderSpacer />

      <section id="atlas-authoring" aria-label="Atlas" className="relative mx-auto max-w-304 px-5 pt-16 pb-16 sm:px-8">
        <div className="overflow-hidden rounded-xl  ">
          <AtlasDemo />
        </div>
      </section>

      <section aria-labelledby="try-atlas-title" className="relative mx-auto max-w-304 px-5 py-12 text-center sm:px-8 sm:py-16">
        <h2 id="try-atlas-title" className="text-3xl leading-tight tracking-tight text-primary-50 sm:text-4xl lg:text-5xl">
          Try Atlas on Mains
        </h2>
        <CtaActions className="mt-8" />
      </section>

      <AtlasLibrarySection />
      <AtlasImageCreationSection />
      <AtlasFeaturesSection />
    </main>
  );
}
