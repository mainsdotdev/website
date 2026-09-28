/**
 * Syntax theme for blog code blocks. The site's `primary` scale is Flexoki's
 * base scale, so the tokens use Flexoki's dark-mode accents on the same
 * neutrals instead of GitHub's blues. The background comes from `.prose pre`
 * (rehype-pretty-code runs with `keepBackground: false`).
 */
export const codeTheme = {
  name: 'mains-flexoki-dark',
  type: 'dark',
  colors: {
    'editor.background': '#1c1b1a',
    'editor.foreground': '#cecdc3',
  },
  tokenColors: [
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: '#6f6e69', fontStyle: 'italic' },
    },
    {
      scope: ['keyword', 'storage', 'keyword.operator.new'],
      settings: { foreground: '#879a39' },
    },
    {
      scope: ['string', 'string.quoted'],
      settings: { foreground: '#3aa99f' },
    },
    {
      // Shell arguments are unquoted strings; painting them all cyan drowns
      // the command and its flags.
      scope: ['string.unquoted.argument'],
      settings: { foreground: '#cecdc3' },
    },
    {
      scope: ['constant.numeric', 'constant.language'],
      settings: { foreground: '#8b7ec8' },
    },
    {
      scope: ['constant.other.option', 'constant.other', 'support.constant'],
      settings: { foreground: '#d0a215' },
    },
    {
      scope: [
        'entity.name.function',
        'support.function',
        'entity.name.command',
        'meta.function-call',
      ],
      settings: { foreground: '#da702c' },
    },
    {
      scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class'],
      settings: { foreground: '#d0a215' },
    },
    {
      scope: ['entity.name.tag'],
      settings: { foreground: '#4385be' },
    },
    {
      scope: ['entity.other.attribute-name'],
      settings: { foreground: '#d0a215' },
    },
    {
      scope: ['variable.parameter', 'variable.other.property', 'meta.object-literal.key'],
      settings: { foreground: '#4385be' },
    },
    {
      scope: ['punctuation', 'keyword.operator', 'meta.brace'],
      settings: { foreground: '#878580' },
    },
  ],
};

export const codeThemeLight = {
  name: 'mains-flexoki-light',
  type: 'light',
  colors: {
    'editor.background': '#fffcf0',
    'editor.foreground': '#403e3c',
  },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#6f6e69', fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'keyword.operator.new'], settings: { foreground: '#556b00' } },
    { scope: ['string', 'string.quoted'], settings: { foreground: '#1f766d' } },
    { scope: ['string.unquoted.argument'], settings: { foreground: '#403e3c' } },
    { scope: ['constant.numeric', 'constant.language'], settings: { foreground: '#6650a0' } },
    { scope: ['constant.other.option', 'constant.other', 'support.constant'], settings: { foreground: '#896500' } },
    { scope: ['entity.name.function', 'support.function', 'entity.name.command', 'meta.function-call'], settings: { foreground: '#a44b18' } },
    { scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class'], settings: { foreground: '#896500' } },
    { scope: ['entity.name.tag'], settings: { foreground: '#245f9b' } },
    { scope: ['entity.other.attribute-name'], settings: { foreground: '#896500' } },
    { scope: ['variable.parameter', 'variable.other.property', 'meta.object-literal.key'], settings: { foreground: '#245f9b' } },
    { scope: ['punctuation', 'keyword.operator', 'meta.brace'], settings: { foreground: '#6f6e69' } },
  ],
};
