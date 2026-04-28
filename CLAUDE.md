# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mains landing page — a Next.js 16 marketing site for an AI coding agent desktop app. Dark-themed, animation-heavy, with an MDX-based blog.

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build (uses Turbopack)
- `npm run lint` — run ESLint
- `npm start` — serve production build

## Architecture

**Next.js 16 App Router** with a `(root)` route group. All pages live under `app/(root)/`.

**Server/Client split pattern:** Page entry points are server components that fetch data (e.g. `getAllPosts()`), then pass it to `"use client"` wrappers for interactivity. Examples:
- `app/(root)/page.tsx` (server) → `home-client.tsx` (client)
- `app/(root)/blog/page.tsx` (server) → `blog-page-client.tsx` (client)

**Blog/Content system:** File-based MDX in `content/` directory. `lib/posts.ts` reads files with `gray-matter` for frontmatter and `next-mdx-remote/rsc` renders them server-side. Blog posts use `generateStaticParams` for static generation. The `Post` type is in `lib/types.ts` (separate from `lib/posts.ts` to avoid pulling `fs` into client bundles).

**Sections architecture:** The home page is composed of section components in `components/sections/` (hero, use-cases, dashboard, integrations, review, changelog, cta, status). Each section is self-contained with its own animations.

**Demo components:** Interactive UI mockups in `components/demo/` (workspace-list, file-explorer, issues-list, dashboard-stats, diff-viewer) used inside section components to showcase the product.

## Reusable Components

- **`WindowChrome`** (`components/window-chrome.tsx`) — macOS-style window frame with traffic light dots. Use for any desktop app mockup UI.
- **`SectionHeader`** (`components/section-header.tsx`) — Title + description header with `row` or `column` layout. Use in all landing page sections.
- **`FormInput` / `FormTextarea`** (`components/form-input.tsx`) — Styled form inputs with label, consistent with the dark theme. Use in any form.
- **`FilterPill`** (`components/filter-pill.tsx`) — Toggle pill button (active: white, inactive: primary-800). Use for filter/tab UIs.
- **`PostMeta`** (`components/post-meta.tsx`) — Displays author + formatted date. Use in blog list and detail pages.

## Hooks

- **`usePlatformDetection`** (`hooks/usePlatformDetection.ts`) — Detects macOS vs Windows for OS-specific UI (keyboard shortcuts, download buttons).
- **`useBrowserDetection`** (`hooks/useBrowserDetection.ts`) — Browser detection.
- **`useInView`** (`hooks/useInView.ts`) — Intersection Observer hook, returns `{ ref, visible }`. Triggers once when element enters viewport. Use for scroll-triggered animations.

## Key Conventions

- **Tailwind CSS v4** with `@theme` syntax in `styles/globals.css`. Custom color palette uses `primary-50` through `primary-950` (darkest: `#0c0c0c`). Use `bg-linear-to-*` (not `bg-gradient-to-*`) for gradients.
- **Path alias:** `@/*` maps to project root.
- **Animations:** Use presets from `lib/animations.ts` (`FADE_IN_UP`, `FADE_IN_BLUR`, `FADE_IN_BLUR_UP` and their `_DELAY` variants) instead of writing inline Framer Motion props. Custom CSS keyframe animations for blobs and scrolling marquees in `styles/globals.css`.
- **Icons:** All icons live in `components/icons/` as individual files and are barrel-exported from `components/icons/index.tsx`. Add new icons as separate files and register them in the barrel export.
- **Class merging:** Use `cn()` from `lib/utils.ts` (clsx + tailwind-merge).
- **Constants:** Shared data (integrations, use cases) lives in `lib/constants.ts`.
- **TypeScript strict mode** is enabled.
- **React 19** with Next.js 16.
