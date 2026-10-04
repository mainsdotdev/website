import { DiffStat } from "@/components/demo/diff-stat";
import { NavigationRail } from "@/components/demo/navigation-rail";
import { ArrowUp, Layers, Project, ProjectFolder } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * The rail plus the Code sidebar's workspace list, as the window looks while
 * a preview (the browser, an app) is expanded beside it. Shared by the
 * mockups so they all show the same workspaces.
 */

/** Rail plus panel. A title bar's window-controls segment matches it. */
export const SIDEBAR_WIDTH = "w-52";

type Workspace = { branch: string; diff?: { additions: number; deletions: number }; active?: boolean };
const PROJECTS: { name: string; workspaces?: Workspace[] }[] = [
  { name: "mains", workspaces: [{ branch: "feat/mcp-extensions", diff: { additions: 12, deletions: 0 } }] },
  { name: "website", workspaces: [{ branch: "main", diff: { additions: 1759, deletions: 635 }, active: true }] },
  { name: "home" },
  { name: "docs" },
];

function SidebarPanel() {
  return (
    <div className="flex min-w-0 flex-1 flex-col pr-2 pb-2 pl-1">
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

      <div className="flex flex-col gap-0.5">
        {PROJECTS.map(({ name, workspaces }) => (
          <div key={name}>
            <div className="flex items-center gap-1.5 px-1.5 py-1">
              <ProjectFolder className="size-3 shrink-0 text-primary-100" />
              <span className="truncate text-[10px] font-medium text-primary-50">{name}</span>
            </div>
            {workspaces?.map(({ branch, diff, active }) => (
              <div
                key={branch}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg py-1 pr-2 pl-5",
                  active && "bg-primary-900/10 glass-outline"
                )}
              >
                <span className="min-w-0 flex-1 truncate text-[9px] text-primary-300">{branch}</span>
                {diff && (
                  <DiffStat additions={diff.additions} deletions={diff.deletions} className="shrink-0 font-mono text-[8px]" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectSidebar() {
  return (
    <aside className={cn("flex shrink-0", SIDEBAR_WIDTH)}>
      <NavigationRail />
      <SidebarPanel />
    </aside>
  );
}
