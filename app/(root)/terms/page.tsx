import type { Metadata } from "next";
import { SITE_SOCIAL_IMAGE } from "@/lib/social-image";
import { LegalPage } from "@/components/legal-page";
import { getLegalDoc } from "@/lib/legal";

const doc = getLegalDoc("terms");

export const metadata: Metadata = {
  title: doc.title,
  description: doc.description,
  alternates: { canonical: "/terms" },
  openGraph: {
    title: `${doc.title} | Mains`,
    description: doc.description,
    url: "/terms",
    type: "article",
    images: [SITE_SOCIAL_IMAGE],
  },
};

export default function Page() {
  return <LegalPage doc={doc} />;
}
