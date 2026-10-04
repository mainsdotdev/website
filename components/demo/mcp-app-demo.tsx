import { DesignEditor } from "@/components/demo/design-editor";
import { FloatingChat, FloatingChatComposer } from "@/components/demo/floating-chat";
import { McpAppSurface, McpAppTabBar } from "@/components/demo/mcp-app-panel";
import { ProjectSidebar, SIDEBAR_WIDTH } from "@/components/demo/project-sidebar";
import { ScaleToFit } from "@/components/demo/scale-to-fit";
import { OrbFlightSlot } from "@/components/orb-flight";
import { Apps, ArrowUp, Branch, Clipboard, SidebarOpen } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * An MCP App expanded to fill the window, with the chat that opened it
 * floating over it: Codex made the 0.15 social card in Canva, and the editor
 * took the window while the conversation stays at hand — the apps use case,
 * drawn instead of filmed. Same chrome and rail as the hero's window.
 */

function AppToolRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[9px] text-primary-400">
      <Apps className="size-3" />
      <span>{label}</span>
      <ArrowUp className="size-2.5 rotate-90" />
    </div>
  );
}

function Transcript() {
  return (
    <div className="flex flex-col gap-2.5 pb-2">
      <div className="ml-auto max-w-[85%] rounded-2xl bg-primary-900/50 px-2.5 py-1.5 text-[10px] leading-4 text-primary-200">
        Make the social card for the 0.15 post in Canva. Use the Earth render from the OG image chat.
      </div>

      <div className="flex flex-col gap-1.5">
        <AppToolRow label="Canva created a design" />
        <AppToolRow label="Canva uploaded earth-from-moon.webp" />
      </div>

      {/* The app result row: the app opened from here, and this reopens it. */}
      <div className="flex items-center gap-2.5 rounded-2xl px-2.5 py-2 glass-outline">
        <Apps className="size-3.5 shrink-0 text-primary-100" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[10px] font-medium text-primary-50">Mains 0.15 · Social card</div>
          <div className="text-[9px] text-primary-400">Canva design · 1200 × 630</div>
        </div>
        <span className="shrink-0 rounded-full bg-primary-600 px-2.5 py-1 text-[9px] font-medium text-primary-950">
          Open app
        </span>
      </div>

      <p className="text-[10px] leading-4.5 text-primary-200">
        It&apos;s open in Canva: the Earth render as the background, with the title set over the sky. Change
        anything on the canvas, then tell me when to export it.
      </p>

      <div className="flex items-center gap-1.5 text-[9px] text-primary-400">
        <span>38s</span>
        <span>·</span>
        <Clipboard className="size-2.5" />
        <Branch className="size-2.5" />
      </div>
    </div>
  );
}

const DESIGN_WIDTH = 1152;
const DESIGN_HEIGHT = 648;

export function McpAppDemo({ className }: { className?: string }) {
  return (
    <ScaleToFit
      designWidth={DESIGN_WIDTH}
      designHeight={DESIGN_HEIGHT}
      // Below `lg` the window is a picture: its controls are too small to hit.
      className={cn("pointer-events-none lg:pointer-events-auto", className)}
    >
      <div
        role="group"
        aria-label="Mains with a Canva MCP App expanded to fill the window, editing a social card, and the chat that opened it floating over it"
        className="relative h-full w-full overflow-hidden bg-primary-950 text-left text-primary-200 select-none glass-outline"
      >
        <div className="relative flex h-full flex-col bg-(--demo-chrome-translucent) backdrop-blur-2xl">
          <div className="flex shrink-0 items-end">
            <div className={cn("flex shrink-0 items-center gap-3 px-3 py-2.5", SIDEBAR_WIDTH)}>
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
              </div>
              <SidebarOpen className="size-3.5 text-primary-200" />
            </div>
            <McpAppTabBar appName="Canva" />
          </div>

          <div className="flex min-h-0 flex-1">
            <ProjectSidebar />
            <McpAppSurface className="mr-1 mb-1">
              <DesignEditor />
              <FloatingChat
                title="Social card for 0.15"
                composer={<FloatingChatComposer />}
                above={<OrbFlightSlot stop="case-app" className="size-11" />}
              >
                <Transcript />
              </FloatingChat>
            </McpAppSurface>
          </div>
        </div>
      </div>
    </ScaleToFit>
  );
}
