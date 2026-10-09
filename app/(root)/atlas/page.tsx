import type { Metadata } from "next";
import { AtlasBackdrop } from "@/components/atlas-backdrop";
import { AtlasDemo } from "@/components/demo/atlas-demo";
import { GlobalDownloadGithubShortcuts } from "@/components/global-download-github-shortcuts";
import { AtlasFeaturesSection } from "@/components/sections/atlas-features-section";
import { AtlasHeroSection } from "@/components/sections/atlas-hero-section";
import { AtlasImageCreationSection } from "@/components/sections/atlas-image-creation-section";
import { AtlasLibrarySection } from "@/components/sections/atlas-library-section";

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
      <AtlasHeroSection appWindow={<AtlasDemo />} />

      <AtlasLibrarySection />
      <AtlasImageCreationSection />
      <AtlasFeaturesSection />
    </main>
  );
}
