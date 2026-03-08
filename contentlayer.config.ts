import { defineDocumentType, makeSource } from 'contentlayer2/source-files';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

interface RehypeElement {
  children: { type: string; value: string }[];
  properties: { className: string[] };
}

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date of the post',
      required: true,
    },
    description: {
      type: 'string',
      description: 'A short description of the post',
      required: true,
    },
    image: {
      type: 'string',
      description: 'Cover image for the post',
      required: false,
    },
    author: {
      type: 'string',
      description: 'Author of the post',
      required: false,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      description: 'Tags for the post',
      required: false,
    },
    published: {
      type: 'boolean',
      description: 'Whether the post is published',
      required: false,
      default: true,
    },
    version: {
      type: 'string',
      description: 'Version number for changelog entries',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/blog/${post._raw.flattenedPath}`,
    },
    slug: {
      type: 'string',
      resolve: (post) => post._raw.flattenedPath,
    },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post],
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: 'github-dark',
          onVisitLine(node: RehypeElement) {
            // Prevent lines from collapsing in `display: grid` mode
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
        },
      ],
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
});
