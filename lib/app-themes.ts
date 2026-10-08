import type { CSSProperties } from "react";
import { contrastRatio, mixOklab, oklabLightness, shiftLightness } from "@/lib/color";

/**
 * The desktop app's color themes (Settings › Appearance), ported so the site
 * can show them on its own mockups. The presets are copied from the app's
 * `lib/app-theme-presets.ts`; the derivation follows its `lib/app-themes.ts`.
 *
 * A theme is a palette per appearance: background, foreground, accent, and a
 * contrast lift for low-contrast palettes. It restyles no component — every
 * surface and text color is a step of the one neutral scale
 * (`--color-primary-*`), so a theme re-derives that scale and everything
 * drawn from it follows. On the site the scale is written as CSS variables on
 * a mockup's wrapper (`themeScopeStyle`), which re-themes just that mockup.
 */

export type ThemeAppearance = "light" | "dark";

export interface ThemePalette {
  /** Content background, `#rrggbb`. The window frame is derived from it. */
  readonly background: string;
  /** Primary text, `#rrggbb`. */
  readonly foreground: string;
  /** Links, focus accents, selection, `#rrggbb`. */
  readonly accent: string;
  /** 0–1. Pulls the text half of the scale toward the foreground. */
  readonly contrast: number;
}

export interface AppThemePreset {
  readonly id: string;
  readonly name: string;
  /**
   * A palette per appearance it supports; `null` is the stock scale (the
   * Mains theme), and a missing key means it has nothing for that appearance.
   */
  readonly palettes: Partial<Record<ThemeAppearance, ThemePalette | null>>;
}

const palette = (
  background: string,
  foreground: string,
  accent: string,
  contrast = 0,
): ThemePalette => ({ background, foreground, accent, contrast });

/** The stock "Mains" theme as a palette: the app's index.css ends and accent. */
const STOCK_PALETTES: Record<ThemeAppearance, ThemePalette> = {
  light: palette("#ffffff", "#0c0c0c", "#2563eb"),
  dark: palette("#0c0c0c", "#ffffff", "#2563eb"),
};

export const DEFAULT_APP_THEME_ID = "mains";

/** Stock first, then alphabetical — the menu order. */
export const APP_THEME_PRESETS: readonly AppThemePreset[] = [
  {
    id: DEFAULT_APP_THEME_ID,
    name: "Mains",
    palettes: { light: null, dark: null },
  },
  {
    // ≈ Claude's own cream, slate and clay.
    id: "absolutely",
    name: "Absolutely",
    palettes: {
      light: palette("#faf9f5", "#141413", "#d97757"),
      dark: palette("#262624", "#f5f4ed", "#d97757"),
    },
  },
  {
    id: "ayu",
    name: "Ayu",
    palettes: { dark: palette("#0b0e14", "#bfbdb6", "#e6b450", 0.1) },
  },
  {
    id: "catppuccin",
    name: "Catppuccin",
    palettes: {
      light: palette("#eff1f5", "#4c4f69", "#8839ef", 1),
      dark: palette("#1e1e2e", "#cdd6f4", "#cba6f7"),
    },
  },
  {
    // ≈ dark.
    id: "codex",
    name: "Codex",
    palettes: {
      light: palette("#ffffff", "#0d0d0d", "#0169cc"),
      dark: palette("#111111", "#fcfcfc", "#339cff"),
    },
  },
  {
    id: "dracula",
    name: "Dracula",
    palettes: { dark: palette("#282a36", "#f8f8f2", "#ff79c6") },
  },
  {
    id: "everforest",
    name: "Everforest",
    palettes: {
      light: palette("#fdf6e3", "#343f44", "#8da101", 0.55),
      dark: palette("#2d353b", "#d3c6aa", "#a7c080", 0.3),
    },
  },
  {
    id: "flexoki",
    name: "Flexoki",
    palettes: {
      light: palette("#fffcf0", "#100f0f", "#205ea6"),
      dark: palette("#100f0f", "#cecdc3", "#4385be"),
    },
  },
  {
    id: "github",
    name: "GitHub",
    palettes: {
      light: palette("#ffffff", "#1f2328", "#0969da", 0.15),
      dark: palette("#0d1117", "#e6edf3", "#4493f8"),
    },
  },
  {
    id: "gruvbox",
    name: "Gruvbox",
    palettes: {
      light: palette("#fbf1c7", "#3c3836", "#076678", 0.6),
      dark: palette("#282828", "#ebdbb2", "#83a598"),
    },
  },
  {
    // Lotus light, Wave dark.
    id: "kanagawa",
    name: "Kanagawa",
    palettes: {
      light: palette("#f2ecbc", "#43436c", "#4d699b", 0.8),
      dark: palette("#1f1f28", "#dcd7ba", "#7e9cd8"),
    },
  },
  {
    // ≈
    id: "linear",
    name: "Linear",
    palettes: {
      light: palette("#fcfcfd", "#1c1d21", "#5e6ad2", 0.1),
      dark: palette("#0f1011", "#f7f8f8", "#5e6ad2"),
    },
  },
  {
    // ≈
    id: "lobster",
    name: "Lobster",
    palettes: { dark: palette("#141625", "#e4e4ef", "#ff5f5f") },
  },
  {
    id: "material",
    name: "Material",
    palettes: { dark: palette("#263238", "#eeffff", "#80cbc4") },
  },
  {
    // ≈
    id: "matrix",
    name: "Matrix",
    palettes: { dark: palette("#050a06", "#a8f0b8", "#22e55a") },
  },
  {
    id: "monokai",
    name: "Monokai",
    palettes: { dark: palette("#272822", "#f8f8f2", "#a6e22e") },
  },
  {
    id: "night-owl",
    name: "Night Owl",
    palettes: {
      // Light Owl.
      light: palette("#fbfbfb", "#403f53", "#4876d6", 0.55),
      dark: palette("#011627", "#d6deeb", "#82aaff"),
    },
  },
  {
    // Dayfox light, Nightfox dark.
    id: "nightfox",
    name: "Nightfox",
    palettes: {
      light: palette("#f6f2ee", "#3d2b5a", "#2848a9", 0.4),
      dark: palette("#192330", "#cdcecf", "#719cd6"),
    },
  },
  {
    id: "nord",
    name: "Nord",
    palettes: { dark: palette("#2e3440", "#d8dee9", "#88c0d0") },
  },
  {
    // ≈
    id: "notion",
    name: "Notion",
    palettes: {
      light: palette("#ffffff", "#37352f", "#2383e2", 0.35),
      dark: palette("#191919", "#d4d4d4", "#2383e2"),
    },
  },
  {
    id: "one",
    name: "One",
    palettes: {
      light: palette("#fafafa", "#383a42", "#4078f2", 0.45),
      dark: palette("#282c34", "#abb2bf", "#61afef", 0.5),
    },
  },
  {
    // ≈
    id: "oscurange",
    name: "Oscurange",
    palettes: { dark: palette("#0b0b0f", "#e6e6e6", "#f5a468") },
  },
  {
    // ≈
    id: "proof",
    name: "Proof",
    palettes: { light: palette("#f4f3ee", "#1f2421", "#3f6f55", 0.2) },
  },
  {
    // ≈
    id: "raycast",
    name: "Raycast",
    palettes: {
      light: palette("#ffffff", "#121212", "#ff6363"),
      dark: palette("#111111", "#eeeeee", "#ff6363"),
    },
  },
  {
    id: "rose-pine",
    name: "Rose Pine",
    palettes: {
      light: palette("#faf4ed", "#575279", "#d7827e", 1),
      dark: palette("#191724", "#e0def4", "#ebbcba"),
    },
  },
  {
    // ≈
    id: "sentry",
    name: "Sentry",
    palettes: { dark: palette("#1a1523", "#ebe6ef", "#7553ff") },
  },
  {
    id: "solarized",
    name: "Solarized",
    palettes: {
      light: palette("#fdf6e3", "#073642", "#b58900", 0.35),
      dark: palette("#002b36", "#93a1a1", "#dc322f", 0.75),
    },
  },
  {
    // ≈
    id: "temple",
    name: "Temple",
    palettes: { dark: palette("#07140d", "#e5e4c9", "#e3e34f") },
  },
  {
    id: "tokyo-night",
    name: "Tokyo Night",
    palettes: { dark: palette("#1a1b26", "#a9b1d6", "#7aa2f7", 0.3) },
  },
  {
    // ≈
    id: "vercel",
    name: "Vercel",
    palettes: {
      light: palette("#ffffff", "#171717", "#0070f3"),
      dark: palette("#0a0a0a", "#ededed", "#0070f3"),
    },
  },
  {
    // VS Code's Light+ / Dark+.
    id: "vscode-plus",
    name: "VS Code Plus",
    palettes: {
      light: palette("#ffffff", "#1f1f1f", "#005fb8", 0.1),
      dark: palette("#1e1e1e", "#d4d4d4", "#007acc"),
    },
  },
  {
    id: "xcode",
    name: "Xcode",
    palettes: {
      light: palette("#ffffff", "#000000", "#0e0eff"),
      dark: palette("#1f1f24", "#dfdfe0", "#6699ff"),
    },
  },
];

/** The themes that offer something for `appearance`, in menu order. */
export function appThemesFor(appearance: ThemeAppearance): AppThemePreset[] {
  return APP_THEME_PRESETS.filter((preset) => appearance in preset.palettes);
}

// ─────────────────────────────────────────────────────────────
// Resolution
// ─────────────────────────────────────────────────────────────

/** WCAG AA for text: the accent sets copy, like links. */
const ACCENT_MIN_CONTRAST = 4.5;

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

/**
 * A theme accent made readable on `background`: moved in OKLab lightness,
 * away from the background, until it reaches AA — hue and chroma kept.
 */
function fitAccent(color: string, background: string): string {
  const step = oklabLightness(background) < 0.5 ? 0.01 : -0.01;
  let fitted = color;
  for (let i = 1; i <= 100 && contrastRatio(fitted, background) < ACCENT_MIN_CONTRAST; i++) {
    fitted = shiftLightness(color, step * i);
  }
  return fitted;
}

/**
 * The colors a preset paints in `appearance`. Stock keeps its accent as
 * designed, like the app; a preset's accent is fitted to its background. A
 * preset with nothing for that appearance paints stock.
 */
export function themePalette(id: string, appearance: ThemeAppearance): ThemePalette {
  const preset = APP_THEME_PRESETS.find((entry) => entry.id === id)?.palettes[appearance];
  if (!preset) return STOCK_PALETTES[appearance];
  return { ...preset, accent: fitAccent(preset.accent, preset.background) };
}

// ─────────────────────────────────────────────────────────────
// Tokens
// ─────────────────────────────────────────────────────────────

/**
 * Where each step of the app's scale sits between its white end (0) and its
 * black end (1), measured from the app's index.css. Used here only for the
 * app-formula tokens (the glass fills), which name app steps.
 */
const APP_STEPS = {
  primary: 0,
  50: 0.059,
  100: 0.029,
  200: 0.157,
  300: 0.268,
  400: 0.359,
  500: 0.453,
  600: 0.547,
  700: 0.647,
  800: 0.865,
  900: 0.956,
  950: 1,
} as const;

/**
 * The site's scale, from the foreground end (0) to the background end (1).
 * The site writes every class for a dark surface — `bg-primary-950` paints
 * the background, `text-primary-50` the text — so the scale always runs
 * foreground to background, whichever appearance; a light theme comes out
 * reversed on its own, the way the site's own light mode is. Same positions
 * as the app's steps, kept in order, with the site's extra 150 and 850.
 */
const SITE_STEPS: ReadonlyArray<readonly [string, number]> = [
  ["--color-primary", 0],
  ["--color-primary-50", 0.029],
  ["--color-primary-100", 0.059],
  ["--color-primary-150", 0.108],
  ["--color-primary-200", 0.157],
  ["--color-primary-300", 0.268],
  ["--color-primary-400", 0.359],
  ["--color-primary-500", 0.453],
  ["--color-primary-600", 0.547],
  ["--color-primary-700", 0.647],
  ["--color-primary-800", 0.865],
  ["--color-primary-850", 0.91],
  ["--color-primary-900", 0.956],
  ["--color-primary-950", 1],
];

/**
 * Applies `contrast` to one step, given its share of the foreground. Steps
 * within a quarter of the background — hover fills, borders, cards — never
 * move; steps past three quarters move the full amount; a smoothstep joins
 * the two.
 */
function liftTextSteps(share: number, contrast: number): number {
  const u = clamp01((share - 0.25) / 0.5);
  const weight = u * u * (3 - 2 * u);
  return share + clamp01(contrast) * (1 - share) * weight;
}

/** One step, `share` of the way from the background to the foreground. */
const step = ({ background, foreground, contrast }: ThemePalette, share: number) =>
  mixOklab(background, foreground, liftTextSteps(share, contrast));

/** Text on an accent fill: white, or the palette's darker end when that reads better. */
function accentForeground(accent: string, { background, foreground }: ThemePalette): string {
  const ink = oklabLightness(background) < oklabLightness(foreground) ? background : foreground;
  const best = contrastRatio(accent, "#ffffff") >= contrastRatio(accent, ink) ? "#ffffff" : ink;
  if (contrastRatio(accent, best) >= ACCENT_MIN_CONTRAST) return best;
  return contrastRatio(accent, "#ffffff") >= contrastRatio(accent, "#000000") ? "#ffffff" : "#000000";
}

const mix = (a: string, b: string, percent: number) => `color-mix(in srgb, ${a} ${percent}%, ${b})`;

/**
 * The glass surfaces, by the app's own formulas for each appearance (its
 * index.css `@theme` block and `.dark`), over the app-oriented scale.
 */
function glassTokens(theme: ThemePalette, appearance: ThemeAppearance): Record<string, string> {
  const app = (name: keyof typeof APP_STEPS) =>
    step(theme, appearance === "light" ? APP_STEPS[name] : 1 - APP_STEPS[name]);

  if (appearance === "light") {
    return {
      "--glass-fill-surface": app(100),
      "--glass-fill-card": mix(app("primary"), "transparent", 98),
      "--glass-fill-input": app("primary"),
      "--glass-fill-toggle": mix(app(200), app(100), 86),
      "--glass-fill-button": mix(app("primary"), "transparent", 72),
      "--glass-fill-primary": mix(app(50), "transparent", 72),
      "--glass-fill-secondary": mix(app(950), "transparent", 42),
      "--glass-fill-command": mix(app(100), "transparent", 82),
      "--glass-hover-button": mix(app("primary"), "transparent", 90),
      "--glass-hover-primary": app(200),
      "--glass-rim": "rgb(0 0 0 / 8%)",
      "--glass-rim-shadow": "rgb(255 255 255 / 0%)",
      "--glass-outline-rim": "rgb(0 0 0 / 8%)",
    };
  }
  return {
    "--glass-fill-surface": app(900),
    "--glass-fill-card": mix(mix(app(900), app(800), 78), "transparent", 98),
    "--glass-fill-input": mix(app(950), app(900), 75),
    "--glass-fill-toggle": mix(app(950), app(900), 75),
    "--glass-fill-button": mix(app(800), "transparent", 72),
    "--glass-fill-primary": mix(app(800), "transparent", 72),
    "--glass-fill-secondary": mix(mix(app(600), app(500), 62), "transparent", 42),
    "--glass-fill-command": mix(app(950), "transparent", 80),
    "--glass-hover-button": mix(mix(app(800), app(700), 80), "transparent", 85),
    "--glass-hover-primary": mix(app(800), "transparent", 60),
    "--glass-rim": "rgb(255 255 255 / 8%)",
    "--glass-rim-shadow": "rgb(0 0 0 / 0%)",
    "--glass-outline-rim": "rgb(255 255 255 / 8%)",
  };
}

/**
 * Hues the mockups use for diffs and status, darkened for a light surface —
 * the same overrides the site's own light mode makes in globals.css.
 */
const LIGHT_HUES: Record<string, string> = {
  "--color-green-300": "#166534",
  "--color-green-400": "#15803d",
  "--color-green-900": "#bbf7d0",
  "--color-emerald-400": "#047857",
  "--color-red-300": "#991b1b",
  "--color-red-400": "#b91c1c",
  "--color-red-900": "#fecaca",
  "--color-red-950": "#fee2e2",
  "--color-yellow-300": "#854d0e",
  "--color-yellow-400": "#a16207",
  "--color-yellow-900": "#fef08a",
  "--color-orange-300": "#9a3412",
  "--color-orange-400": "#c2410c",
  "--color-orange-900": "#fed7aa",
  "--color-blue-300": "#1d4ed8",
  "--color-blue-400": "#2563eb",
  "--color-blue-900": "#bfdbfe",
  "--color-indigo-400": "#4338ca",
  "--color-indigo-900": "#c7d2fe",
  "--color-purple-300": "#6b21a8",
  "--color-purple-400": "#7e22ce",
  "--color-purple-900": "#e9d5ff",
};

/**
 * Every variable a mockup's wrapper sets to paint `theme` in `appearance`:
 * the neutral scale, the window frame and content surfaces, the glass fills,
 * the accent, and — for a light theme — darker diff and status hues.
 */
export function themeScopeStyle(theme: ThemePalette, appearance: ThemeAppearance): CSSProperties {
  const tokens: Record<string, string> = {
    colorScheme: appearance,
  };
  for (const [name, position] of SITE_STEPS) tokens[name] = step(theme, 1 - position);
  tokens["--color-primary-DEFAULT"] = tokens["--color-primary"];
  // The site's light mode swaps these too: `text-white` means the foreground.
  tokens["--color-white"] = theme.foreground;
  tokens["--color-black"] = theme.background;
  // The app's frame is its 900 step over a 950 content surface, either way round.
  tokens["--demo-content"] = tokens["--color-primary-950"];
  tokens["--demo-chrome"] = tokens["--color-primary-900"];
  tokens["--demo-chrome-translucent"] = tokens["--color-primary-900"];
  tokens["--demo-shadow"] = appearance === "light" ? "rgb(45 43 39 / 18%)" : "rgb(0 0 0 / 45%)";
  tokens["--color-accent"] = theme.accent;
  tokens["--color-accent-foreground"] = accentForeground(theme.accent, theme);
  Object.assign(tokens, glassTokens(theme, appearance));
  if (appearance === "light") Object.assign(tokens, LIGHT_HUES);
  return tokens as CSSProperties;
}
