"use client";

import { useLayoutEffect, useRef } from "react";
import { CHAT_TABS, type ChatTabId } from "@/components/demo/chat-tabs-data";
import { useWindowState } from "@/components/demo/window-state";
import { Codex } from "@/components/icons";
import { cn } from "@/lib/utils";

/** The inverted corner that flares an active tab into the surface below. */
function TabFlare({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute bottom-0 size-2",
        side === "right" ? "-right-2" : "-left-2"
      )}
      style={{
        background: `radial-gradient(circle at top ${side}, transparent 8px, var(--demo-content) 8px)`,
      }}
    />
  );
}

/**
 * The title bar's chat tabs, following the app's `BaseTab`: the active tab
 * paints itself in the *content* color, rounds only its top corners, then
 * flares back out with inverted corners so it reads as merging into the
 * surface below. The first tab drops its left flare — like the app's first
 * tab beside an open sidebar — and the content column squares that corner.
 */
export function ChatTabStrip() {
  const { activeChat, openChats, setActiveChat } = useWindowState();

  return (
    <div role="tablist" aria-label="Chats" className="flex min-w-0 items-end gap-1">
      {openChats.map((id, index) => {
        const { title } = CHAT_TABS.find((tab) => tab.id === id)!;
        const active = id === activeChat;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            id={`work-chat-tab-${id}`}
            aria-controls={`work-chat-panel-${id}`}
            aria-selected={active}
            onClick={() => setActiveChat(id)}
            className={cn(
              "relative flex w-36 min-w-0 cursor-pointer items-center gap-1.5 rounded-t-xl py-1.5 pr-5 pl-2.5 text-left transition-colors",
              active
                ? "bg-(--demo-content) text-primary-200"
                : "text-primary-400 hover:text-primary-200"
            )}
            style={
              active
                ? {
                    boxShadow:
                      "inset 0 1px 0 color-mix(in srgb, var(--color-primary) 20%, transparent)",
                  }
                : undefined
            }
          >
            <Codex className="size-3 shrink-0" />
            <span className="truncate text-[10px] font-medium tracking-tight">
              {title}
            </span>
            {active && index > 0 && <TabFlare side="left" />}
            {active && <TabFlare side="right" />}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Shows the selected chat. Each one is rendered on the server and handed in
 * here, so its markdown never reaches the client bundle; only the switch does.
 */
export function ChatPanels({ panels }: { panels: Record<ChatTabId, React.ReactNode> }) {
  const { activeChat } = useWindowState();
  return (
    <div
      role="tabpanel"
      id={`work-chat-panel-${activeChat}`}
      aria-labelledby={`work-chat-tab-${activeChat}`}
      className="flex min-h-0 flex-1 flex-col"
    >
      {panels[activeChat]}
    </div>
  );
}

/** The delegated-chat card's button: opens that chat in its tab. */
export function OpenChatButton({ chat }: { chat: ChatTabId }) {
  const { openChat } = useWindowState();

  return (
    <button
      type="button"
      onClick={() => openChat(chat)}
      className="shrink-0 cursor-pointer rounded-full bg-primary-600 px-2.5 py-1 text-[9px] font-medium text-primary-950 transition-colors hover:bg-primary-500"
    >
      Open chat
    </button>
  );
}

/**
 * A chat's scroll area, parked at the bottom when it opens — the way a live
 * session sits, with its history above the fold to scroll back through.
 */
export function ChatScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  return (
    <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto noscrollbar">
      {children}
    </div>
  );
}
