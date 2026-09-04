import fs from "fs";
import path from "path";
import matter from "gray-matter";

/** The three legal pages, by URL segment. Anything else 404s. */
export const LEGAL_SLUGS = ["privacy", "terms", "license"] as const;
export type LegalSlug = (typeof LEGAL_SLUGS)[number];

export interface LegalDoc {
  slug: LegalSlug;
  title: string;
  description: string;
  /** ISO date of the last material change — shown on the page and in the sitemap. */
  updated: string;
  content: string;
}

const legalDir = path.join(process.cwd(), "content", "legal");

export function isLegalSlug(value: string): value is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(value);
}

/** One legal document from `content/legal/<slug>.mdx`, frontmatter parsed. */
export function getLegalDoc(slug: LegalSlug): LegalDoc {
  const raw = fs.readFileSync(path.join(legalDir, `${slug}.mdx`), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    updated: String(data.updated ?? ""),
    content,
  };
}

export function getAllLegalDocs(): LegalDoc[] {
  return LEGAL_SLUGS.map(getLegalDoc);
}
