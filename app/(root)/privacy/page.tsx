import type { Metadata } from "next";
import { SITE_SOCIAL_IMAGE } from "@/lib/social-image";
import { LegalPage } from "@/components/legal-page";
import { getLegalDoc } from "@/lib/legal";

const doc = getLegalDoc("privacy");

export const metadata: Metadata = {
  title: doc.title,
  description: doc.description,
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: `${doc.title} | Mains`,
    description: doc.description,
    url: "/privacy",
    type: "article",
    images: [SITE_SOCIAL_IMAGE],
  },
};

export default function Page() {
  return <LegalPage doc={doc} />;
}
