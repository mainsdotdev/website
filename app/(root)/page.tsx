import type { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import {
  MAINS_DOWNLOAD_DMG_URL,
  MAINS_GITHUB_REPO_URL,
  MAINS_VERSION,
} from "@/lib/constants";
import { getBlogPosts } from "@/lib/posts";
import { SITE_SOCIAL_IMAGE } from "@/lib/social-image";
import {
  BlueprintBackdrop,
  BlueprintColumn,
  BlueprintGap,
  BlueprintGridPanel,
  BlueprintRule,
} from "@/components/blueprint";
import { DevAppWindow } from "@/components/demo/dev-app-window";
import { PhoneChat } from "@/components/demo/phone-chat";
import { GlobalDownloadGithubShortcuts } from "@/components/global-download-github-shortcuts";
import { NoOrbFlight } from "@/components/orb-flight";
import { CtaSection } from "@/components/sections/cta-section";
import { DevBlogSection } from "@/components/sections/dev-blog-section";
import { DevFeaturesSection } from "@/components/sections/dev-features-section";
import { DevHeroSection } from "@/components/sections/dev-hero-section";
import { DevThemesSection } from "@/components/sections/dev-themes-section";
import { DevUseCasesSection } from "@/components/sections/dev-use-cases-section";
import { LocalFirstSection } from "@/components/sections/local-first-section";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const blogPosts = getBlogPosts();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://mains.dev/#organization",
        name: "Mains",
        url: "https://mains.dev",
        logo: "https://mains.dev/logo.png",
        sameAs: [MAINS_GITHUB_REPO_URL],
      },
      {
        "@type": "WebSite",
        "@id": "https://mains.dev/#website",
        url: "https://mains.dev",
        name: "Mains",
        publisher: {
          "@id": "https://mains.dev/#organization",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://mains.dev/#software",
        name: "Mains",
        url: "https://mains.dev",
        description:
          "An open-source desktop app for running AI coding agents in isolated, Git-backed workspaces.",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "macOS",
        softwareVersion: MAINS_VERSION,
        downloadUrl: MAINS_DOWNLOAD_DMG_URL,
        image: new URL(SITE_SOCIAL_IMAGE.url, "https://mains.dev").toString(),
        isAccessibleForFree: true,
        author: {
          "@id": "https://mains.dev/#organization",
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };

  return (
    <>
      <StructuredData data={structuredData} />
      {/* `isolate` keeps the backdrop under the content but above the page
          background; `overflow-x-clip` trims the page-wide blueprint rules. */}
      <main className="relative isolate min-h-screen overflow-x-clip pb-24">
        <GlobalDownloadGithubShortcuts />
        <BlueprintBackdrop />
        <BlueprintColumn>
          <DevHeroSection
            appWindow={<DevAppWindow />}
            appWindowAside={
              // Against the window's bottom-right corner, dropping a little below
              // it. It overlaps only the gutter beside the chat column (~14% of the
              // window) and grows into the page margin as the viewport allows.
              // Below `lg` the window fills the width, so there is no edge to sit on.
              <PhoneChat className="pointer-events-none absolute -right-[3%] -bottom-[6%] hidden w-[17%] lg:block xl:-right-[5%] xl:w-[19%] 2xl:-right-[10%] 2xl:w-[24%]" />
            }
          />

          <BlueprintGap />
          {/* There is no hero orb here to fly into the mockups, so each draws
              its own. */}
          <NoOrbFlight>
            <DevUseCasesSection shipMockup={<DevAppWindow sessionPanel designHeight={648} />} />
          </NoOrbFlight>

          <BlueprintGap />
          <DevFeaturesSection />

          <BlueprintGap />
          <DevThemesSection appWindow={<DevAppWindow />} />

          <BlueprintGap />
          <LocalFirstSection compact />

          {/* Drafts only show while developing, so a build may have no posts. */}
          {/* {blogPosts.length > 0 && (
            <>
              <BlueprintGap />
              <DevBlogSection posts={blogPosts} />
            </>
          )} */}

          <BlueprintGap />
          <BlueprintGridPanel>
            <CtaSection orb={false} />
          </BlueprintGridPanel>
          <BlueprintRule />
        </BlueprintColumn>
      </main>
    </>
  );
}
