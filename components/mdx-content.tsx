import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { LazyVideo } from '@/components/lazy-video';
import { ProseImage } from '@/components/prose-image';

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

/**
 * MDX only routes *markdown-generated* elements through this map — a literal
 * `<img>` written in a post compiles to a raw DOM tag and skips it entirely.
 * So posts use the capitalized `<Figure>` / `<Video>`, which always resolve
 * here, while `img` still covers `![alt](src)`.
 *
 * Note: next-mdx-remote v6 strips every `prop={expression}` from MDX, so these
 * take their numbers as strings (`width="780"`) and coerce.
 */
const components = {
  img: ProseImage,
  Figure: ProseImage,
  Video: LazyVideo,
};

export function MDXContent({ source }: MDXContentProps) {
  return (
    <MDXRemote
      source={source}
      components={components}
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
