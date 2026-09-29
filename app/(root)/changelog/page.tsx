import type { Metadata } from "next";
import { ChangelogWordmark } from "@/components/changelog-wordmark";
import { MDXContent } from "@/components/mdx-content";
import { getAllPosts } from "@/lib/posts";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Every Mains release, from the latest improvements to the first stable build.",
  alternates: { canonical: "/changelog" },
  openGraph: {
    title: "Changelog | Mains",
    description: "Every Mains release, from the latest improvements to the first stable build.",
    url: "/changelog",
    type: "website",
  },
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function splitOpeningParagraph(content: string) {
  const markdown = content.trim();
  const breakAt = markdown.search(/\r?\n\s*\r?\n/);

  if (breakAt === -1) return { opening: markdown, rest: "" };

  return {
    opening: markdown.slice(0, breakAt),
    rest: markdown.slice(breakAt).trimStart(),
  };
}

export default function ChangelogPage() {
  const releases = getAllPosts()
    .filter((post) => post.published && post.version && post.tags?.includes("changelog"))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-primary-950">
            <Header />

      <main className="mx-auto max-w-7xl px-5 pb-28 pt-20 sm:px-8 sm:pt-28 lg:px-12">
        <div className="pb-16 sm:pb-20">
          <ChangelogWordmark />

        </div>

        {releases.length === 0 ? (
          <p className=" py-16 text-primary-400">
            Release notes are coming soon.
          </p>
        ) : (
          <div className="">
            {releases.map((post, index) => {
              const anchor = `release-${post.version?.replaceAll(".", "-")}`;
              const { opening, rest } = splitOpeningParagraph(post.content);

              return (
                <article
                  key={post.slug}
                  id={anchor}
                  className="grid scroll-mt-28 gap-8 py-16 sm:py-20 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-16"
                >
                  <div className="flex items-center gap-4 lg:sticky lg:top-28 lg:block lg:self-start">
                    <a
                      href={`#${anchor}`}
                      aria-label={`Link to Mains version ${post.version}`}
                      className="inline-flex shrink-0 rounded-full border border-primary-700/45 bg-primary-900/60 px-3 py-1 font-mono text-sm text-primary-50 transition-colors hover:border-primary-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
                    >
                      v{post.version}
                    </a>
                    <time
                      dateTime={post.date}
                      className="text-sm text-primary-500 lg:mt-3 lg:block"
                    >
                      {dateFormatter.format(new Date(post.date))}
                    </time>
                    {index === 0 && (
                      <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-primary-500 lg:mt-5 lg:block">
                        Latest release
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 max-w-200">
                    <h2 className="max-w-3xl text-3xl leading-tight font-medium tracking-[-0.04em] text-primary-50 sm:text-4xl">
                      {post.title}
                    </h2>

                    <div className="prose prose-invert prose-primary changelog-opening mt-6 max-w-none">
                      <MDXContent source={opening} headingIdPrefix={anchor} />
                    </div>

                    {rest && (
                      <div className="prose prose-invert prose-primary changelog-prose mt-9 max-w-none">
                        <MDXContent source={rest} headingIdPrefix={anchor} />
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
