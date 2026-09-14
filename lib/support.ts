import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const SUPPORT_EMAIL = "team@mains.dev";

export interface SupportDoc {
  title: string;
  description: string;
  /** ISO date of the last material change — shown in the sitemap. */
  updated: string;
  content: string;
}

/** The support page's FAQ from `content/support.mdx`, frontmatter parsed. */
export function getSupportDoc(): SupportDoc {
  const raw = fs.readFileSync(path.join(process.cwd(), "content", "support.mdx"), "utf8");
  const { data, content } = matter(raw);
  return {
    title: String(data.title ?? "Support"),
    description: String(data.description ?? ""),
    updated: String(data.updated ?? ""),
    content,
  };
}
