"use client";

import { useMemo, useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  APP_THEME_PRESETS,
  appThemesFor,
  DEFAULT_APP_THEME_ID,
  themePalette,
  themeScopeStyle,
  type ThemeAppearance,
} from "@/lib/app-themes";
import { cn } from "@/lib/utils";

type Mode = "light" | "auto" | "dark";

const MODES: { value: Mode; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "auto", label: "Auto" },
  { value: "dark", label: "Dark" },
];

/** The swatches under the picker: the app onboarding's featured themes. */
const FEATURED = ["mains", "absolutely", "codex", "catppuccin", "flexoki", "rose-pine"];

/** Up and down chevrons, the app's select affordance. */
function SelectChevrons({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="M3.5 4.5 6 2l2.5 2.5M3.5 7.5 6 10l2.5-2.5" />
    </svg>
  );
}

/**
 * The developer page's theme section, after the app's onboarding theme step:
 * an appearance switch above the app window, and the color themes below it.
 * Picking one repaints the window — the app's own palettes and derivation
 * (`lib/app-themes.ts`), written as variables on the window's wrapper.
 *
 * One theme is kept across appearances, like picking a family in the app's
 * settings; one with nothing for the current appearance shows Mains there,
 * and comes back when the appearance does.
 */
export function DevThemesSection({ appWindow }: { appWindow: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("dark");
  const [themeId, setThemeId] = useState(DEFAULT_APP_THEME_ID);
  const systemDark = useMediaQuery("(prefers-color-scheme: dark)");
  const prefersReducedMotion = useReducedMotion();

  const appearance: ThemeAppearance = mode === "auto" ? (systemDark ? "dark" : "light") : mode;
  const presets = appThemesFor(appearance);
  const shownId = presets.some((preset) => preset.id === themeId) ? themeId : DEFAULT_APP_THEME_ID;
  const scope = useMemo(
    () => themeScopeStyle(themePalette(shownId, appearance), appearance),
    [shownId, appearance]
  );

  return (
    <section aria-labelledby="dev-themes-title" className="px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 id="dev-themes-title" className="text-5xl leading-none tracking-tight text-primary-50 sm:text-6xl">
          Make it yours.
        </h2>
        <p className="mt-6 text-xl leading-snug text-primary-400">
          Light, dark, or following your Mac, in one of {APP_THEME_PRESETS.length} color themes. Use
          one for every agent, or give each its own.
        </p>
      </div>

      <LayoutGroup id="dev-theme-mode">
        <div
          role="radiogroup"
          aria-label="Appearance"
          className="mx-auto mt-10 flex w-fit rounded-full border border-primary-50/10 bg-primary-900/40 p-1"
        >
          {MODES.map(({ value, label }) => {
            const active = value === mode;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setMode(value)}
                className="relative cursor-pointer rounded-full px-5 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                {active && (
                  <motion.span
                    layoutId="pill"
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-primary-950 shadow-[0_1px_4px_rgb(0_0_0/0.4)]"
                    transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                <span className={cn("relative transition-colors", active ? "text-primary-50" : "text-primary-400")}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      {/* The theme's variables are scoped to this wrapper, so only the window
          under them repaints. */}
      <div style={scope} className="mx-auto mt-8 max-w-5xl">
        <div className="overflow-hidden rounded-xl border border-primary-700/40 bg-primary-900 ">
          {appWindow}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-xl">
        <label className="flex items-center justify-between gap-4">
          <span className="text-lg text-primary-300">Color theme</span>
          <span className="relative">
            <select
              value={shownId}
              onChange={(event) => setThemeId(event.target.value)}
              className="w-52 cursor-pointer appearance-none rounded-xl border border-primary-50/10 bg-primary-900/40 py-2.5 pr-10 pl-4 text-primary-50 transition-colors hover:bg-primary-900/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              {presets.map((preset) => (
                <option key={preset.id} value={preset.id} className="bg-primary-950 text-primary-50">
                  {preset.name}
                </option>
              ))}
            </select>
            <SelectChevrons className="pointer-events-none absolute top-1/2 right-3.5 size-3.5 -translate-y-1/2 text-primary-300" />
          </span>
        </label>

        <fieldset className="mt-8 flex flex-wrap justify-center gap-4">
          <legend className="sr-only">Featured color themes</legend>
          {presets
            .filter((preset) => FEATURED.includes(preset.id))
            .map((preset) => {
              const { background, accent } = themePalette(preset.id, appearance);
              const checked = preset.id === shownId;
              return (
                <label key={preset.id} title={preset.name} className="cursor-pointer rounded-full has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-primary-500">
                  <input
                    type="radio"
                    name="dev-theme-swatch"
                    aria-label={preset.name}
                    checked={checked}
                    onChange={() => setThemeId(preset.id)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "block size-11 rounded-full ring-1 ring-primary-50/15 ring-inset transition-[outline-color,transform] duration-200 hover:scale-105",
                      checked ? "outline-2 outline-offset-3" : "outline-2 outline-offset-3 outline-transparent"
                    )}
                    style={{
                      background: `linear-gradient(135deg, ${background} 48%, ${accent} 52%)`,
                      ...(checked ? { outlineColor: accent } : {}),
                    }}
                  />
                </label>
              );
            })}
        </fieldset>

        <p className="mt-6 text-center text-sm text-primary-500">
          {mode === "auto" ? "Auto follows your Mac’s appearance." : "A look that feels like you."}
        </p>
      </div>
    </section>
  );
}
