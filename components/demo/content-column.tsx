"use client";

import { CHAT_TABS } from "@/components/demo/chat-tabs-data";
import { useWindowState } from "@/components/demo/window-state";
import { cn } from "@/lib/utils";

/**
 * The conversation column, mirroring the app's `content-inset`: while a
 * floating panel owns the right edge, the column pads itself out of the way.
 * Once both are dismissed it reclaims the lane — but the transcript keeps its
 * measure and simply centers in the space the sidebar leaves, the way the app
 * caps its own column, rather than stretching to fill the window.
 * Same 150ms ease-out the app animates the inset with.
 */
export function ContentColumn({ children }: { children: React.ReactNode }) {
  const { laneOccupied, activeChat } = useWindowState();

  return (
    <div
      className={cn(
        // Opaque: the content surface is what the vibrant sidebar and title
        // bar are translucent *against*. Like the app's `main-content`, it
        // floats a hair inside the frame so the chrome wraps its right and
        // bottom edges, and rounds every corner — except the top-left while
        // the first tab is active, since that tab joins it there.
        "mr-1 mb-1 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-(--demo-content) pl-11 transition-[padding] duration-300 ease-out",
        activeChat === CHAT_TABS[0].id && "rounded-tl-none",
        laneOccupied ? "pr-67" : "pr-11"
      )}
    >
      {/* The cap never changes, so a toggle only slides the column — the text
          never reflows, which is what made the move read as a jump. */}
      <div className="mx-auto flex min-h-0 w-full max-w-160 flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}
