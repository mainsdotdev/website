import { ChatPanels, ChatTabStrip } from "@/components/demo/chat-tabs";
import { ContentColumn } from "@/components/demo/content-column";
import { DiffStat } from "@/components/demo/diff-stat";
import { ScaleToFit } from "@/components/demo/scale-to-fit";
import { FlakyTestChat, ImageChat, VoiceChat } from "@/components/demo/voice-chats";
import { NavigationRail, type IconComponent } from "@/components/demo/navigation-rail";
import { FloatingPanels, WindowToolbar } from "@/components/demo/window-panels";
import { WindowStateProvider } from "@/components/demo/window-state";
import {
  ArrowUp,
  Branch,
  Document,
  Gallery,
  Ghost,
  Globe,
  Home,
  Layers,
  Mains,
  Plus,
  Project,
  SidebarOpen,
  Teacup,
  World,
} from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * A scaled replica of the Mains desktop window used in the hero. Its toolbar
 * and panels stay interactive at desktop sizes.
 */

/** Rail plus panel. The title bar's window-controls segment matches it. */
const SIDEBAR_WIDTH = "w-52";

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
        <ChatTabStrip />
        <Plus className="mb-2 size-3.5 shrink-0 text-primary-500" />

        <WindowToolbar />
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
          aria-label="The Mains desktop app in a Codex voice chat that hands work off to separate chats"
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
                  <ChatPanels
                    panels={{
                      voice: <VoiceChat />,
                      flaky: <FlakyTestChat />,
                      image: <ImageChat />,
                    }}
                  />
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
