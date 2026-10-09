import { WindowTab } from "@/components/demo/window-tab";
import { Apps, Close, MinimizeView, Refresh } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * The app's MCP App panel (`mcp-app-panel.tsx`) expanded to fill the window,
 * for mockups. Expanded, it splits the way the app draws it: the app's tab and
 * controls move up into the title bar (`McpAppTabBar`), and the document fills
 * the content area (`McpAppSurface`) with the chat floating over it.
 */

/**
 * The expanded app's tab, then reload and the app's `PreviewPanelControls`:
 * the chat toggle (on, since the chat is showing), restore to docked, close.
 */
export function McpAppTabBar({ appName }: { appName: string }) {
  return (
    <div className="flex min-w-0 flex-1 items-end gap-2 pr-3">
      <WindowTab title={appName} icon={<Apps className="size-3 shrink-0 text-primary-200" />} className="w-32" />

      <div className="mb-2 ml-auto flex items-center gap-3 text-primary-500">
        <Refresh className="size-3.5 rotate-180" />
        <MinimizeView className="size-3.5" />
        <Close className="size-3" />
      </div>
    </div>
  );
}

/** The app's document, on the content surface. Children float over it. */
export function McpAppSurface({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-xl rounded-tl-none bg-(--demo-content)", className)}>
      {children}
    </div>
  );
}
