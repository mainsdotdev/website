import type { Metadata } from "next";
import HeaderSpacer from "@/components/header-spacer";

export const metadata: Metadata = {
  title: "Atlas",
  alternates: { canonical: "/atlas" },
  // Work in progress: kept out of search results until the page has content.
  robots: { index: false, follow: false },
};

export default function AtlasPage() {
  return (
    <main className="min-h-screen">
      <HeaderSpacer />
    </main>
  );
}
