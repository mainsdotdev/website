"use client";

import { useState } from "react";
import StatusInProgress from "@/components/icons/status-in-progress";
import StatusCanceled from "@/components/icons/status-canceled";
import StatusDone from "@/components/icons/status-done";
import StatusTodo from "@/components/icons/status-todo";

type StatusType = "warning" | "error" | "success" | "pending";

type Workspace = {
  owner: string;
  repo: string;
  icon: string;
  iconColor: string;
  branch: string;
  status: StatusType;
  timeAgo: string;
  additions?: number;
  deletions?: number;
};

const WORKSPACES: Workspace[] = [
  {
    owner: "OkanBilal",
    repo: "true-laurel",
    icon: "T",
    iconColor: "border border-primary-700 text-primary-400",
    branch: "cherry-n236",
    status: "warning",
    timeAgo: "6h ago",
    additions: 1222,
    deletions: 516,
  },
  {
    owner: "OkanBilal",
    repo: "jinzo",
    icon: "J",
    iconColor: "bg-indigo-900/60 text-indigo-400",
    branch: "orange-21dz",
    status: "warning",
    timeAgo: "6h ago",
    additions: 3,
  },
  {
    owner: "OkanBilal",
    repo: "true-laurel",
    icon: "T",
    iconColor: "border border-primary-700 text-primary-400",
    branch: "avocado-jkpu",
    status: "error",
    timeAgo: "6h ago",
  },
  {
    owner: "OkanBilal",
    repo: "jinzo-docs",
    icon: "J",
    iconColor: "bg-indigo-900/60 text-indigo-400",
    branch: "banana-1o5n",
    status: "pending",
    timeAgo: "7h ago",
  },
  {
    owner: "OkanBilal",
    repo: "true-laurel",
    icon: "T",
    iconColor: "border border-primary-700 text-primary-400",
    branch: "mango-ze73",
    status: "error",
    timeAgo: "20h ago",
  },
  {
    owner: "OkanBilal",
    repo: "true-laurel",
    icon: "T",
    iconColor: "border border-primary-700 text-primary-400",
    branch: "papaya-vbpu",
    status: "success",
    timeAgo: "20h ago",
  },
];

const statusComponents: Record<StatusType, { color: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> }> = {
  warning: { color: "text-yellow-500", Icon: StatusInProgress },
  error: { color: "text-red-500", Icon: StatusCanceled },
  success: { color: "text-indigo-500", Icon: StatusDone },
  pending: { color: "text-primary-500", Icon: StatusTodo },
};

function StatusIcon({ status }: { status: StatusType }) {
  const { color, Icon } = statusComponents[status];
  return <Icon className={`${color} w-3 h-3`} />;
}

export function WorkspaceList() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden text-sm select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-2.5 py-2.5  mt-2 rounded-xl bg-primary-900/60 shrink-0">
        <div className="flex items-center gap-2 text-primary-300">
          <span className="text-sm">+</span>
          <span className=" text-white text-xs">Add Repository</span>
        </div>
        <div className="flex items-center gap-1 text-primary-500 text-xs">
          <kbd className=" text-primary-400 font-sans text-[10px]">⌘</kbd>
          <kbd className=" text-primary-400 font-sans text-[10px]">N</kbd>
        </div>
      </div>

      {/* Workspaces header */}
      <div className="flex items-center justify-between px-2.5 py-2.5 -mb-2 shrink-0">
        <span className="text-primary-400 text-xs ">Workspaces</span>
        <div className="flex items-center gap-2 text-primary-500">

          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
      </div>

      {/* Workspace list - scrollable */}
      <div className="flex flex-col overflow-y-auto pt-3 min-h-0 flex-1">
        {WORKSPACES.map((ws, i) => (
          <div
            key={`${ws.repo}-${ws.branch}`}
            className={`flex items-start gap-3 px-2 py-2.5 rounded-xl transition-colors duration-150 cursor-pointer ${
              hoveredIndex === i ? "bg-primary-900/50" : ""
            }`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Icon + Status stacked */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div className={`w-4 h-4 rounded-[5px] flex items-center justify-center text-[8px] border border-primary-700 text-primary-400 `}>
                {ws.icon}
              </div>
              <StatusIcon status={ws.status} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-white  text-xs truncate">
                  {ws.owner}/{ws.repo}
                </span>
                {(ws.additions || ws.deletions) && (
                  <div className="flex items-center gap-1 font-mono text-[11px] ml-2 shrink-0">
                    {ws.additions && (
                      <span className="text-green-500">+{ws.additions}</span>
                    )}
                    {ws.deletions && (
                      <span className="text-red-500">-{ws.deletions}</span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-primary-500 text-xs">
                  {ws.branch}
                </span>
                <span className="text-primary-600 text-xs">·</span>
                <span className="text-primary-500 text-xs">{ws.timeAgo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
