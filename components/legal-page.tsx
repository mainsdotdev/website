import Link from "next/link";
import Header from "@/components/header";
import { ChevronLeft } from "@/components/icons";
import { MDXContent } from "@/components/mdx-content";
import { TableOfContents } from "@/components/table-of-contents";
import { extractToc } from "@/lib/toc";
import type { LegalDoc } from "@/lib/legal";

/** "August 27, 2026" from the frontmatter's ISO date. */
export function formatUpdated(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

/**
 * A legal document in the blog post's clothes: the same column, the same
 * prose, the same table of contents down the side — so the privacy policy
 * reads like the rest of the site rather than like a contract pasted in.
 */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  const toc = extractToc(doc.content);
  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-primary-950">
      <Header />
      <article className="px-4">
        <header className="mx-auto max-w-4xl pt-6 text-center">
          <p className="text-sm text-primary-400">Last updated {formatUpdated(doc.updated)}</p>
          <h1 className="mt-6 text-4xl leading-[1.08] font-semibold tracking-tight text-white md:text-6xl">
            {doc.title}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-primary-300">{doc.description}</p>
          <div className="mt-12 flex items-center justify-between pt-5">
            <Link
              href="/legal"
              className="inline-flex items-center gap-2 text-sm text-primary-400 transition-colors hover:text-white"
            >
              <ChevronLeft className="size-4" />
              All legal pages
            </Link>
          </div>
        </header>

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
