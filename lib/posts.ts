import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
export type { Post } from './types';
import type { Post } from './types';

/** Release notes, one `.mdx` per release at the top of `content/`. */
const contentDir = path.join(process.cwd(), 'content');
/** Technical writing, in its own folder like `content/legal`. */
const blogDir = path.join(contentDir, 'blog');

const SOURCES = [
  { dir: contentDir, category: 'changelog' },
  { dir: blogDir, category: 'blog' },
] as const satisfies readonly { dir: string; category: Post['category'] }[];

function readPost(dir: string, filename: string, category: Post['category']): Post {
  const fileContent = fs.readFileSync(path.join(dir, filename), 'utf-8');
  const { data, content } = matter(fileContent);
  const slug = filename.replace(/\.mdx$/, '');

  return {
    title: data.title,
    date: data.date instanceof Date ? data.date.toISOString() : data.date,
    description: data.description,
    image: data.image,
    author: data.author,
    tags: data.tags,
    published: data.published ?? true,
    category,
    version: data.version,
    slug,
    url: `/blog/${slug}`,
    content,
  };
}

export function getAllPosts(): Post[] {
  return SOURCES.flatMap(({ dir, category }) =>
    fs.existsSync(dir)
      ? fs
          .readdirSync(dir)
          .filter((f) => f.endsWith('.mdx'))
          .map((filename) => readPost(dir, filename, category))
      : []
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  for (const { dir, category } of SOURCES) {
    if (fs.existsSync(path.join(dir, `${slug}.mdx`))) return readPost(dir, `${slug}.mdx`, category);
  }
  return undefined;
}

/**
 * Whether a post can be shown. A draft (`published: false`) shows while
 * developing, so it can be read in place, and never in a production build.
 */
export function isPostVisible(post: Post): boolean {
  return post.published || process.env.NODE_ENV === 'development';
}

/** The technical posts that can be shown, newest first. */
export function getBlogPosts(): Post[] {
  return getAllPosts()
    .filter((post) => post.category === 'blog' && isPostVisible(post))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
