import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/header";
import { formatUpdated } from "@/components/legal-page";
import { getAllLegalDocs } from "@/lib/legal";

const title = "Legal";
const description = "How Mains handles your data, the terms that govern its use, and the license the code is published under.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/legal" },
  openGraph: { title: `${title} | Mains`, description, url: "/legal", type: "website" },
};

/** The hub: three documents, each with what it is for, in one screen. */
export default function LegalIndexPage() {
  const docs = getAllLegalDocs();
  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-primary-950">
      <Header />
      <section className="px-4 pb-24">
        <header className="mx-auto max-w-4xl pt-6 text-center">
          <h1 className="mt-6 text-4xl leading-[1.08] font-semibold tracking-tight text-white md:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-primary-300">{description}</p>
        </header>
        <ul className="mx-auto mt-16 grid max-w-3xl gap-4">
          {docs.map((doc) => (
            <li key={doc.slug}>
              <Link
                href={`/${doc.slug}`}
                className="block rounded-2xl glass-card p-6 transition-colors "
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-xl font-semibold text-white">{doc.title}</h2>
                  <span className="shrink-0 text-xs text-primary-500">Updated {formatUpdated(doc.updated)}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-primary-300">{doc.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
