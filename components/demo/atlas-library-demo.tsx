"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  ATLAS_LIBRARY_ITEMS,
  ATLAS_RECENTS,
  type AtlasLibraryItem,
} from "./atlas-library-data";
import { ATLAS_TEMPLATES } from "./atlas-templates-data";
import { MarkdownMessage } from "./markdown-message";
import { NavigationRail, type IconComponent } from "./navigation-rail";
import { ScaleToFit } from "./scale-to-fit";
import { WindowFrame, WORK_PROJECTS } from "./work-window";
import { WindowTab } from "./window-tab";
import {
  ChevronDown,
  ChevronLeft,
  Codex,
  Dna,
  Document,
  Edit,
  Ellipsis,
  Filter,
  Globe,
  Grid,
  Library,
  Lightbulb,
  List,
  Page,
  Passport,
  Picture,
  Plan,
  Plus,
  Rocket,
  Search,
  Star,
  Trash,
} from "@/components/icons";
import { cn } from "@/lib/utils";

const TYPES = [
  { label: "All", value: "all", Icon: Library },
  { label: "Pages", value: "page", Icon: Page },
  { label: "Docs", value: "doc", Icon: Passport },
  { label: "Images", value: "image", Icon: Picture },
] as const;
const SCOPES = [
  "All",
  "Uploads",
  "Favorites",
  "Saved to Atlas",
  "Generated",
] as const;
type Scope = (typeof SCOPES)[number];
type Kind = (typeof TYPES)[number]["value"];
const TEMPLATE_ICONS = [Document, Dna, Plan, Rocket, Lightbulb];
const TEMPLATE_TINTS = [
  "text-blue-400",
  "text-emerald-400",
  "text-violet-400",
  "text-orange-400",
  "text-red-400",
];
const ROW =
  "flex w-full items-center gap-2 rounded-lg px-1.5 py-1.5 text-left text-[10px] text-primary-200";
const BUTTON =
  "cursor-pointer focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-blue-400";

function minutesAgo(time: string) {
  return time === "Just now"
    ? 0
    : Number.parseInt(time) * (time.includes("h") ? 60 : 1);
}

function ItemMark({
  item,
  thumbnail = false,
}: {
  item: AtlasLibraryItem;
  thumbnail?: boolean;
}) {
  return item.image && thumbnail ? (
    <span className="relative size-5 shrink-0 overflow-hidden rounded-md">
      <Image
        src={item.image}
        alt=""
        fill
        unoptimized
        className="object-cover"
      />
    </span>
  ) : (
    <item.Icon className="size-3 shrink-0" />
  );
}

function TemplateCard({
  title,
  Icon,
  tint,
  onClick,
}: {
  title: string;
  Icon: IconComponent;
  tint?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "glass-card flex h-16 min-w-0 flex-col items-start justify-center gap-2.5 rounded-2xl px-3 text-left hover:[--glass-tint:var(--glass-hover-button)]",
        BUTTON,
      )}
    >
      <Icon className={cn("size-3.5", tint)} />
      <span className="whitespace-nowrap text-[9px] text-primary-300">
        {title}
      </span>
    </button>
  );
}

export function AtlasLibraryDemo({ className }: { className?: string }) {
  const [items, setItems] = useState(ATLAS_LIBRARY_ITEMS);
  const [view, setView] = useState<"list" | "grid">("list");
  const [kind, setKind] = useState<Kind>("all");
  const [scope, setScope] = useState<Scope>("All");
  const [project, setProject] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [oldestFirst, setOldestFirst] = useState(false);
  const [draft, setDraft] = useState<AtlasLibraryItem | null>(null);
  const [markdownMode, setMarkdownMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const nextId = useRef(0);

  const open = (item: AtlasLibraryItem) => {
    setDraft({ ...item });
    setMarkdownMode(false);
    setSaved(false);
  };
  const create = (
    title = "Untitled page",
    markdown = "",
    Icon: IconComponent = Page,
  ) =>
    open({
      id: "",
      title,
      markdown,
      Icon,
      kind: "page",
      project: "Work Stuff",
      origin: "saved",
      favorite: false,
      time: "Just now",
    });
  const selectKind = (value: Kind) => {
    setKind(value);
    setProject(null);
    setScope("All");
    setDraft(null);
    setQuery("");
  };
  const toggleFavorite = (id: string) =>
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item,
      ),
    );
  const save = () => {
    if (!draft) return;
    nextId.current += 1;
    const item = {
      ...draft,
      id: draft.id || `atlas-demo-${nextId.current}`,
      title: draft.title.trim() || "Untitled page",
      time: "Just now",
    };
    setItems((current) =>
      current.some((entry) => entry.id === item.id)
        ? current.map((entry) => (entry.id === item.id ? item : entry))
        : [item, ...current],
    );
    setDraft(null);
    setQuery("");
    setKind("all");
    setScope("All");
    setProject(null);
    setSaved(true);
  };
  const visible = items
    .filter((item) => {
      const text = `${item.title} ${item.markdown}`.toLowerCase();
      return (
        (kind === "all" || item.kind === kind) &&
        (!project || item.project === project) &&
        query
          .toLowerCase()
          .trim()
          .split(/\s+/)
          .every((term) => text.includes(term)) &&
        (scope !== "Favorites" || item.favorite) &&
        (scope !== "Uploads" || item.origin === "upload") &&
        (scope !== "Generated" || item.origin === "generated") &&
        (scope !== "Saved to Atlas" || item.origin === "saved")
      );
    })
    .sort(
      (a, b) =>
        (minutesAgo(a.time) - minutesAgo(b.time)) * (oldestFirst ? -1 : 1),
    );
  const recents = ATLAS_RECENTS.map(
    (id) => items.find((item) => item.id === id)!,
  );
  const tabItems = [...recents].reverse();
  const title = project ?? TYPES.find((type) => type.value === kind)!.label;

  const favoriteButton = (item: AtlasLibraryItem) => (
    <button
      type="button"
      aria-label={`${item.favorite ? "Remove" : "Add"} ${item.title} ${item.favorite ? "from" : "to"} favorites`}
      aria-pressed={item.favorite}
      onClick={() => toggleFavorite(item.id)}
      className={cn(
        "shrink-0 rounded p-1 text-primary-500 hover:text-primary-200",
        BUTTON,
      )}
    >
      <Star filled={item.favorite} className="size-2.5" />
    </button>
  );

  const sidebar = (
    <div className="flex min-w-0 flex-1 flex-col pr-2 pb-2 pl-1">
      <div className="px-1.5 pb-2 text-xs font-medium text-primary-50">
        Atlas
      </div>
      <button
        type="button"
        onClick={() => create()}
        className={cn(ROW, BUTTON, "mb-2 hover:bg-primary-50/5")}
      >
        <Edit className="size-3" />
        New page
      </button>
      {TYPES.map(({ label, value, Icon }) => (
        <button
          key={value}
          type="button"
          aria-pressed={!draft && !project && value === kind}
          onClick={() => selectKind(value)}
          className={cn(
            ROW,
            BUTTON,
            !draft && !project && value === kind
              ? "glass-outline bg-primary-50/5"
              : "hover:bg-primary-50/5",
          )}
        >
          <Icon className="size-3" />
          {label}
        </button>
      ))}
      <p className="mt-4 px-1.5 py-1.5 text-[9px] text-primary-400">Recents</p>
      {recents.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => open(item)}
          className={cn(
            ROW,
            BUTTON,
            draft?.id === item.id
              ? "glass-outline bg-primary-50/5"
              : "hover:bg-primary-50/5",
          )}
        >
          <ItemMark item={item} />
          <span className="truncate">{item.title}</span>
        </button>
      ))}
      <p className="mt-4 px-1.5 py-1.5 text-[9px] text-primary-500">Projects</p>
      {WORK_PROJECTS.map(({ name, Icon, tint }) => (
        <button
          key={name}
          type="button"
          onClick={() => {
            setProject(name);
            setDraft(null);
            setKind("all");
            setScope("All");
            setQuery("");
          }}
          className={cn(
            ROW,
            BUTTON,
            "hover:bg-primary-50/5",
            project === name && "glass-outline bg-primary-50/5",
          )}
        >
          <Icon className={cn("size-3", tint)} />
          <span className="truncate">{name}</span>
        </button>
      ))}
      <div className={cn(ROW, "mt-auto pt-4")}>
        <Trash className="size-3" />
        Trash
      </div>
    </div>
  );

  return (
    <div
      role="group"
      aria-label="Atlas library with list and grid views"
      className={className}
    >
      <ScaleToFit designWidth={1152} designHeight={648}>
        <WindowFrame
          tabs={
            <>
              <div className="flex min-w-0 items-end gap-1">
                {tabItems.map((item, index) => (
                  <WindowTab
                    key={item.id}
                    icon={<ItemMark item={item} />}
                    title={item.title}
                    active={draft?.id === item.id}
                    showLeftFlare={index > 0}
                    onClick={() => open(item)}
                    className={cn("w-36", BUTTON)}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="New Atlas page tab"
                onClick={() => create()}
                className={cn("mb-2 rounded text-primary-500", BUTTON)}
              >
                <Plus className="size-3.5" />
              </button>
            </>
          }
          titleBarEnd={<Globe className="size-3.5" />}
          rail={
            <NavigationRail
              activeLabel="Atlas"
              showSpaces
              showPinnedApps={false}
            />
          }
          sidebar={sidebar}
          contentClassName={draft?.id === tabItems[0]?.id ? undefined : "rounded-tl-xl"}
        >
          {draft ? (
            <div className="flex min-h-0 flex-1 flex-col">

              <div className="min-h-0 flex-1 overflow-y-auto px-16 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {draft.image ? (
                  <div className="relative h-full">
                    <Image
                      src={draft.image}
                      alt={draft.title}
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <>
                    <draft.Icon className="mb-4 size-7 text-primary-300" />
                    {draft.kind === "page" ? (
                      <input
                        aria-label="Atlas page title"
                        value={draft.title}
                        onChange={(event) =>
                          setDraft({ ...draft, title: event.target.value })
                        }
                        className="mb-6 w-full bg-transparent text-[24px] font-semibold tracking-tight text-primary-50 outline-none"
                      />
                    ) : (
                      <h3 className="mb-6 text-[24px] font-semibold text-primary-50">
                        {draft.title}
                      </h3>
                    )}
                    {markdownMode && draft.kind === "page" ? (
                      <textarea
                        aria-label="Edit page Markdown"
                        value={draft.markdown}
                        placeholder="Start writing with Markdown…"
                        onChange={(event) =>
                          setDraft({ ...draft, markdown: event.target.value })
                        }
                        className="h-88 w-full resize-none bg-transparent font-mono text-[10px] leading-5 text-primary-200 outline-none placeholder:text-primary-500"
                      />
                    ) : draft.markdown ? (
                      <MarkdownMessage source={draft.markdown} />
                    ) : (
                      <p className="text-[10px] text-primary-500">
                        Switch to Markdown to start writing.
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-y-auto px-11 pt-8 pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex items-center gap-2">
                <h3 className="mr-auto text-[14px] font-medium text-primary-100">
                  {title}
                </h3>
                {saved && (
                  <span
                    role="status"
                    className="mr-2 text-[9px] text-green-500"
                  >
                    Saved to Atlas
                  </span>
                )}
                <div className="flex gap-0.5" aria-label="Library view">
                  {[
                    { value: "grid", Icon: Grid },
                    { value: "list", Icon: List },
                  ].map(({ value, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      aria-label={`Show ${value} view`}
                      aria-pressed={view === value}
                      onClick={() => setView(value as "grid" | "list")}
                      className={cn(
                        "flex size-6 items-center justify-center rounded-lg text-primary-500 hover:text-primary-200",
                        BUTTON,
                        view === value && "bg-primary-50/5 text-primary-200",
                      )}
                    >
                      <Icon className="size-3" />
                    </button>
                  ))}
                </div>
                <div className="glass-outline relative ml-1 rounded-full">
                  <Search className="pointer-events-none absolute top-1/2 left-2 size-2.5 -translate-y-1/2 text-primary-500" />
                  <input
                    aria-label="Search Atlas library"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") setQuery("");
                    }}
                    placeholder="Search"
                    className="h-6 w-36 rounded-full bg-transparent pr-2 pl-6 text-[9px] text-primary-200 outline-none placeholder:text-primary-500 focus-visible:ring-1 focus-visible:ring-blue-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => create()}
                  className={cn(
                    "glass-button flex h-6 items-center gap-1 rounded-lg px-2.5 text-[9px]",
                    BUTTON,
                  )}
                >
                  New
                  <ChevronDown className="size-2.5" />
                </button>
              </div>

              <div
                className="mt-4 flex items-center gap-1"
                aria-label="Library filters"
              >
                {SCOPES.map((label) => (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={scope === label}
                    onClick={() => setScope(label)}
                    className={cn(
                      "rounded-full px-2 py-1 text-[9px]",
                      BUTTON,
                      scope === label
                        ? "glass-card text-primary-200"
                        : "text-primary-500 hover:text-primary-200",
                    )}
                  >
                    {label}
                  </button>
                ))}
                <button
                  type="button"
                  aria-label={
                    oldestFirst ? "Sort newest first" : "Sort oldest first"
                  }
                  aria-pressed={oldestFirst}
                  onClick={() => setOldestFirst((value) => !value)}
                  className={cn(
                    "ml-auto rounded p-1 text-primary-500 hover:text-primary-200",
                    BUTTON,
                  )}
                >
                  <Filter
                    className={cn("size-3", oldestFirst && "rotate-0")}
                  />
                </button>
              </div>

              {(kind === "all" || kind === "page") && (
                <div className="mt-6">
                  <h4 className="mb-2.5 text-[10px] text-primary-200">
                    Start a page
                  </h4>
                  <div className="grid grid-cols-6 gap-2">
                    <TemplateCard
                      title="Create page with Codex"
                      Icon={Codex}
                      onClick={() =>
                        document
                          .getElementById("atlas-authoring")
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          })
                      }
                    />
                    {ATLAS_TEMPLATES.map((template, index) => (
                      <TemplateCard
                        key={template.title}
                        title={template.title}
                        Icon={TEMPLATE_ICONS[index]}
                        tint={TEMPLATE_TINTS[index]}
                        onClick={() =>
                          create(
                            template.title,
                            template.markdown,
                            TEMPLATE_ICONS[index],
                          )
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {visible.length === 0 ? (
                <p className="mt-12 text-center text-[11px] text-primary-500">
                  {query ? `Nothing matches “${query}”.` : "Nothing here yet."}
                </p>
              ) : view === "list" ? (
                <table
                  aria-label="Atlas library items"
                  className="mt-7 w-full table-fixed border-collapse text-left text-[9px]"
                >
                  <thead className="text-primary-500">
                    <tr className="h-8 border-b border-primary-800/15">
                      <th className="w-[55%] pl-2 font-normal">Name</th>
                      <th className="w-[24%] font-normal">Source</th>
                      <th className="font-normal">Last activity</th>
                      <th className="w-5">
                        <span className="sr-only">More</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((item) => (
                      <tr
                        key={item.id}
                        className="h-8.5 border-b border-primary-800/15"
                      >
                        <td className="pl-2">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => open(item)}
                              className={cn(
                                "flex min-w-0 items-center gap-2 rounded text-primary-300 hover:text-primary-100",
                                BUTTON,
                              )}
                            >
                              <span className="flex size-5 shrink-0 items-center justify-center rounded-md text-primary-300">
                                <ItemMark item={item} thumbnail />
                              </span>
                              <span className="truncate">{item.title}</span>
                            </button>
                            {favoriteButton(item)}
                          </div>
                        </td>
                        <td className="text-primary-500">
                          {item.origin === "generated" ? "Conversation" : "—"}
                        </td>
                        <td className="text-primary-500">{item.time}</td>
                        <td>
                          <Ellipsis
                            aria-hidden
                            className="size-3 text-primary-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div
                  aria-label="Atlas grid items"
                  className="mt-8 columns-4 gap-3 space-y-3"
                >
                  {visible.map((item) =>
                    item.image ? (
                      <button
                        key={item.id}
                        type="button"
                        aria-label={`Open ${item.title}`}
                        onClick={() => open(item)}
                        className={cn(
                          "relative block w-full break-inside-avoid overflow-hidden rounded-2xl bg-primary-900",
                          item.aspect,
                          BUTTON,
                        )}
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </button>
                    ) : (
                      <div
                        key={item.id}
                        className="glass-card break-inside-avoid overflow-hidden rounded-2xl"
                      >
                        <div className="flex h-8.5 items-center gap-1 bg-primary-50/2 px-2.5">
                          <button
                            type="button"
                            onClick={() => open(item)}
                            className={cn(
                              "flex min-w-0 flex-1 items-center gap-1.5 rounded text-[9px] text-primary-200",
                              BUTTON,
                            )}
                          >
                            <ItemMark item={item} />
                            <span className="truncate">{item.title}</span>
                          </button>
                          {favoriteButton(item)}
                        </div>
                        <div
                          className={cn(
                            "overflow-hidden px-3 pt-1 pb-2",
                            item.id === "launch" ? "max-h-52" : "max-h-44",
                          )}
                        >
                          <MarkdownMessage source={item.markdown} />
                        </div>
                        <p className="border-t border-primary-800/20 px-3 py-1 text-[8px] text-primary-500">
                          {item.time}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          )}
        </WindowFrame>
      </ScaleToFit>
    </div>
  );
}
