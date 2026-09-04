import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { getLegalDoc } from "@/lib/legal";

const doc = getLegalDoc("license");

export const metadata: Metadata = {
  title: doc.title,
  description: doc.description,
  alternates: { canonical: "/license" },
  openGraph: {
    title: `${doc.title} | Mains`,
    description: doc.description,
    url: "/license",
    type: "article",
  },
};

export default function Page() {
  return <LegalPage doc={doc} />;
}
