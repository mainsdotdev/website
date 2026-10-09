import type { Metadata } from "next";
import { AtlasBackdrop } from "@/components/atlas-backdrop";
import { AtlasDemo } from "@/components/demo/atlas-demo";
import HeaderSpacer from "@/components/header-spacer";

export const metadata: Metadata = {
  title: "Atlas",
  alternates: { canonical: "/atlas" },
  // Work in progress: kept out of search results until the page has content.
  robots: { index: false, follow: false },
};

export default function AtlasPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <AtlasBackdrop />
      <HeaderSpacer />

      <section aria-label="Atlas" className="relative mx-auto max-w-304 px-5 pt-16 pb-32 sm:px-8">
        <div className="overflow-hidden rounded-xl shadow-2xl shadow-(color:--demo-shadow)">
          <AtlasDemo />
        </div>
      </section>
    </main>
  );
}
