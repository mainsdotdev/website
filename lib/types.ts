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
