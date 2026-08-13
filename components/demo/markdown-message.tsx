import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

/**
 * The desktop app's markdown renderer, trimmed for the marketing mockup.
 *
 * Ported from `src/renderer/components/markdown-components.tsx`, so an agent
 * transcript on this site is laid out by the same element map the product
 * uses. Two deliberate differences:
 *
 * - The interactive overrides are dropped — the app's links open files in the
 *   editor and its images are consent-gated behind an IPC bridge, neither of
 *   which exists (or means anything) in a static mockup.
 * - Type scales down. The mockup renders a ~1868px window inside a ~1200px
 *   box, so the app's `text-sm` rows would come out about 40% too large for
 *   the chrome around them.
 *
 * This is a server component: the source is a constant, so react-markdown
 * runs at build time and never reaches the client bundle.
 */
const components: Components = {
  h1: ({ children }) => (
    <h1 className="mt-4 mb-2 font-sans text-[13px] font-bold text-primary-50">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-2 mb-1 font-sans text-[12px] font-semibold text-primary-50">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-3 mb-1 font-sans text-[11px] font-semibold text-primary-50">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-1 mb-0.5 font-sans text-[10px] font-semibold text-primary-50">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="font-sans text-[10px] leading-5 text-primary-200">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-2 list-outside list-disc space-y-1 pl-4 font-sans text-[10px] text-primary-200">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2 list-outside list-decimal space-y-1 pl-4 font-sans text-[10px] text-primary-200">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="font-sans text-[10px] leading-5 text-primary-200 [&>p]:my-0">
      {children}
    </li>
  ),
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-lg border border-primary-700/60">
      <table className="min-w-full border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-primary-50/10">{children}</thead>
  ),
  tbody: ({ children }) => <tbody className="bg-primary-50/5">{children}</tbody>,
  tr: ({ children }) => (
    <tr className="border-b border-primary-700/60">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="border-r border-primary-700/60 px-3 py-1.5 text-left font-sans text-[10px] font-semibold text-primary-100 last:border-r-0">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-r border-primary-700/60 px-3 py-1.5 font-sans text-[10px] text-primary-200 last:border-r-0">
      {children}
    </td>
  ),
  code: ({ className, children }) =>
    className ? (
      <code className="block overflow-x-auto rounded-xl bg-primary-50/10 p-3 text-[0.9em] text-primary-100">
        {children}
      </code>
    ) : (
      <code className="rounded bg-primary-50/10 px-1 py-0.5 text-[0.9em] text-primary-100">
        {children}
      </code>
    ),
  pre: ({ children }) => (
    <pre className="my-2 overflow-hidden rounded-xl bg-primary-50/10">
      {children}
    </pre>
  ),
  a: ({ children }) => (
    <span className="text-primary-300 underline">{children}</span>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-4 border-primary-600 py-1 pl-3 text-[10px] italic text-primary-300">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-primary-50">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-primary-100">{children}</em>,
  hr: () => <hr className="my-3 border-primary-700/60" />,
};

export function MarkdownMessage({ source }: { source: string }) {
  return (
    <Markdown remarkPlugins={[remarkGfm]} components={components}>
      {source}
    </Markdown>
  );
}
