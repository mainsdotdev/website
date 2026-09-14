import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/header";
import { ArrowRightLine, Github, Mail, Question } from "@/components/icons";
import { MDXContent } from "@/components/mdx-content";
import { TableOfContents } from "@/components/table-of-contents";
import { MAINS_GITHUB_REPO_URL } from "@/lib/constants";
import { getSupportDoc, SUPPORT_EMAIL } from "@/lib/support";
import { extractToc } from "@/lib/toc";

const doc = getSupportDoc();

export const metadata: Metadata = {
  title: doc.title,
  description: doc.description,
  alternates: { canonical: "/support" },
  openGraph: {
    title: `${doc.title} | Mains`,
    description: doc.description,
    url: "/support",
    type: "website",
  },
};

const CHANNELS = [
  {
    icon: Mail,
    title: "Email us",
    body: SUPPORT_EMAIL,
    note: "Questions, problems, feedback. A person reads every message.",
    href: `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Mains Support")}`,
    external: false,
  },
  {
    icon: Github,
    title: "Report a bug",
    body: "GitHub Issues",
    note: "Mains is open source. Bugs and feature requests are tracked in public.",
    href: `${MAINS_GITHUB_REPO_URL}/issues`,
    external: true,
  },
  {
    icon: Question,
    title: "Read the docs",
    body: "docs.mains.dev",
    note: "Setup guides for the Mac app, Relay and the iPhone app.",
    href: "https://docs.mains.dev",
    external: true,
  },
] as const;

/**
 * The page App Store Connect's "Support URL" points at: ways to reach us up
 * top, then the questions people actually ask, in the legal pages' layout.
 */
export default function SupportPage() {
  const toc = extractToc(doc.content);
  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-primary-950">
      <Header />
      <article className="px-4">
        <header className="mx-auto max-w-4xl pt-6 text-center">
          <h1 className="mt-6 text-4xl leading-[1.08] font-semibold tracking-tight text-white md:text-6xl">
            {doc.title}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-primary-300">{doc.description}</p>
        </header>

        <ul className="mx-auto mt-16 grid max-w-4xl gap-4 md:grid-cols-3">
          {CHANNELS.map(({ icon: Icon, title, body, note, href, external }) => (
            <li key={title}>
              <Link
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex h-full flex-col rounded-2xl glass-card p-6 transition-colors"
              >
                <div className="flex items-center justify-between text-primary-400">
                  <Icon className="size-5" />
                  <ArrowRightLine className="size-4 -rotate-45 transition-colors group-hover:text-white" />
                </div>
                <h2 className="mt-6 text-sm text-primary-400">{title}</h2>
                <p className="mt-1 text-lg font-semibold break-all text-white">{body}</p>
                <p className="mt-2 text-sm leading-relaxed text-primary-300">{note}</p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-16 grid grid-cols-1 gap-16 pb-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,50rem)_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-w-44">
              <TableOfContents items={toc} />
            </div>
          </aside>
          <div className="prose prose-invert prose-primary mx-auto max-w-3xl lg:mx-0 lg:max-w-none">
            <MDXContent source={doc.content} />
          </div>
          <div className="hidden lg:block" />
        </div>
      </article>
    </div>
  );
}
