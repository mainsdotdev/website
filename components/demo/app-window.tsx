import { ChatPanels, ChatTabStrip } from "@/components/demo/chat-tabs";
import { ContentColumn } from "@/components/demo/content-column";
import { ScaleToFit } from "@/components/demo/scale-to-fit";
import { DailyPlanChat, DinnerPlanChat, ImageChat } from "@/components/demo/voice-chats";
import { NavigationRail } from "@/components/demo/navigation-rail";
import { FloatingPanels, WindowToolbar } from "@/components/demo/window-panels";
import { WindowStateProvider } from "@/components/demo/window-state";
import { WorkSidebar } from "@/components/demo/work-sidebar";
import { Plus, SidebarClose } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * A scaled replica of the Mains desktop window used in the hero. Its toolbar
 * and panels stay interactive at desktop sizes.
 */

/** Rail plus panel. The title bar's window-controls segment matches it. */
const SIDEBAR_WIDTH = "w-52";

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

        <SidebarClose className="size-3.5 text-primary-200" />
      </div>

      <div className="flex min-w-0 flex-1 items-end gap-2 pr-3">
        <ChatTabStrip />
        <Plus className="mb-2 size-3.5 shrink-0 text-primary-500" />

        <WindowToolbar />
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className={cn("flex shrink-0", SIDEBAR_WIDTH)}>
      <NavigationRail mode="work" />
      <WorkSidebar />
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
                      voice: <DailyPlanChat />,
                      dinner: <DinnerPlanChat />,
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
