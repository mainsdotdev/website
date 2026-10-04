/**
 * Syntax colour for one line of TS/TSX in the mockups. Not a parser: a single
 * pass of the token shapes these short excerpts contain, which is enough to
 * read as highlighted code at mockup size without shipping a highlighter to
 * the client. Colours are the `--syn-*` tokens, so they follow the theme.
 */

const TOKEN = new RegExp(
  [
    String.raw`(?<comment>\/\/.*$|\{\/\*.*?\*\/\}|^\s*\/?\*.*$)`,
    String.raw`(?<string>"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\x60(?:[^\x60\\]|\\.)*\x60)`,
    String.raw`(?<tag>(?<=<\/?)[A-Za-z][\w.]*)`,
    String.raw`(?<attr>\b[a-zA-Z-]+(?==))`,
    String.raw`(?<keyword>\b(?:function|return|const|let|import|from|export|type|if|else|true|false|null|undefined)\b)`,
    String.raw`(?<fn>\b[a-zA-Z_]\w*(?=\())`,
    String.raw`(?<punct>[{}()[\]<>/=;,.?:])`,
  ].join("|"),
  "g"
);

const COLORS: Record<string, string> = {
  comment: "var(--syn-comment)",
  string: "var(--syn-string)",
  tag: "var(--syn-tag)",
  attr: "var(--syn-attr)",
  keyword: "var(--syn-keyword)",
  fn: "var(--syn-fn)",
  punct: "var(--syn-punct)",
};

export function CodeLine({ code }: { code: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const match of code.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) parts.push(code.slice(last, index));
    const kind = Object.entries(match.groups ?? {}).find(([, value]) => value !== undefined)?.[0];
    parts.push(
      <span
        key={index}
        style={{ color: kind ? COLORS[kind] : undefined }}
        className={kind === "comment" ? "italic" : undefined}
      >
        {match[0]}
      </span>
    );
    last = index + match[0].length;
  }
  if (last < code.length) parts.push(code.slice(last));
  return <>{parts}</>;
}
