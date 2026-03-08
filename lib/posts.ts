import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
export type { Post } from './types';
import type { Post } from './types';

const contentDir = path.join(process.cwd(), 'content');

export function getAllPosts(): Post[] {
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.mdx'));

  return files.map((filename) => {
    const filePath = path.join(contentDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
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
      version: data.version,
      slug,
      url: `/blog/${slug}`,
      content,
    };
  });
}

export function getPostBySlug(slug: string): Post | undefined {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    title: data.title,
    date: data.date instanceof Date ? data.date.toISOString() : data.date,
    description: data.description,
    image: data.image,
    author: data.author,
    tags: data.tags,
    published: data.published ?? true,
    version: data.version,
    slug,
    url: `/blog/${slug}`,
    content,
  };
}
