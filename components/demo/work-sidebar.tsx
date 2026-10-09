"use client";

import { CHAT_TABS, type ChatTabId } from "@/components/demo/chat-tabs-data";
import type { IconComponent } from "@/components/demo/navigation-rail";
import { useWindowState } from "@/components/demo/window-state";
import {
  Armchair,
  ArrowUp,
  BlackHole,
  Earth,
  Edit,
  Gallery,
  Heart,
  Mitts,
  Plus,
  Suitcase,
} from "@/components/icons";
import { cn } from "@/lib/utils";

type WorkProject = {
  name: string;
  icon: IconComponent;
  tint: string;
  /** Empty projects are expanded; omitted chats means the group is collapsed. */
  chats?: ChatTabId[];
};

const PROJECTS: WorkProject[] = [
  { name: "Trips & Things", icon: Earth, tint: "text-sky-500", chats: [] },
  { name: "Rabbit Hole", icon: BlackHole, tint: "text-violet-400", chats: [] },
  { name: "Work Stuff", icon: Suitcase, tint: "text-amber-500" },
  { name: "Kitchen Notes", icon: Mitts, tint: "text-green-500", chats: ["dinner"] },
  { name: "Longevity", icon: Heart, tint: "text-red-400" },
  { name: "Visual Works", icon: Gallery, tint: "text-primary-300", chats: ["image"] },
  { name: "Living Room", icon: Armchair, tint: "text-blue-400", chats: ["voice"] },
];

export function WorkSidebar() {
  const { activeChat, openChat } = useWindowState();
  return <WorkSidebarContent activeChat={activeChat} onOpenChat={openChat} />;
}

export function WorkSidebarContent({ activeChat, onOpenChat, featuredChat }: {
  activeChat?: ChatTabId;
  onOpenChat?: (id: ChatTabId) => void;
  featuredChat?: { project: string; title: string };
}) {

  return (
    <div className="flex min-w-0 flex-1 flex-col pr-2 pb-2 pl-1">
      <div className="flex items-center gap-1 px-1.5 pb-2 text-xs tracking-tight text-primary-200">
        <span className="font-semibold">Mains</span>
        <span>Work</span>
        <ArrowUp className="size-3 rotate-180 text-primary-400" />
      </div>

      <div className="flex items-center gap-2 rounded-lg px-1.5 py-1.5 text-[10px] text-primary-100">
        <Edit className="size-3" />
        <span>New chat</span>
        <span className="ml-auto text-[9px] text-primary-400">⌘N</span>
      </div>

      <div className="mt-3 flex items-center justify-between px-1.5 py-1">
        <span className="text-[10px] font-medium text-primary-400">Projects</span>
        <Plus className="size-3 text-primary-400" />
      </div>

      <div className="mt-1 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto noscrollbar">
        {PROJECTS.map(({ name, icon: Icon, tint, chats }) => (
          <div key={name}>
            <div className={cn("flex items-center gap-1.5 px-1.5 py-1", tint)}>
              <Icon className="size-3 shrink-0" />
              <span className="truncate text-[11px]">{name}</span>
            </div>
            {featuredChat?.project === name && (
              <div aria-current="page" className="glass-outline rounded-lg bg-primary-50/5 py-1.5 pr-2 pl-7 text-[11px] text-primary-50">
                {featuredChat.title}
              </div>
            )}
            {chats?.length === 0 && featuredChat?.project !== name && (
              <p className="py-1.5 pl-7 text-[9px] text-primary-400">No chats</p>
            )}
            {chats?.map((id) => {
              const title = CHAT_TABS.find((tab) => tab.id === id)!.title;
              const active = activeChat === id;
              const className = cn(
                "block w-full truncate rounded-lg py-1 pr-2 pl-7 text-left text-[10px] text-primary-50",
                active && "bg-primary-50/5 glass-outline",
                onOpenChat && "cursor-pointer transition-colors hover:bg-primary-50/5 focus-visible:outline-1 focus-visible:outline-primary-400",
              );

              if (!onOpenChat) return <div key={id} className={className}>{title}</div>;

              return (
                <button
                  key={id}
                  type="button"
                  aria-current={active ? "page" : undefined}
                  onClick={() => onOpenChat(id)}
                  className={className}
                >
                  {title}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
