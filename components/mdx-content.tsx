import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { LazyVideo } from '@/components/lazy-video';
import { ProseImage } from '@/components/prose-image';
import { codeTheme, codeThemeLight } from '@/lib/code-theme';

type MDXContentProps = {
  source: string;
  headingIdPrefix?: string;
};

interface RehypeElement {
  children: { type: string; value: string }[];
  properties: { className: string[] };
}

type RehypeNode = {
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: RehypeNode[];
};

function prefixHeadingIds(prefix: string) {
  return (tree: RehypeNode) => {
    function visit(node: RehypeNode) {
      if (/^h[1-6]$/.test(node.tagName ?? "") && typeof node.properties?.id === "string") {
        node.properties.id = `${prefix}-${node.properties.id}`;
      }

      if (node.tagName === "a" && typeof node.properties?.href === "string" && node.properties.href.startsWith("#")) {
        node.properties.href = `#${prefix}-${node.properties.href.slice(1)}`;
      }

      node.children?.forEach(visit);
    }

    visit(tree);
  };
}

const rehypeOptions = {
  theme: { dark: codeTheme, light: codeThemeLight },
  keepBackground: false,
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

export function MDXContent({ source, headingIdPrefix }: MDXContentProps) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          rehypePlugins: [
            rehypeSlug,
            ...(headingIdPrefix ? [[prefixHeadingIds, headingIdPrefix] as [typeof prefixHeadingIds, string]] : []),
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
