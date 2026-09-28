import { ContentColumn } from "@/components/demo/content-column";
import { DiffStat } from "@/components/demo/diff-stat";
import { MarkdownMessage } from "@/components/demo/markdown-message";
import { ScaleToFit } from "@/components/demo/scale-to-fit";
import { Transcript } from "@/components/demo/transcript";
import { FloatingPanels, WindowToolbar } from "@/components/demo/window-panels";
import { WindowStateProvider } from "@/components/demo/window-state";
import {
  ArrowUp,
  Attach,
  Branch,
  ChevronDown,
  ChevronUp,
  Claude,
  ClaudeMark,
  Clipboard,
  Clock,
  Codex,
  Copilot,
  Document,
  Edit,
  Gallery,
  Ghost,
  Globe,
  Home,
  Layers,
  Mains,
  Plugin,
  Plus,
  Project,
  Question,
  Relay,
  Search,
  SidebarOpen,
  Settings,
  Task,
  Teacup,
  World,
} from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * A scaled replica of the Mains desktop window used in the hero. Its toolbar
 * and panels stay interactive at desktop sizes.
 */

type IconComponent = React.FC<React.SVGProps<SVGSVGElement>>;

/** Rail plus panel. The title bar's window-controls segment matches it. */
const SIDEBAR_WIDTH = "w-52";

type RailItem = {
  label: string;
  icon: IconComponent;
  iconClassName?: string;
  active?: boolean;
};

/** The app's `NavigationRail` destinations, in its order. */
const RAIL_ITEMS: RailItem[] = [
  { label: "Home", icon: Home, active: true },
  { label: "Search Mains", icon: Search },
  { label: "Plugins", icon: Plugin, iconClassName: "-rotate-45" },
  { label: "Tasks", icon: Task },
  { label: "Pulse", icon: Clock },
  { label: "Connect", icon: Relay },
];

/** Agent spaces at the foot of the rail; only the active one is full strength. */
const SPACES: RailItem[] = [
  { label: "Claude", icon: ClaudeMark, active: true },
  { label: "Codex", icon: Codex },
  { label: "Copilot", icon: Copilot },
];

type ProjectWorkspace = {
  branch: string;
  /** Still on the project's base branch, so the row carries no branch mark. */
  onBase?: boolean;
  diff?: { additions: number; deletions: number };
  active?: boolean;
};

type ProjectGroup = {
  name: string;
  icon: IconComponent;
  /** The project's picked tint, from the app's icon color palette. */
  tint: string;
  /** Present only for a group that is expanded. */
  workspaces?: ProjectWorkspace[];
};

const PROJECTS: ProjectGroup[] = [
  {
    name: "mains",
    icon: Mains,
    tint: "text-primary-50",
    workspaces: [
      {
        branch: "feature/issue-pr-screen",
        diff: { additions: 1, deletions: 11 },
        active: true,
      },
      { branch: "main", onBase: true },
    ],
  },
  { name: "home", icon: Home, tint: "text-sky-500" },
  { name: "website", icon: World, tint: "text-rose-500" },
  { name: "docs", icon: Document, tint: "text-amber-500" },
  { name: "og", icon: Gallery, tint: "text-primary-50" },
  { name: "telescopic-text", icon: Globe, tint: "text-green-500" },
  { name: "coffee-atlas", icon: Teacup, tint: "text-orange-500" },
  { name: "metavest", icon: Ghost, tint: "text-violet-500" },
];

/** The agent's reply, exactly as it would arrive — markdown, emoji and all. */
const REVIEW_MARKDOWN = `## Review Summary

All three reviews are complete. No critical or blocking issues were identified.

### 🔒 Security

No significant security risks found. Authentication, IPC boundaries, filesystem access, credentials, and command execution follow safe patterns.

**Result: ✅ Passed**

### 🧪 Test Coverage

Core workflows and security-sensitive paths are covered. No major test gaps or release-blocking issues found.

**Result: ✅ Passed**

### 🔧 Maintainability

The codebase is well-structured with clear boundaries, consistent patterns, and no major architectural concerns.

**Result: ✅ Passed**

| Category | Status | Issues |
| --- | --- | --- |
| Security | ✅ Passed | 0 |
| Tests | ✅ Passed | 0 |
| Maintainability | ✅ Passed | 0 |

**Overall: ✅ Project is in good shape and ready to ship.**
`;

/**
 * Active tab, following the app's `BaseTab`: the tab paints itself in the
 * *content* color and rounds only its top corners, then flares back out with
 * an inverted corner so it reads as merging into the surface below. The left
 * corner stays off — like the app's first tab beside an open sidebar.
 */
function WindowTab() {
  return (
    <div
      className="relative flex min-w-0 items-center gap-1.5 rounded-t-xl bg-(--demo-content) py-1.5 pr-5 pl-2.5"
      style={{
        boxShadow:
          "inset 0 1px 0 color-mix(in srgb, var(--color-primary) 20%, transparent)",
      }}
    >
      <Claude className="size-3 shrink-0" />
      <span className="truncate text-[10px] font-medium tracking-tight text-primary-200">
        Review app with pa…
      </span>

      <span
        aria-hidden
        className="absolute -right-2 bottom-0 size-2"
        style={{
          background:
            "radial-gradient(circle at top right, transparent 8px, var(--demo-content) 8px)",
        }}
      />
    </div>
  );
}

function TitleBar() {
  return (
    <div className="flex shrink-0 items-end">
      {/* Window controls live over the sidebar, so this segment matches its
          width — the tab strip belongs to the content column beside it. */}
      <div
        className={cn(
          "flex shrink-0 items-center gap-3 px-3 py-2.5",
          SIDEBAR_WIDTH,
        )}
      >
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>

        <SidebarOpen className="size-3.5 text-primary-200" />
      </div>

      <div className="flex min-w-0 flex-1 items-end gap-2 pr-3">
        <WindowTab />
        <Plus className="mb-2 size-3.5 shrink-0 text-primary-500" />

        <WindowToolbar />
      </div>
    </div>
  );
}

function RailButton({
  item: { icon: Icon, iconClassName, active },
}: {
  item: RailItem;
}) {
  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-lg",
        active ? "bg-primary-900 text-primary-50" : "text-primary-300",
      )}
    >
      <Icon className={cn("size-3.5", iconClassName)} />
    </span>
  );
}

/**
 * The app's `NavigationRail`: page destinations up top; agent spaces, help
 * and settings pinned to the foot. It sits on the content color as its own
 * rounded card, inset from the vibrant chrome around it.
 */
function NavigationRail() {
  return (
    <div className="mx-1 mb-1 flex w-8 shrink-0 flex-col items-center rounded-xl bg-(--demo-content) p-1">
      <div className="flex flex-col items-center gap-1.5">
        {RAIL_ITEMS.map((item) => (
          <RailButton key={item.label} item={item} />
        ))}
      </div>

      <div className="mt-auto flex flex-col items-center gap-1">
        <div className="flex flex-col items-center gap-1">
          {SPACES.map(({ label, icon: Icon, active }) => (
            <span
              key={label}
              className={cn(
                "flex size-6 items-center justify-center text-primary",
                !active && "opacity-50",
              )}
            >
              <Icon className="size-3" />
            </span>
          ))}
        </div>
        <div className="my-1 w-6 border-b border-primary-800" />
        <RailButton item={{ label: "Help & Resources", icon: Question }} />
        <RailButton item={{ label: "Settings", icon: Settings }} />
      </div>
    </div>
  );
}

/**
 * A worktree row under an expanded project, as the app draws it while the
 * list is grouped by project: branch only, the mark appearing once the branch
 * has moved off the project's base.
 */
function WorkspaceRow({ workspace }: { workspace: ProjectWorkspace }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-2 py-1",
        workspace.active && "bg-primary-900/10 glass-outline",
      )}
    >
      {workspace.onBase ? (
        <span aria-hidden className="size-3 shrink-0" />
      ) : (
        <Branch className="size-3 shrink-0 text-primary-300" />
      )}
      <span className="min-w-0 flex-1 truncate text-[9px] text-primary-300">
        {workspace.branch}
      </span>
      {workspace.diff && (
        <DiffStat
          additions={workspace.diff.additions}
          deletions={workspace.diff.deletions}
          className="shrink-0 font-mono text-[9px]"
        />
      )}
    </div>
  );
}

function ProjectGroupRow({ project }: { project: ProjectGroup }) {
  const { name, icon: Icon, tint, workspaces } = project;

  return (
    <div>
      <div className="flex items-center gap-1.5 rounded-lg px-1.5 py-1">
        <Icon className={cn("size-2.5 shrink-0", tint)} />
        <span className="truncate text-[10px] font-medium text-primary-50">
          {name}
        </span>
      </div>

      {workspaces && (
        <div className="flex flex-col gap-0.5">
          {workspaces.map((workspace) => (
            <WorkspaceRow key={workspace.branch} workspace={workspace} />
          ))}
        </div>
      )}
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
        <span className="text-[10px] font-medium text-primary-400">
          Workspaces
        </span>
        <Layers className="size-3 text-primary-200" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden">
        {PROJECTS.map((project) => (
          <ProjectGroupRow key={project.name} project={project} />
        ))}
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className={cn("flex shrink-0", SIDEBAR_WIDTH)}>
      <NavigationRail />
      <SidebarPanel />
    </aside>
  );
}

function ReviewSummary() {
  return (
    <div className="mt-3">
      <MarkdownMessage source={REVIEW_MARKDOWN} />

      <div className="mt-2.5 flex items-center gap-2 text-[10px] text-primary-400">
        <span>10m 45s</span>
        <span>·</span>
        <Clipboard className="size-3" />
        <Branch className="size-3" />
      </div>
    </div>
  );
}

/**
 * The workspace composer. Structure and classes track the app's
 * `RichInputForm` + `InputToolbar` + `SendButton`, scaled to the mockup: the
 * `glass-surface` shell, the ⌘P hint pinned top-right, the toolbar row, and
 * the round `glass-button` send target.
 */
function Composer() {
  return (
    <div className="mb-4 shrink-0 rounded-[18px] pb-1.5 glass-outline bg-primary-900/20">
      <div className="relative pt-1 pr-16 pb-0.5 pl-3.5">
        <span className="text-[10px] text-primary-400">
          Ask a follow-up, use @ or / for commands, files, skills and issues
        </span>
        <kbd className="absolute top-2 right-2 px-1 py-0.5 font-sans text-[8px] text-primary-200">
          ⌘ P to focus
        </kbd>
      </div>

      <div className="flex items-center justify-between gap-2 px-2 pt-3">
        <div className="ml-1 flex min-w-0 items-center gap-2 pr-2 text-primary-200">
          <Attach className="size-3 shrink-0" />

          <span className="flex items-center gap-1 text-[10px]">
            <Claude className="size-3" />
            <span className="text-primary-50">Fable 5.1</span>
            <span className="text-primary-400">Max</span>
            <ChevronDown
              className="size-2.5 text-primary-400"
              fill="currentColor"
            />
          </span>

          <span className="flex items-center gap-1 text-[10px]">
            <Edit className="size-3" />
            <span className="text-primary-100">Edit</span>
            <ChevronDown
              className="size-2.5 text-primary-400"
              fill="currentColor"
            />
          </span>
        </div>

        <span className="flex shrink-0 items-center justify-center rounded-full p-1 glass-button">
          <ChevronUp className="size-3.5 text-primary" />
        </span>
      </div>
    </div>
  );
}

/** The size the mockup is drawn at; ScaleToFit fits it to the container. */
const DESIGN_WIDTH = 1152;
const DESIGN_HEIGHT = 684;

export function AppWindow({ className }: { className?: string }) {
  return (
    <ScaleToFit
      designWidth={DESIGN_WIDTH}
      designHeight={DESIGN_HEIGHT}
      // Below `lg` the whole window is a picture: at that scale its controls
      // are too small to hit, and its scroll area would swallow page swipes.
      className={cn("pointer-events-none lg:pointer-events-auto", className)}
    >
      <div className="relative h-full w-full bg-primary-950">
        <div
          role="group"
          aria-label="The Mains desktop app reviewing a project with parallel subagents"
          className={cn(
            // `text-left` is load-bearing: the hero centers its column, and an
            // app window that inherits that centering stops looking like an app.
            "absolute inset-0 overflow-hidden text-left text-primary-200 select-none glass-outline",
          )}
        >
          <WindowStateProvider>
            {/* One chrome layer under both the title bar and the sidebar: two
                separately blurred layers leave a seam where they meet. The
                opaque content column paints over its share. */}
            <div className="relative flex h-full flex-col bg-(--demo-chrome-translucent) backdrop-blur-2xl">
              <TitleBar />

              <div className="flex min-h-0 flex-1">
                <Sidebar />

                <ContentColumn>
                  <Transcript>
                    <ReviewSummary />
                  </Transcript>

                  <Composer />
                </ContentColumn>
              </div>
            </div>

            <FloatingPanels />
          </WindowStateProvider>
        </div>
      </div>
    </ScaleToFit>
  );
}
