import Image from "next/image";
import { ContentColumn } from "@/components/demo/content-column";
import { DiffStat } from "@/components/demo/diff-stat";
import { MarkdownMessage } from "@/components/demo/markdown-message";
import { ScaleToFit } from "@/components/demo/scale-to-fit";
import { Transcript } from "@/components/demo/transcript";
import { FloatingPanels, WindowToolbar } from "@/components/demo/window-panels";
import { WindowStateProvider } from "@/components/demo/window-state";
import {
  Attach,
  Box,
  Branch,
  ChevronDown,
  ChevronUp,
  Claude,
  Clipboard,
  Codex,
  Edit,
  Layers,
  Plugin,
  Plus,
  Project,
  ProjectFolder,
  Question,
  Relay,
  Settings,
  StatusCanceled,
  StatusDone,
  StatusInProgress,
  StatusTodo,
  Sun,
  Toggle,
} from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * A static replica of the Mains desktop window, used as the hero visual.
 *
 * Presentational only — no state, no interactivity. The parts are modelled on
 * the app's own components (sidebar workspace rows, the session panel's
 * `PanelItem`, the subagent panel, the composer toolbar) and draw the same
 * icons and `AgentGlyph` marks, so the mockup ages with the product instead of
 * drifting from it. Sized for `lg` and up; callers fall back to a still image
 * on narrower screens.
 */

type NavItem = {
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  iconClassName?: string;
  shortcut?: string;
  badge?: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Add Project", icon: Project, shortcut: "⌘N" },
  { label: "Tasks", icon: Box },
  { label: "Pulse", icon: Sun },
  { label: "Plugins", icon: Plugin, iconClassName: "-rotate-45" },
  { label: "Relay", icon: Relay, badge: "Beta" },
];

type WorkspaceStatus = "in_progress" | "todo" | "canceled" | "done";

type Workspace = {
  repo: string;
  branch: string;
  status: WorkspaceStatus;
  diff?: { additions: number; deletions: number };
  active?: boolean;
};

const WORKSPACES: Workspace[] = [
  {
    repo: "mains",
    branch: "feature/issue-pr-screen",
    status: "in_progress",
    diff: { additions: 1, deletions: 11 },
    active: true,
  },
  { repo: "website", branch: "main", status: "todo" },
  { repo: "docs", branch: "master", status: "in_progress" },
  { repo: "typehaus-auth", branch: "fix/login-unknown-email", status: "todo" },
  {
    repo: "typehaus-fe",
    branch: "fix/sign-up-password-creation",
    status: "canceled",
  },
  { repo: "typehaus-be", branch: "feature/bulk-import", status: "done" },
  { repo: "metavest", branch: "master", status: "done" },
  { repo: "coffee-atlas", branch: "fix/deploy-netlify", status: "todo" },
];

/** Mirrors the app's WorkspaceStatusIcon mapping and status colors. */
const STATUS_ICONS: Record<
  WorkspaceStatus,
  { Icon: React.FC<React.SVGProps<SVGSVGElement>>; className: string }
> = {
  in_progress: { Icon: StatusInProgress, className: "text-amber-500" },
  todo: { Icon: StatusTodo, className: "text-primary-500" },
  canceled: { Icon: StatusCanceled, className: "text-red-500" },
  done: { Icon: StatusDone, className: "text-blue-400" },
};

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
      className="relative flex min-w-0 items-center gap-1.5 rounded-t-xl bg-[#0d0d0d] py-1.5 pr-5 pl-2.5"
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
            "radial-gradient(circle at top right, transparent 8px, #0d0d0d 8px)",
        }}
      />
    </div>
  );
}

function TitleBar() {
  return (
    <div className="flex shrink-0 items-end bg-[#0d0d0d]/58 backdrop-blur-2xl">
      {/* Window controls live over the sidebar, so this segment matches its
          width — the tab strip belongs to the content column beside it. */}
      <div className="flex w-47.5 shrink-0 items-center gap-3 px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>

        <Toggle className="size-3.5 rotate-180 text-primary-400" />
      </div>

      <div className="flex min-w-0 flex-1 items-end gap-2 pr-3">
        <WindowTab />
        <Plus className="mb-2 size-3.5 shrink-0 text-primary-500" />

        <WindowToolbar />
      </div>
    </div>
  );
}

function WorkspaceRow({ workspace }: { workspace: Workspace }) {
  const { Icon, className } = STATUS_ICONS[workspace.status];

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg px-2 py-1",
        workspace.active && "bg-primary-900/10 glass-outline",
      )}
    >
      <div className="flex items-center gap-1.5">
        <ProjectFolder className="size-3 shrink-0 text-primary-100" />
        <span className="min-w-0 flex-1 truncate text-[10px] text-primary-50">
          {workspace.repo}
        </span>
        {workspace.diff && (
          <DiffStat
            additions={workspace.diff.additions}
            deletions={workspace.diff.deletions}
            className="shrink-0 font-mono text-[9px]"
          />
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Icon className={cn("size-2.5 shrink-0", className)} />
        <span className="truncate text-[9px] text-primary-300">
          {workspace.branch}
        </span>
      </div>
    </div>
  );
}

function SidebarPanel() {
  return (
    <aside className="flex w-47.5 shrink-0 flex-col bg-[#0d0d0d]/58 px-1 pb-2 backdrop-blur-2xl">
      <div className="flex flex-col">
        {NAV_ITEMS.map(
          ({ label, icon: Icon, iconClassName, shortcut, badge }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-lg px-2 py-1 text-[10px] text-primary-100"
            >
              <Icon className={cn("size-3 text-primary-200", iconClassName)} />
              <span>{label}</span>
              {shortcut && (
                <span className="ml-auto font-mono text-[9px] text-primary-500">
                  {shortcut}
                </span>
              )}
              {badge && (
                <span className="ml-auto rounded-full bg-primary-800/60 px-1.5 py-px text-[8px] tracking-wide text-primary-300 uppercase">
                  {badge}
                </span>
              )}
            </div>
          ),
        )}
      </div>

      <div className="mt-2 flex items-center justify-between px-2 pb-1">
        <span className="text-[10px] tracking-tight text-primary-200">
          Workspaces
        </span>
        <Layers className="size-3 text-primary-300" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden">
        {WORKSPACES.map((workspace) => (
          <WorkspaceRow
            key={`${workspace.repo}/${workspace.branch}`}
            workspace={workspace}
          />
        ))}
      </div>

      <div className="mt-auto flex items-center px-1 pt-3 text-primary-300">
        <Settings className="size-3.5" />
        {/* The connected agents sit centered between settings and help. */}
        <span className="mx-auto flex items-center gap-3">
          <Claude className="size-3.5" />
          <Codex className="size-3" />
        </span>
        <Question className="size-3.5" />
      </div>
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
            <span className="text-primary-50">Opus 5 [1M]</span>
            <span className="text-primary-400">High</span>
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
    // The desktop: the window floats on it, and it is what the window's
    // translucent chrome blurs — the same vibrancy the real app picks up from
    // whatever is behind it.
    <ScaleToFit
      designWidth={DESIGN_WIDTH}
      designHeight={DESIGN_HEIGHT}
      // Below `lg` the whole window is a picture: at that scale its controls
      // are too small to hit, and its scroll area would swallow page swipes.
      className={cn(
        "rounded-lg pointer-events-none lg:pointer-events-auto",
        className,
      )}
    >
      <div className="relative h-full w-full">
        <Image
          src="/hero.jpg"
          alt=""
          aria-hidden
          fill
          priority
          sizes="1152px"
          className="object-cover"
        />
        {/* Settles the wallpaper into the page's darkness without flattening
            the tint the chrome samples from it. */}
        <div aria-hidden className="absolute inset-0 bg-black/25" />

        <div
          role="group"
          aria-label="The Mains desktop app reviewing a project with parallel subagents"
          className={cn(
            // `text-left` is load-bearing: the hero centers its column, and an
            // app window that inherits that centering stops looking like an app.
            "absolute inset-x-[3.5%] top-[4%] bottom-[5%] overflow-hidden rounded-lg text-left text-primary-200 select-none glass-outline",
            "shadow-[0_40px_90px_-20px_rgba(0,0,0,0.7)]",
          )}
        >
          <WindowStateProvider>
            <div className="relative flex h-full flex-col">
              <TitleBar />

              <div className="flex min-h-0 flex-1">
                <SidebarPanel />

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
