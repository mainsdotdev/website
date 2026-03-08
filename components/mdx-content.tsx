import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

type MDXContentProps = {
  source: string;
};

interface RehypeElement {
  children: { type: string; value: string }[];
  properties: { className: string[] };
}

const rehypeOptions = {
  theme: 'github-dark',
  onVisitLine(node: RehypeElement) {
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }];
    }
  },
  onVisitHighlightedLine(node: RehypeElement) {
    node.properties.className.push('line--highlighted');
  },
  onVisitHighlightedWord(node: RehypeElement) {
    node.properties.className = ['word--highlighted'];
  },
};

export function MDXContent({ source }: MDXContentProps) {
  return (
    <MDXRemote
      source={source}
      options={{
        mdxOptions: {
          rehypePlugins: [
            rehypeSlug,
            [rehypePrettyCode, rehypeOptions],
            [
              rehypeAutolinkHeadings,
              {
                properties: {
                  className: ['anchor'],
                  ariaLabel: 'Link to section',
                },
              },
            ],
          ],
        },
      }}
    />
  );
}
