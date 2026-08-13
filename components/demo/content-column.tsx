"use client";

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
  const { laneOccupied } = useWindowState();

  return (
    <div
      className={cn(
        // Opaque: the content surface is what the vibrant sidebar and title
        // bar are translucent *against*.
        "flex min-w-0 flex-1 flex-col overflow-hidden bg-[#0d0d0d] pl-11 transition-[padding] duration-300 ease-out",
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
