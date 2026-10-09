"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  BrowserCursor,
  ChevronRight,
  Document,
  Figma,
  Gallery,
  Github,
  Layers,
  Linear,
  Mains,
  Plus,
  ProjectFolder,
  Pr,
  Review,
  Slack,
} from "@/components/icons";
import { MAINS_DOCS_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * What agents can reach beyond the app, as a library after ChatGPT's plugin
 * directory: plugins, MCP servers and skills in tabs, each a two-column list
 * of icon, name and one line. The entries are the ones the docs name
 * (docs/plugins, docs/mcp-servers, docs/skills). Brand marks are drawn
 * monochrome, the way the app's navigation rail draws plugin logos.
 */

type IconComponent = React.FC<React.SVGProps<SVGSVGElement>>;
type Entry = { name: string; description: string; Icon: IconComponent; included?: boolean };
/** The line under a tab's list, saying the list is a sample: its lead is set brighter. */
type More = { lead: string; rest: string };
type Library = { id: string; label: string; docsPath: string; entries: Entry[]; more: More };

const LIBRARIES: Library[] = [
  {
    id: "plugins",
    label: "Plugins",
    docsPath: "plugins",
    entries: [
      { name: "GitHub", description: "Issues, pull requests, and repos", Icon: Github },
      { name: "Linear", description: "Issues and projects", Icon: Linear },
      { name: "Slack", description: "Channels and messages", Icon: Slack },
      { name: "Figma", description: "Bring designs into the chat", Icon: Figma },
      { name: "Computer Use", description: "Let Codex drive a virtual computer", Icon: BrowserCursor },
      { name: "Image Generation", description: "Create and edit images in a run", Icon: Gallery },
    ],
    more: { lead: "Hundreds more plugins", rest: " are a click away in the plugin directory." },
  },
  {
    id: "mcp",
    label: "MCP servers",
    docsPath: "mcp-servers",
    entries: [
      { name: "Mains tools", description: "Reviews, findings, and package checks", Icon: Mains, included: true },
      { name: "GitHub", description: "Issues, PRs, and repos", Icon: Github },
      { name: "Linear", description: "Issues and projects", Icon: Linear },
      { name: "Slack", description: "Channels and messages", Icon: Slack },
      { name: "Filesystem", description: "Local file access", Icon: ProjectFolder },
      { name: "Postgres", description: "Database queries", Icon: Layers },
    ],
    more: { lead: "Hundreds more MCP servers", rest: " connect the same way. If it speaks MCP, it works." },
  },
  {
    id: "skills",
    label: "Skills",
    docsPath: "skills",
    entries: [
      { name: "Code review", description: "Check a diff for security issues and best practices", Icon: Review },
      { name: "Address PR comments", description: "Work through a pull request's review comments", Icon: Pr },
      { name: "Image Gen", description: "Generate and edit images, picked with $", Icon: Gallery },
      { name: "Your own skill", description: "A SKILL.md your whole team shares through git", Icon: Document },
    ],
    more: { lead: "Hundreds more skills", rest: " from the community, ready to drop in alongside your own." },
  },
];

const PANEL_ID = "library-panel";

export function IntegrationsSection() {
  const [activeId, setActiveId] = useState(LIBRARIES[0].id);
  const prefersReducedMotion = useReducedMotion();
  const library = LIBRARIES.find(({ id }) => id === activeId) ?? LIBRARIES[0];

  return (
    <section aria-labelledby="library-title" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <h2 id="library-title" className="text-5xl leading-none tracking-tight text-primary-50 sm:text-6xl">
            Plugins, MCP, and skills.
          </h2>
          <p className="mt-6 text-xl leading-snug text-primary-400">
            Give your agents the tools your team already uses: install a plugin, connect an MCP
            server, or write a skill once and use it everywhere.
          </p>
        </div>
        <Link
          href={`${MAINS_DOCS_URL}/${library.docsPath}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 self-start rounded-full border border-primary-50/15 px-4 py-2 text-sm text-primary-50 transition-colors hover:bg-primary-50/5 sm:self-auto"
        >
          {library.label} in the docs
          <ChevronRight aria-hidden className="size-3.5" />
        </Link>
      </div>

      <LayoutGroup id="library-tabs">
        <div role="tablist" aria-label="Library" className="mt-10 flex flex-wrap gap-1">
          {LIBRARIES.map(({ id, label }) => {
            const active = id === activeId;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={PANEL_ID}
                onClick={() => setActiveId(id)}
                className="relative cursor-pointer rounded-full px-5 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                {active && (
                  <motion.span
                    layoutId="pill"
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-primary-50/8"
                    transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                <span className={cn("relative transition-colors", active ? "text-primary-50" : "text-primary-400 hover:text-primary-200")}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <div id={PANEL_ID} role="tabpanel" aria-label={library.label} className="mt-10">
        <ul className="grid gap-y-2 md:grid-cols-2 md:gap-x-16 lg:gap-x-28">
          {library.entries.map(({ name, description, Icon, included }) => (
            <li key={name} className="flex items-center gap-5 py-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary-50/10 bg-primary-900 text-primary-100">
                <Icon aria-hidden className="size-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-lg text-primary-50">{name}</span>
                <span className="mt-0.5 block truncate text-base text-primary-400">{description}</span>
              </span>
              {included ? (
                <span className="shrink-0 rounded-full border border-primary-50/10 px-2.5 py-0.5 text-xs text-primary-300">Included</span>
              ) : (
                <Plus aria-hidden className="size-5 shrink-0 text-primary-300" />
              )}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-lg text-pretty text-primary-400">
          <span className="text-primary-50">{library.more.lead}</span>
          {library.more.rest}
        </p>
      </div>
    </section>
  );
}
