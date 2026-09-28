"use client";

import { useEffect, useId, useMemo, useState, type ReactNode, type RefObject } from "react";
import { useRouter } from "next/navigation";
import { HeroDialog } from "@/components/hero-dialog";
import {
  Clock,
  CodeBrackets,
  Description,
  Document,
  DownloadLine,
  Enter,
  Github,
  Mains,
  Question,
  Search,
  Shield,
  Sparkles,
} from "@/components/icons";
import {
  MAINS_DOCS_URL,
  MAINS_DOWNLOAD_DMG_URL,
  MAINS_GITHUB_REPO_URL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

/** A changelog post as the menu lists it; built on the server from `content/`. */
export type CommandMenuRelease = {
  version: string;
  /** The post title without its "Mains 0.x:" prefix. */
  title: string;
  description: string;
  /** Preformatted on the server, e.g. "Sep 27". */
  dateLabel: string;
  url: string;
};

type IconTone = "neutral" | "blue" | "rose" | "amber";

type MenuItem = {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  /** Extra words the filter matches on, never shown. */
  keywords?: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  tone?: IconTone;
} & (
  | { href: string; external?: boolean }
  | { run: () => void }
);

type MenuGroup = { heading: string; items: MenuItem[] };

/** The app's icon tones. The glyph stays light on the colored tiles in both themes. */
const TONE_CLASSES: Record<IconTone, string> = {
  neutral: "bg-primary-800 text-primary-50",
  blue: "bg-sky-600 text-[#fffcf0]",
  rose: "bg-rose-500 text-[#fffcf0]",
  amber: "bg-amber-500 text-[#fffcf0]",
};

/** Releases shown before anything is typed; a query searches all of them. */
const IDLE_RELEASE_COUNT = 4;

const PAGES: MenuItem[] = [
  { id: "changelog", title: "Changelog", subtitle: "Every release, newest first", href: "/blog", icon: Clock, keywords: "blog releases news updates" },
  { id: "docs", title: "Docs", subtitle: "Guides for the Mac app, Relay and iPhone", meta: "docs.mains.dev", href: MAINS_DOCS_URL, external: true, icon: Document, keywords: "documentation help setup guide" },
  { id: "support", title: "Support", subtitle: "Questions, bugs and feedback", href: "/support", icon: Question, keywords: "help contact faq email" },
  { id: "privacy", title: "Privacy Policy", href: "/privacy", icon: Shield, keywords: "data legal" },
  { id: "terms", title: "Terms of Service", href: "/terms", icon: Description, keywords: "legal" },
  { id: "license", title: "License", href: "/license", icon: CodeBrackets, keywords: "legal open source" },
];

function commandGroups(): MenuGroup[] {
  return [
    {
      heading: "Quick Actions",
      items: [
        { id: "download", title: "Download for macOS", href: MAINS_DOWNLOAD_DMG_URL, icon: DownloadLine, tone: "amber", keywords: "install dmg mac app" },
        { id: "github", title: "View source on GitHub", meta: "mainsdotdev/mains", href: MAINS_GITHUB_REPO_URL, external: true, icon: Github, keywords: "code repository open source issues" },
      ],
    },
  ];
}

function matches(item: MenuItem, query: string) {
  const haystack = `${item.title} ${item.subtitle ?? ""} ${item.keywords ?? ""}`.toLowerCase();
  return query.toLowerCase().split(/\s+/).every((term) => haystack.includes(term));
}

function Keycap({ children }: { children: ReactNode }) {
  return (
    <kbd className="flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 font-sans text-[10px] font-medium text-primary-200 glass-button">
      {children}
    </kbd>
  );
}

/**
 * The hero Search card's demo: the app's command menu — a glass search field
 * over a glass list of grouped rows — pointed at this site's releases and pages.
 * Arrow keys move, Enter opens, Escape closes; typing narrows every group.
 */
export function HeroCommandMenu({
  releases,
  onClose,
  triggerRef,
}: {
  releases: CommandMenuRelease[];
  onClose: () => void;
  triggerRef?: RefObject<HTMLElement | null>;
}) {
  return (
    <HeroDialog
      aria-label="Search mains.dev"
      onClose={onClose}
      triggerRef={triggerRef}
      className="hero-dialog-glass mx-auto mt-[12vh] mb-auto w-[min(44rem,calc(100vw-2rem))] max-w-none overflow-visible border-0 bg-transparent p-0 text-primary-50 backdrop:bg-primary-950/60 backdrop:backdrop-blur-[2px]"
    >
      {(requestClose) => <MenuBody releases={releases} requestClose={requestClose} />}
    </HeroDialog>
  );
}

function MenuBody({
  releases,
  requestClose,
}: {
  releases: CommandMenuRelease[];
  requestClose: () => void;
}) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const groups = useMemo(() => {
    const trimmed = query.trim();
    const releaseItems: MenuItem[] = releases.map((release) => ({
      id: `release-${release.version}`,
      title: `Mains ${release.version}`,
      subtitle: release.title,
      meta: release.dateLabel,
      keywords: `changelog release ${release.description}`,
      href: release.url,
      icon: Sparkles,
      tone: "blue",
    }));
    const all: MenuGroup[] = [
      { heading: "Releases", items: trimmed ? releaseItems : releaseItems.slice(0, IDLE_RELEASE_COUNT) },
      { heading: "Pages", items: PAGES },
      ...commandGroups(),
    ];
    return all
      .map((group) => ({ ...group, items: trimmed ? group.items.filter((item) => matches(item, trimmed)) : group.items }))
      .filter((group) => group.items.length > 0);
  }, [query, releases]);

  const flat = groups.flatMap((group) => group.items);
  // Where each group's rows start in `flat`, which arrow keys move through.
  const groupOffsets = groups.map((_, groupIndex) =>
    groups.slice(0, groupIndex).reduce((count, group) => count + group.items.length, 0),
  );
  const activeIndex = Math.min(active, Math.max(flat.length - 1, 0));
  const optionId = (index: number) => `${listId}-option-${index}`;

  useEffect(() => {
    document.getElementById(`${listId}-option-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [listId, activeIndex]);

  const select = (item: MenuItem) => {
    requestClose();
    if ("run" in item) item.run();
    else if (item.external) window.open(item.href, "_blank", "noopener,noreferrer");
    else if (item.href.startsWith("/")) router.push(item.href);
    // A file download: the page stays where it is.
    else window.location.assign(item.href);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-14 shrink-0 items-center gap-3 rounded-3xl px-4 backdrop-blur-2xl backdrop-saturate-125 glass-command">
        <Mains aria-hidden className="h-5 w-auto shrink-0 text-primary-400" />
        <input
          autoFocus
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={flat.length > 0 ? optionId(activeIndex) : undefined}
          aria-label="Search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              if (flat.length === 0) return;
              const step = event.key === "ArrowDown" ? 1 : -1;
              setActive((activeIndex + step + flat.length) % flat.length);
            } else if (event.key === "Enter" && flat[activeIndex]) {
              event.preventDefault();
              select(flat[activeIndex]);
            }
          }}
          placeholder="Search releases, pages, and actions…"
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-primary-50 outline-none placeholder:text-primary-500"
        />
        <Keycap>esc</Keycap>
      </div>

      <div className="overflow-hidden rounded-4xl backdrop-blur-2xl backdrop-saturate-125 glass-command">
        <div
          id={listId}
          role="listbox"
          aria-label="Results"
          className="noscrollbar max-h-[min(31rem,62vh)] min-h-24 overflow-y-auto overscroll-contain py-1.5"
        >
          {flat.length === 0 && (
            <div className="flex min-h-32 flex-col items-center justify-center px-8 text-center">
              <Search className="mb-3 size-5 text-primary-400" />
              <p className="text-[13px] font-medium text-primary-200">Nothing found</p>
              <p className="mt-1 text-xs text-primary-500">Try a release number, a page, or “download”.</p>
            </div>
          )}

          {groups.map((group, groupIndex) => (
            <div key={group.heading} role="group" aria-labelledby={`${listId}-${group.heading}`} className="pb-1.5">
              <div id={`${listId}-${group.heading}`} className="px-4 pt-2.5 pb-1 text-[11px] font-medium text-primary-500">
                {group.heading}
              </div>
              <div className="space-y-1">
                {group.items.map((item, itemInGroup) => {
                  const itemIndex = groupOffsets[groupIndex] + itemInGroup;
                  const selected = itemIndex === activeIndex;
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      id={optionId(itemIndex)}
                      role="option"
                      aria-selected={selected}
                      onPointerMove={() => {
                        if (!selected) setActive(itemIndex);
                      }}
                      onClick={() => select(item)}
                      className={cn(
                        "mx-1.5 flex min-h-9 cursor-default items-center gap-3 rounded-xl px-2.5 py-1 text-primary-100 select-none",
                        selected && "bg-primary/5",
                      )}
                    >
                      <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-lg", TONE_CLASSES[item.tone ?? "neutral"])}>
                        <Icon aria-hidden className="size-3.5" />
                      </span>
                      <span className="flex min-w-0 flex-1 items-baseline gap-2">
                        <span className="truncate text-[13px] font-medium tracking-[-0.01em]">{item.title}</span>
                        {item.subtitle && (
                          <span className="truncate text-xs text-primary-400">{item.subtitle}</span>
                        )}
                      </span>
                      {item.meta && (
                        <span className="max-w-28 shrink-0 truncate text-[11px] text-primary-500">{item.meta}</span>
                      )}
                      <Enter aria-hidden className={cn("size-3.5 shrink-0 text-primary-400", !selected && "invisible")} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
