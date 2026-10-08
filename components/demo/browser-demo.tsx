import { BrowserPanel, BrowserTabStrip, type BrowserPage } from "@/components/demo/browser-panel";
import { FloatingChat, FloatingChatComposer } from "@/components/demo/floating-chat";
import { ProjectSidebar, SIDEBAR_WIDTH } from "@/components/demo/project-sidebar";
import { ScaleToFit } from "@/components/demo/scale-to-fit";
import { OrbFlightSlot } from "@/components/orb-flight";
import {
  ArrowUp,
  Bash,
  Glob,
  MinimizeView,
  React as ReactFileIcon,
  Read,
  SidebarClose,
  SidebarOpen,
  Web,
} from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * The Mains window with its built-in browser expanded over the workspace,
 * previewing a site while a floating chat works on it — the browser use case,
 * drawn instead of filmed. Same chrome and rail as the hero's window.
 */

/** The hero orb in the 1440 × 886 capture: left, top and width, as shares of the page. */
const PAGE_ORB = { left: `${(475.19 / 1440) * 100}%`, top: `${(244 / 886) * 100}%`, width: `${(80 / 1440) * 100}%` };

const PAGE: BrowserPage = {
  light: "/demos/browser-mains-light.webp",
  dark: "/demos/browser-mains-dark.webp",
  alt: "The mains.dev home page open in Mains' built-in browser",
  width: 1600,
  height: 985,
};

/**
 * The developer home page, captured in its dark theme only — the site's
 * default. Its hero has no orb, so this page gets no orb stop.
 */
const DEV_PAGE: BrowserPage = {
  light: "/demos/browser-mains-dev.webp",
  dark: "/demos/browser-mains-dev.webp",
  alt: "The mains.dev developer home page open in Mains' built-in browser",
  width: 1600,
  height: 985,
};

function TitleBar() {
  return (
    <div className="flex shrink-0 items-end">
      <div className={cn("flex shrink-0 items-center gap-3 px-3 py-2.5", SIDEBAR_WIDTH)}>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <SidebarOpen className="size-3.5 text-primary-200" />
      </div>

      <div className="flex min-w-0 flex-1 items-end gap-2 pr-3">
        <BrowserTabStrip title="Mains — Open-Source Agent Workspace" favicon="/icons/favicon-96x96.png" />

        {/* The expanded browser's controls: restore the panel, the browser
            toggle (on), and the right panel. */}
        <div className="mb-2 ml-auto flex items-center gap-3 text-primary-500">
          <MinimizeView className="size-3.5" />
          <Web className="size-3.5 text-primary-100" filled />
          <SidebarClose className="size-3.5 rotate-180" />
        </div>
      </div>
    </div>
  );
}


/** A collapsed tool call: the verb, its object, and a chevron. */
function ToolRow({
  icon,
  verb,
  children,
  open = false,
}: {
  icon: React.ReactNode;
  verb: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center gap-1.5 text-[9px] text-primary-400">
      <span className="shrink-0 text-primary-400">{icon}</span>
      <span className="shrink-0 font-medium text-primary-200">{verb}</span>
      <span className="flex min-w-0 items-center gap-1 truncate">{children}</span>
      <ArrowUp className={cn("size-2.5 shrink-0", open ? "rotate-180" : "rotate-90")} />
    </div>
  );
}

function FileName({ path, lines }: { path: string; lines: number }) {
  return (
    <>
      <ReactFileIcon className="size-2.5 shrink-0 text-blue-400" />
      <span className="truncate">{path}</span>
      <span className="shrink-0">({lines} lines)</span>
    </>
  );
}

const HEADER_PREVIEW = `"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";`;

function Transcript() {
  return (
    <div className="flex flex-col gap-2.5 pb-2">
      <div className="ml-auto max-w-[85%] rounded-2xl bg-primary-900/50 px-2.5 py-1.5 text-[10px] text-primary-200">
        optimize images and videos on homepage
      </div>

      <p className="text-[10px] leading-4.5 text-primary-200">
        I&apos;ll check the homepage&apos;s images and videos, optimize the heaviest assets, and
        verify that the page still builds correctly.
      </p>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1 text-[9px] text-primary-400">
          Read files, looked for files, ran commands
          <ArrowUp className="size-2.5 rotate-180" />
        </div>
        <ToolRow icon={<Glob className="size-3" />} verb="Searched">
          <span>16 files</span>
          <code className="font-mono">**/*</code>
        </ToolRow>
        <ToolRow icon={<Glob className="size-3" />} verb="Searched">
          <span>42 files</span>
          <code className="font-mono">**/*</code>
        </ToolRow>
        <ToolRow icon={<Read className="size-3" />} verb="Read">
          <FileName path="app/(root)/home-client.tsx" lines={260} />
        </ToolRow>
        <ToolRow icon={<Bash className="size-3" />} verb="Ran">
          <span className="truncate">
            /bin/zsh -lc &quot;git status --short; cat CLAUDE.md; cat next.config.ts; cat package.json&quot;
          </span>
        </ToolRow>
        <ToolRow icon={<Read className="size-3" />} verb="Read" open>
          <FileName path="components/header.tsx" lines={1146} />
        </ToolRow>
        <pre className="overflow-hidden rounded-lg bg-primary-50/5 px-2.5 py-2 font-mono text-[8.5px] leading-3.5 text-primary-200">
          {HEADER_PREVIEW}
        </pre>
      </div>
    </div>
  );
}

const DESIGN_WIDTH = 1152;
const DESIGN_HEIGHT = 648;

/**
 * `page` picks the site the browser shows: the everyday page, whose hero orb
 * is a stop on the flying orb's route, or the developer home page.
 */
export function BrowserDemo({
  className,
  page = "everyday",
}: {
  className?: string;
  page?: "everyday" | "developer";
}) {
  const developer = page === "developer";
  return (
    <ScaleToFit
      designWidth={DESIGN_WIDTH}
      designHeight={DESIGN_HEIGHT}
      // Below `lg` the window is a picture: its controls are too small to hit.
      className={cn("pointer-events-none lg:pointer-events-auto", className)}
    >
      <div
        role="group"
        aria-label="Mains with its built-in browser expanded on mains.dev, and a chat optimizing the page's media floating over it"
        className="relative h-full w-full overflow-hidden bg-primary-950 text-left text-primary-200 select-none glass-outline"
      >
        <div className="relative flex h-full flex-col bg-(--demo-chrome-translucent) backdrop-blur-2xl">
          <TitleBar />
          <div className="flex min-h-0 flex-1">
            <ProjectSidebar />

            <BrowserPanel url="https://localhost:3000/" page={developer ? DEV_PAGE : PAGE} className="mr-1 mb-1 rounded-tl-none">
              {/* Where the hero orb sits in the page: the screenshot is taken
                  without it, so the flying orb stands in. Laid out on the
                  image's own box (it fills the page area by width, top first). */}
              {!developer && (
                <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 aspect-[1440/886]">
                  <div className="absolute aspect-square" style={PAGE_ORB}>
                    <OrbFlightSlot stop="case-browser" className="size-full" />
                  </div>
                </div>
              )}
              <FloatingChat title="Optimize Homepage Media" composer={<FloatingChatComposer />}>
                <Transcript />
              </FloatingChat>
            </BrowserPanel>
          </div>
        </div>
      </div>
    </ScaleToFit>
  );
}

/** The browser use case on the developer home page, previewing that page. */
export function DevBrowserDemo({ className }: { className?: string }) {
  return <BrowserDemo className={className} page="developer" />;
}
