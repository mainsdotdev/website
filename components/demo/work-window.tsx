"use client";

import { motion } from "framer-motion";
import { NavigationRail } from "@/components/demo/navigation-rail";
import { WindowTab } from "@/components/demo/window-tab";
import {
  Apps,
  Armchair,
  Bag,
  BlackHole,
  ChevronDown,
  Codex,
  Earth,
  Edit,
  Gallery,
  Globe,
  Heart,
  Mitts,
  Plus,
  SidebarOpen,
} from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * The Mains window in Work mode, for the Work page's mockups: the title bar
 * with one Codex tab, the rail, and the Work sidebar — New chat, the projects
 * from the app's own dev data, and Recents. The content column is the
 * caller's.
 */

/** The Work-mode projects, with the icons and colors they have in the app. */
export const WORK_PROJECTS = [
  { name: "Trips & Things", Icon: Earth, tint: "text-sky-400" },
  { name: "Rabbit Hole", Icon: BlackHole, tint: "text-violet-400" },
  { name: "Work Stuff", Icon: Bag, tint: "text-orange-400" },
  { name: "Kitchen Notes", Icon: Mitts, tint: "text-green-500" },
  { name: "Longevity", Icon: Heart, tint: "text-red-400" },
  { name: "Visual Works", Icon: Gallery, tint: "text-[#a3a38a]" },
  { name: "Living Room", Icon: Armchair, tint: "text-blue-400" },
];

function WorkSidebar({ recents, current }: { recents: string[]; current?: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col pr-2 pb-2 pl-1">
      <div className="flex items-center gap-1 px-1.5 pb-1 text-xs tracking-tight text-primary-200">
        <span className="font-semibold">Mains</span>
        <span>Work</span>
        <ChevronDown className="size-2.5 text-primary-400" fill="currentColor" />
      </div>
      <div className="flex items-center gap-2 rounded-lg px-1.5 py-1 text-[10px] text-primary-100">
        <Edit className="size-3" />
        <span>New chat</span>
        <span className="ml-auto text-[9px] text-primary-400">⌘N</span>
      </div>

      <div className="mt-2 flex items-center justify-between px-1.5 py-1">
        <span className="text-[10px] font-medium text-primary-400">Projects</span>
        <Plus className="size-3 text-primary-300" />
      </div>
      {WORK_PROJECTS.map(({ name, Icon, tint }) => (
        <div key={name} className="flex items-center gap-1.5 px-1.5 py-1">
          <Icon className={cn("size-3 shrink-0", tint)} />
          <span className={cn("truncate text-[10px]", tint)}>{name}</span>
        </div>
      ))}

      {recents.length > 0 && (
        <div className="mt-2 flex flex-col gap-0.5">
          <div className="px-1.5 py-1 text-[10px] font-medium text-primary-400">Recents</div>
          {recents.map((title) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "truncate rounded-lg px-1.5 py-1 text-[10px]",
                title === current ? "bg-primary-50/5 text-primary-100 glass-outline" : "text-primary-300"
              )}
            >
              {title}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * The Mains window's frame, for any Work-mode surface: the title bar with its
 * tabs, and the rail and sidebar beside an opaque content column. The callers
 * fill in the tabs, the sidebar and the content.
 */
export function WindowFrame({
  tabs,
  titleBarEnd,
  rail = <NavigationRail />,
  sidebar,
  children,
}: {
  /** The title bar's tabs, the first of which meets the content column. */
  tabs: React.ReactNode;
  /** The icons at the title bar's right end. */
  titleBarEnd?: React.ReactNode;
  rail?: React.ReactNode;
  sidebar: React.ReactNode;
  /** The content column's contents. */
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-full w-full bg-primary-950">
      <div className="absolute inset-0 overflow-hidden text-left text-primary-200 select-none glass-outline">
        <div className="relative flex h-full flex-col bg-(--demo-chrome-translucent) backdrop-blur-2xl">
          <div className="flex shrink-0 items-end">
            <div className="flex w-52 shrink-0 items-center gap-3 px-3 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
              </div>
              <SidebarOpen className="size-3.5 text-primary-200" />
            </div>
            <div className="flex min-w-0 flex-1 items-end gap-2 pr-3">
              {tabs}
              <div className="mb-2 ml-auto flex items-center gap-3 text-primary-500">{titleBarEnd}</div>
            </div>
          </div>

          <div className="flex min-h-0 flex-1">
            <aside className="flex w-52 shrink-0">
              {rail}
              {sidebar}
            </aside>

            {/* The opaque content surface; its top-left corner meets the
                active first tab, so it stays square there. */}
            <div className="relative mr-1 mb-1 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl rounded-tl-none bg-(--demo-content)">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkWindow({
  tabTitle,
  recents,
  children,
}: {
  /** The chat on screen; highlighted in Recents when it is there. */
  tabTitle: string;
  /** Chats in Recents, newest first, as the app lists them. */
  recents: string[];
  /** The content column's contents. */
  children: React.ReactNode;
}) {
  return (
    <WindowFrame
      tabs={<WindowTab icon={<Codex className="size-3 shrink-0 text-primary-200" />} title={tabTitle} />}
      titleBarEnd={
        <>
          <Apps className="size-3.5" />
          <Globe className="size-3.5" />
        </>
      }
      sidebar={<WorkSidebar recents={recents} current={tabTitle} />}
    >
      {children}
    </WindowFrame>
  );
}
