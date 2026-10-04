"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { CHAT_TABS, type ChatTabId } from "@/components/demo/chat-tabs-data";

type WindowState = {
  changesOpen: boolean;
  subagentsOpen: boolean;
  toggleChanges: () => void;
  setSubagentsOpen: (open: boolean) => void;
  /** True while either panel owns the right edge of the window. */
  laneOccupied: boolean;
  activeChat: ChatTabId;
  setActiveChat: (id: ChatTabId) => void;
};

const WindowStateContext = createContext<WindowState | null>(null);

/**
 * The mockup's floating panels are opened from one place (the toolbar) and
 * change the layout somewhere else (the conversation column reclaims the right
 * lane when both are dismissed), and its chat tabs are picked in the title bar
 * but shown in the content column, so that state lives here rather than in
 * any one component.
 *
 * The panels start dismissed: the voice chat the window opens on has no
 * changes or subagents of its own to show.
 */
export function WindowStateProvider({ children }: { children: React.ReactNode }) {
  const [changesOpen, setChangesOpen] = useState(false);
  const [subagentsOpen, setSubagentsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<ChatTabId>(CHAT_TABS[0].id);

  const value = useMemo<WindowState>(
    () => ({
      changesOpen,
      subagentsOpen,
      toggleChanges: () => setChangesOpen((open) => !open),
      setSubagentsOpen,
      laneOccupied: changesOpen || subagentsOpen,
      activeChat,
      setActiveChat,
    }),
    [changesOpen, subagentsOpen, activeChat]
  );

  return (
    <WindowStateContext.Provider value={value}>
      {children}
    </WindowStateContext.Provider>
  );
}

export function useWindowState() {
  const value = useContext(WindowStateContext);
  if (!value) {
    throw new Error("useWindowState must be used inside <WindowStateProvider>");
  }
  return value;
}
