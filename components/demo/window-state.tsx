"use client";

import { createContext, useContext, useMemo, useState } from "react";

type WindowState = {
  changesOpen: boolean;
  subagentsOpen: boolean;
  toggleChanges: () => void;
  setSubagentsOpen: (open: boolean) => void;
  /** True while either panel owns the right edge of the window. */
  laneOccupied: boolean;
};

const WindowStateContext = createContext<WindowState | null>(null);

/**
 * The mockup's two floating panels are opened from one place (the toolbar) and
 * change the layout somewhere else (the conversation column reclaims the right
 * lane when both are dismissed), so their state lives here rather than in
 * either component.
 */
export function WindowStateProvider({ children }: { children: React.ReactNode }) {
  const [changesOpen, setChangesOpen] = useState(true);
  const [subagentsOpen, setSubagentsOpen] = useState(true);

  const value = useMemo<WindowState>(
    () => ({
      changesOpen,
      subagentsOpen,
      toggleChanges: () => setChangesOpen((open) => !open),
      setSubagentsOpen,
      laneOccupied: changesOpen || subagentsOpen,
    }),
    [changesOpen, subagentsOpen]
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
