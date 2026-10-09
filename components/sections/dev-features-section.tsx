"use client";

import Link from "next/link";
import { ComposerMentionDemo } from "@/components/demo/composer-mention-demo";
import { RunsDockDemo } from "@/components/demo/runs-dock-demo";
import { ArrowRight, ChevronRight } from "@/components/icons";
import { MAINS_DOCS_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * The developer page's feature grid, after zed.dev's "Just Works" section:
 * a header row, two features drawn live in the app's own UI, then three in
 * words with a link into the docs. Hairline borders divide the cells and meet the page's
 * blueprint rails at the column's edges.
 */

type DemoFeature = {
  title: string;
  description: string;
  Demo: React.ComponentType<{ className?: string }>;
};
type DocsFeature = { title: string; description: string; docsPath: string };

/** Drawn live rather than filmed, each a corner of the app at work. */
const DEMO_FEATURES: DemoFeature[] = [
  {
    title: "Parallel runs",
    description:
      "Run agents in several workspaces at once. Background runs wait in a dock, so you can check in or stop one without leaving your work.",
    Demo: RunsDockDemo,
  },
  {
    title: "Plugins and skills, by name",
    description:
      "Type @ to bring in files, plugins, and skills. Pick Code Review and the agent reviews your change with it.",
    Demo: ComposerMentionDemo,
  },
];

const DOCS_FEATURES: DocsFeature[] = [
  {
    title: "Fast text search",
    description:
      "Search file contents right in the file explorer, powered by @vscode/ripgrep. Find matching lines across your workspace with text or regex.",
    docsPath: "file-explorer",
  },
  {
    title: "Turn steer",
    description:
      "Send new instructions into a running turn without waiting for it to finish. Correct course as it works. Codex only for now. Claude coming soon.",
    docsPath: "runs",
  },
  {
    title: "Remote control",
    description:
      "Control Mains from your phone, a browser, or another computer. Follow runs and send instructions while agents keep working on your machine.",
    docsPath: "relay/overview",
  },
];

const LINE = "border-primary-50/8";
const CELL = "px-5 py-10 sm:px-8 lg:px-12";
const DESCRIPTION = "mt-2 max-w-md font-mono text-[13px] leading-relaxed text-primary-400";

function DemoCell({ feature: { title, description, Demo } }: { feature: DemoFeature }) {
  return (
    <div className={CELL}>
      <div className="rounded-lg border border-dashed border-primary-50/12 bg-primary-50/5 p-2">
        <div className="relative aspect-video overflow-hidden rounded-md bg-primary-950">
          <Demo className="absolute inset-0" />
        </div>
      </div>

      <h3 className="mt-5 text-lg tracking-tight text-primary-50">{title}</h3>
      <p className={DESCRIPTION}>{description}</p>
    </div>
  );
}

function DocsCell({ feature }: { feature: DocsFeature }) {
  return (
    <div className={CELL}>
      <h3 className="text-lg tracking-tight text-primary-50">{feature.title}</h3>
      <p className={DESCRIPTION}>{feature.description}</p>
      <Link
        href={`${MAINS_DOCS_URL}/${feature.docsPath}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-primary-300 transition-colors hover:text-primary-50"
      >
        docs.mains.dev/{feature.docsPath}
        <ArrowRight aria-hidden className="size-3" />
      </Link>
    </div>
  );
}

export function DevFeaturesSection() {
  return (
    <section aria-labelledby="dev-features-title">
      <div className={cn("flex flex-col gap-6 border-b lg:flex-row lg:items-end lg:justify-between", LINE, CELL)}>
        <div className="max-w-xl">
          <h2 id="dev-features-title" className="text-3xl tracking-tight text-primary-50 sm:text-4xl">
            Ready out of the box.
          </h2>
          <p className="mt-3 text-lg leading-snug text-primary-400">
            Everything a run needs is built in, and it keeps getting better, with a new
            release almost every week.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={MAINS_DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-primary-50 transition-colors glass-button"
          >
            Read the docs
            <ChevronRight aria-hidden className="size-3.5" />
          </Link>
        </div>
      </div>

      <div className={cn("grid divide-y border-b lg:grid-cols-2 lg:divide-x lg:divide-y-0", LINE, "divide-primary-50/8")}>
        {DEMO_FEATURES.map((feature) => (
          <DemoCell key={feature.title} feature={feature} />
        ))}
      </div>

      <div className="grid divide-y divide-primary-50/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {DOCS_FEATURES.map((feature) => (
          <DocsCell key={feature.title} feature={feature} />
        ))}
      </div>
    </section>
  );
}
