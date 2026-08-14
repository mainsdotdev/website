import type { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import {
  MAINS_DOWNLOAD_DMG_URL,
  MAINS_GITHUB_REPO_URL,
  MAINS_VERSION,
} from "@/lib/constants";
import { getAllPosts } from "@/lib/posts";
import { AppWindow } from "@/components/demo/app-window";
import { HomeClient } from "./home-client";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const changelogPosts = getAllPosts()
    .filter((post) => post.published && post.tags?.includes('changelog'))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

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
        image: "https://mains.dev/og-image.jpg",
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
      <HomeClient
        changelogPosts={changelogPosts}
        appWindow={<AppWindow />}
      />
    </>
  );
}
