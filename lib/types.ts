export type TocItem = {
  id: string;
  title: string;
  /** Heading depth — 2 for h2, 3 for h3. */
  level: number;
};

export type Post = {
  title: string;
  date: string;
  description: string;
  image?: string;
  author?: string;
  tags?: string[];
  published: boolean;
  version?: string;
  slug: string;
  url: string;
  content: string;
};
