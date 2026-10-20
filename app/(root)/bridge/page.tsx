import type { Metadata } from "next";
import { BridgeFaqSection } from "@/components/sections/bridge-faq-section";
import { BridgeFeaturesSection } from "@/components/sections/bridge-features-section";
import { BridgeHeroSection } from "@/components/sections/bridge-hero-section";
import { BridgeJoinSection } from "@/components/sections/bridge-join-section";
import { BridgePrivacySection } from "@/components/sections/bridge-privacy-section";
import { BridgeSyncControlSection } from "@/components/sections/bridge-sync-control-section";

export const metadata: Metadata = {
  title: "Bridge",
  description:
    "Sync your Atlas pages and chats across the computers you use Mains on, end-to-end encrypted. Now in beta.",
  alternates: { canonical: "/bridge" },
  // Work in progress: kept out of search results until Bridge launches.
  robots: { index: false, follow: false },
};

export default function BridgePage() {
  return (
    <main className="min-h-screen overflow-x-clip">
      <BridgeHeroSection />
      <BridgeFeaturesSection />
      <BridgeSyncControlSection />
      <BridgePrivacySection />
      <BridgeJoinSection />
      <BridgeFaqSection />
    </main>
  );
}
