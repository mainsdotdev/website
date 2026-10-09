import type { Metadata } from "next";
import { BridgeHeroSection } from "@/components/sections/bridge-hero-section";

export const metadata: Metadata = {
  title: "Bridge",
  alternates: { canonical: "/bridge" },
  // Work in progress: kept out of search results until the page has content.
  robots: { index: false, follow: false },
};

export default function BridgePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <BridgeHeroSection />
    </main>
  );
}
