# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jinzo landing page — a Next.js 16 marketing site for an AI coding agent desktop app. Dark-themed, animation-heavy, with an MDX-based blog.

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

**Sections architecture:** The home page is composed of section components in `components/sections/` (hero, use-cases, dashboard, integrations, review, changelog, cta). Each section is self-contained with its own animations.

**Demo components:** Interactive UI mockups in `components/demo/` (workspace-list, file-explorer, issues-list) used inside use-case cards to showcase the product.

## Key Conventions

- **Tailwind CSS v4** with `@theme` syntax in `styles/globals.css`. Custom color palette uses `primary-50` through `primary-950` (darkest: `#0c0c0c`). Use `bg-linear-to-*` (not `bg-gradient-to-*`) for gradients.
- **Path alias:** `@/*` maps to project root.
- **Animations:** Framer Motion for section/component animations. Custom CSS keyframe animations for blobs and scrolling marquees in globals.css.
- **Class merging:** Use `cn()` from `lib/utils.ts` (clsx + tailwind-merge).
- **Platform detection:** `usePlatformDetection` hook detects macOS vs Windows for OS-specific UI (keyboard shortcuts, download buttons).
- **TypeScript strict mode** is enabled.
- **React 19** with Next.js 16.
