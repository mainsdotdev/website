"use client";

import { useState } from "react";
import { ArrowUp } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * The fold over a finished turn's earlier messages and tool calls, after the
 * app's `workspace-events`: a counted label over a hairline that opens in
 * place, on the same grid-rows ease. The content is rendered on the server
 * and handed in, so only the toggle ships to the client.
 */
export function WorkAccordion({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <div className="border-b border-primary-50/10 pb-1">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex cursor-pointer items-center gap-1 text-[10px] text-primary-400 transition-colors hover:text-primary-200"
        >
          <span>{label}</span>
          <ArrowUp
            className={cn(
              "size-2.5 shrink-0 opacity-70 transition-transform duration-300 ease-out",
              open ? "rotate-180" : "rotate-90"
            )}
          />
        </button>
      </div>

      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-col gap-3 pt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
