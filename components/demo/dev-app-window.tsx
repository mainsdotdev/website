import { DiffStat } from "@/components/demo/diff-stat";
import { FullAccessChat } from "@/components/demo/full-access-chat";
import { NavigationRail, type IconComponent } from "@/components/demo/navigation-rail";
import { ScaleToFit } from "@/components/demo/scale-to-fit";
import { PrFlowColumn, PrFlowDialog, PrFlowProvider, SessionPanelToggle } from "@/components/demo/pr-flow";
import { SessionPanel } from "@/components/demo/session-panel";
import { WindowTab } from "@/components/demo/window-tab";
import {
  ArrowUp,
  Codex,
  Document,
  Home,
  Layers,
  MainsStroke,
  Menu,
  Plus,
  Project,
  SidebarClose,
  TerminalPanel,
  Web,
  World,
} from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * The developer page's replica of the Mains window: a Codex chat in the Mains
 * repo's `feat/atlas` workspace, its earlier work folded away. Drawn like the
 * hero's `AppWindow`, without that window's tab switching and floating panels.
 */

/** Rail plus panel. The title bar's window-controls segment matches it. */
const SIDEBAR_WIDTH = "w-52";

type Workspace = {
  branch: string;
  diff?: { additions: number; deletions: number };
  active?: boolean;
};

const PROJECTS: { name: string; icon: IconComponent; tint: string; workspaces: Workspace[] }[] = [
  {
    name: "mains",
    icon: MainsStroke,
    // The theme's accent, as in the app; blue where no theme sets one.
    tint: "text-(--color-accent,var(--color-blue-400))",
    workspaces: [{ branch: "feat/atlas", diff: { additions: 228, deletions: 7 }, active: true }],
  },
  {
    name: "website",
    icon: World,
    tint: "text-orange-500",
    workspaces: [
      { branch: "main", diff: { additions: 37, deletions: 122 } },
      { branch: "pear-qmv0", diff: { additions: 83, deletions: 51 } },
    ],
  },
  {
    name: "docs",
    icon: Document,
    tint: "text-amber-500",
    workspaces: [{ branch: "master", diff: { additions: 2060, deletions: 776 } }],
  },
  { name: "home", icon: Home, tint: "text-green-500", workspaces: [{ branch: "main" }] },
];

function TitleBar({ sessionPanel }: { sessionPanel: boolean }) {
  return (
    <div className="flex shrink-0 items-end">
      <div className={cn("flex shrink-0 items-center gap-3 px-3 py-2.5", SIDEBAR_WIDTH)}>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <SidebarClose className="size-3.5 text-primary-200" />
      </div>

      <div className="flex min-w-0 flex-1 items-end gap-2 pr-3">
        <WindowTab icon={<Codex className="size-3 shrink-0 text-primary-200" />} title="Confirm Full Access modal" />
        <div className="flex w-36 min-w-0 items-center gap-1.5 py-1.5 pr-5 pl-2.5 text-primary-400">
          <Codex className="size-3 shrink-0" />
          <span className="truncate text-[10px] font-medium tracking-tight">Compare Floating Chat layouts</span>
        </div>
        <Plus className="mb-2 size-3.5 shrink-0 text-primary-500" />

        {/* The app's title-bar controls: session panel, terminal, browser and
            the right panel, drawn mirrored as the app does. */}
        <div className="mb-2 ml-auto flex items-center gap-3 text-primary-500">
          {/* Filled while the session panel is open, as in the app. */}
          {sessionPanel ? <SessionPanelToggle /> : <Menu className="size-3.5" />}
          <TerminalPanel className="size-3.5" />
          <Web className="size-3.5" />
          <SidebarClose className="size-3.5 rotate-180" />
        </div>
      </div>
    </div>
  );
}

function SidebarPanel() {
  return (
    <div className="flex min-w-0 flex-1 flex-col pr-2 pb-2 pl-1">
      {/* The space mode picker, in its sidebar appearance. */}
      <div className="flex items-center gap-1 px-1.5 pb-1 text-xs tracking-tight text-primary-200">
        <span className="font-semibold">Mains</span>
        <span>Code</span>
        <ArrowUp className="size-3 rotate-180 text-primary-400" />
      </div>

      <div className="flex items-center gap-2 rounded-lg px-1.5 py-1 text-[10px] text-primary-100">
        <Project className="size-3 text-primary-100" />
        <span>Add Project</span>
        <span className="ml-auto text-[9px] text-primary-400">⌘N</span>
      </div>

      <div className="mt-2 flex items-center justify-between px-1.5 py-1">
        <span className="text-[10px] font-medium text-primary-400">Workspaces</span>
        <Layers className="size-3 text-primary-200" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden">
        {PROJECTS.map(({ name, icon: Icon, tint, workspaces }) => (
          <div key={name}>
            <div className="flex items-center gap-1.5 px-1.5 py-1">
              <Icon className={cn("size-2.5 shrink-0", tint)} />
              <span className="truncate text-[10px] font-medium text-primary-50">{name}</span>
            </div>
            {/* Rows line up with the project name; the app leaves the branch
                mark off while the list is grouped by project. */}
            {workspaces.map(({ branch, diff, active }) => (
              <div
                key={branch}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg py-1 pr-2 pl-5.5",
                  active && "bg-primary-50/5 glass-outline"
                )}
              >
                <span className="min-w-0 flex-1 truncate text-[10px] text-primary-100">{branch}</span>
                {diff && (
                  <DiffStat
                    additions={diff.additions}
                    deletions={diff.deletions}
                    className="shrink-0 font-mono text-[8px]"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** The size the mockup is drawn at; ScaleToFit fits it to the container. */
const DESIGN_WIDTH = 1152;
const DESIGN_HEIGHT = 684;

/**
 * The opaque content surface; its top-left corner meets the active first tab,
 * so it stays square there. Its right padding is the caller's: while the
 * session panel is open, the chat pads itself out of its way, like the app's
 * content inset.
 */
const CONTENT_COLUMN =
  "relative mr-1 mb-1 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl rounded-tl-none bg-(--demo-content) pl-11";

export function DevAppWindow({
  className,
  sessionPanel = false,
  designHeight = DESIGN_HEIGHT,
}: {
  className?: string;
  /** Open the session panel on Create pull request, beside the chat. */
  sessionPanel?: boolean;
  /** 648 draws it at 16:9, to fill a video-shaped frame. */
  designHeight?: number;
}) {
  const chat = (
    <div className="mx-auto flex min-h-0 w-full max-w-160 flex-1 flex-col">
      <FullAccessChat />
    </div>
  );
  // One chrome layer under both the title bar and the sidebar, around the
  // content column.
  const chrome = (content: React.ReactNode) => (
    <div className="relative flex h-full flex-col bg-(--demo-chrome-translucent) backdrop-blur-2xl">
      <TitleBar sessionPanel={sessionPanel} />
      <div className="flex min-h-0 flex-1">
        <aside className={cn("flex shrink-0", SIDEBAR_WIDTH)}>
          <NavigationRail />
          <SidebarPanel />
        </aside>
        {content}
      </div>
    </div>
  );

  return (
    <ScaleToFit
      designWidth={DESIGN_WIDTH}
      designHeight={designHeight}
      // Below `lg` the whole window is a picture: at that scale its controls
      // are too small to hit, and its scroll area would swallow page swipes.
      className={cn("pointer-events-none lg:pointer-events-auto", className)}
    >
      <div className="relative h-full w-full bg-primary-950">
        <div
          role="group"
          aria-label={
            sessionPanel
              ? "The Mains desktop app with the session panel open to create a pull request from a Codex chat"
              : "The Mains desktop app in a Codex chat that added a confirmation before Full Access"
          }
          // `text-left` is load-bearing: the hero centers its column.
          className="absolute inset-0 overflow-hidden text-left text-primary-200 select-none glass-outline"
        >
          {sessionPanel ? (
            // The pull request flow: the panel's form grows into the dialog,
            // which is drawn over the whole window from its root.
            <PrFlowProvider>
              {chrome(
                <PrFlowColumn className={CONTENT_COLUMN} panel={<SessionPanel />}>
                  {chat}
                </PrFlowColumn>
              )}
              <PrFlowDialog />
            </PrFlowProvider>
          ) : (
            chrome(<div className={cn(CONTENT_COLUMN, "pr-11")}>{chat}</div>)
          )}
        </div>
      </div>
    </ScaleToFit>
  );
}
