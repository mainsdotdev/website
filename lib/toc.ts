import GithubSlugger from "github-slugger";
import type { TocItem } from "./types";

/** Strips the inline markdown rehype-slug never sees, so ids line up. */
function toPlainText(heading: string) {
  return heading
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__|\*|_)/g, "")
    .trim();
}

/**
 * Pulls h2/h3 headings out of raw MDX. Ids are generated with the same slugger
 * rehype-slug uses at render time, so anchors match without a DOM round-trip.
 */
export function extractToc(source: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let insideFence = false;

  for (const line of source.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      insideFence = !insideFence;
      continue;
    }
    if (insideFence) continue;

    const match = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const title = toPlainText(match[2]);
    if (!title) continue;

    // Every heading feeds the slugger — its dedupe counter has to stay in sync
    // with rehype-slug's, even for the h1 the sidebar leaves out.
    const id = slugger.slug(title);
    const level = match[1].length;
    if (level === 1) continue;

    items.push({ id, title, level });
  }

  return items;
}
