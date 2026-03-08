"use client";

import { useState } from "react";
import Typescript from "@/components/icons/typescript";
import ReactFileIcon from "@/components/icons/react";
import MarkdownIcon from "@/components/icons/markdown";
import { Json, Postcss } from "../icons";

type FileEntry = {
  name: string;
  type: "folder" | "file";
  icon?: "md" | "ts" | "json" | "postcss";
};

const FILE_TREE: FileEntry[] = [
  { name: "app", type: "folder" },
  { name: "components", type: "folder" },
  { name: "content", type: "folder" },
  { name: "hooks", type: "folder" },
  { name: "lib", type: "folder" },
  { name: "public", type: "folder" },
  { name: "styles", type: "folder" },
  { name: "BLOG_README.md", type: "file", icon: "md" },
  { name: "contentlayer.config.ts", type: "file", icon: "ts" },
  { name: "global.d.ts", type: "file", icon: "ts" },
  { name: "next.config.ts", type: "file", icon: "ts" },
  { name: "README.md", type: "file", icon: "md" },
  { name: "package.json", type: "file", icon: "json" },
  { name: "postcss.config.mjs", type: "file", icon: "postcss" },
];

type Tab = "files" | "changes" | "activity";

type ChangedFile = {
  name: string;
  dir: string;
  additions: number;
  deletions: number;
};

const CHANGED_FILES: ChangedFile[] = [
  { name: "page.tsx", dir: "app/(root)/blog/[slug]", additions: 2, deletions: 2 },
  { name: "page.tsx", dir: "app/(root)/blog", additions: 2, deletions: 2 },
  { name: "layout.tsx", dir: "app/(root)", additions: 1, deletions: 2 },
  { name: "page.tsx", dir: "app/(root)", additions: 12, deletions: 7 },
  { name: "changelog-card.tsx", dir: "components", additions: 8, deletions: 4 },
  { name: "footer.tsx", dir: "components", additions: 35, deletions: 27 },
  { name: "header.tsx", dir: "components", additions: 14, deletions: 9 },
  { name: "form.tsx", dir: "components", additions: 6, deletions: 3 },
];

type ActivityType = "commit" | "finding" | "description";

type ActivityEntry = {
  type: ActivityType;
  text: string;
  timeAgo: string;
};

const ACTIVITY_ENTRIES: ActivityEntry[] = [
  { type: "commit", text: "5 files changed", timeAgo: "20h ago" },
  { type: "finding", text: "Jinzo added 7 findings", timeAgo: "20h ago" },
  { type: "description", text: "Hero section redesign & use cases featured card…", timeAgo: "" },
  { type: "commit", text: "4 files changed", timeAgo: "21h ago" },
  { type: "commit", text: "2 files changed", timeAgo: "21h ago" },
  { type: "commit", text: "2 files changed", timeAgo: "21h ago" },
  { type: "finding", text: "Jinzo added 3 findings", timeAgo: "22h ago" },
  { type: "description", text: "Add missing isSupportedWorkProvider check to …", timeAgo: "" },
  { type: "commit", text: "1 file changed", timeAgo: "23h ago" },
  { type: "commit", text: "8 files changed", timeAgo: "1d ago" },
  { type: "finding", text: "Jinzo added 12 findings", timeAgo: "1d ago" },
  { type: "description", text: "Refactor auth flow and workspace sync logic…", timeAgo: "" },
  { type: "commit", text: "3 files changed", timeAgo: "2d ago" },
];

function FolderIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M2 5a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"
        fill="#F6C547"
      />
    </svg>
  );
}

function FileIcon({ icon }: { icon?: "md" | "ts" | "json" | "postcss" }) {
  if (icon === "md") {
    return <MarkdownIcon className="w-4.5 h-4.5 text-primary-400" />;
  }
  if (icon === "ts") {
    return <Typescript className="w-4.5 h-4.5 text-blue-400" />;
  }
  if (icon === "json") {
    return <Json className="w-4.5 h-4.5 text-green-400" />;
  }
  if (icon === "postcss") {
    return <Postcss className="w-4.5 h-4.5 text-purple-400" />;
  }
  return null;
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}



function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5L8 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

function GitBranchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 8v8M8 6h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FindingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

function DescriptionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 21a9 9 0 100-18 9 9 0 000 18z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 12h8M8 9h5M8 15h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ActivityIcon({ type, className }: { type: ActivityType; className?: string }) {
  switch (type) {
    case "commit":
      return <GitBranchIcon className={className} />;
    case "finding":
      return <FindingIcon className={className} />;
    case "description":
      return <DescriptionIcon className={className} />;
  }
}

export function FileExplorer() {
  const [activeTab, setActiveTab] = useState<Tab>("files");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "files", label: "Files" },
    { id: "changes", label: "Changes", badge: 8 },
    { id: "activity", label: "Activity" },
  ];

  return (
    <div className="w-full h-full flex flex-col overflow-hidden text-sm select-none">
      {/* Tabs */}
      <div className="flex items-center shrink-0 mx-2 mt-2 rounded-lg py-0.5 bg-primary-900/40 overflow-hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-2 py-1.25 text-center text-[11px]  transition-colors cursor-pointer rounded-lg ${
              activeTab === tab.id
                ? "text-white bg-primary-800/60"
                : "text-primary-500 hover:text-primary-300"
            }`}
          >
            {tab.label}
            {tab.badge != null && (
              <span className="ml-1 text-primary-500">({tab.badge})</span>
            )}
          </button>
        ))}
      </div>

      {/* Files tab */}
      {activeTab === "files" && (
        <div className="flex flex-col overflow-y-auto min-h-0 flex-1 py-2">
          {FILE_TREE.map((entry, i) => (
            <div
              key={entry.name}
              className={`flex items-center gap-2 px-2 py-1.25 transition-colors duration-150 cursor-pointer ${
                hoveredIndex === i ? "bg-primary-900/50 rounded-lg" : ""
              }`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {entry.type === "folder" ? (
                <>
                  <ChevronRight className="text-primary-600" />
                  <FolderIcon />
                </>
              ) : (
                <>
                  <div className="w-2" />
                  <FileIcon icon={entry.icon} />
                </>
              )}
              <span className="text-primary-200 text-xs">{entry.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Changes tab */}
      {activeTab === "changes" && (
        <div className="flex flex-col overflow-y-auto min-h-0 flex-1">
          {/* Action buttons */}
          <div className="flex items-center gap-2 px-2 py-2 shrink-0">
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-primary-900/60 text-primary-300 text-[11px] font-medium hover:bg-primary-900 transition-colors cursor-pointer">
              <SparklesIcon className="text-primary-400" />
              Review Changes
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-primary-900/60 text-primary-300 text-[11px] font-medium hover:bg-primary-900 transition-colors cursor-pointer">
              <svg className="text-primary-400 rotate-90" width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.2" />
                <path d="M8 1v4M8 11v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              Commit Changes
            </button>
          </div>

          {/* Summary */}
          <div className="flex items-center justify-between px-4 py-2 text-[11px] text-primary-500 shrink-0">
            <span className="text-primary-400">34 files changed</span>
            <div className="flex items-center gap-2">
              <span className="text-green-500">+1222</span>
              <span className="text-red-500">-516</span>
            </div>
          </div>

          {/* Changed files list */}
          <div className="flex flex-col overflow-y-auto min-h-0 flex-1">
            {CHANGED_FILES.map((file, i) => (
              <div
                key={`${file.dir}/${file.name}`}
                className={`flex items-center gap-3 px-4 py-1 transition-colors duration-150 cursor-pointer ${
                  hoveredIndex === i ? "bg-primary-900/50" : ""
                }`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <ReactFileIcon className="w-4 h-4 text-cyan-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-white text-xs font-medium block truncate">{file.name}</span>
                  <span className="text-primary-500 text-xs">{file.dir}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs shrink-0">
                  <span className="text-green-500">+{file.additions}</span>
                  <span className="text-red-500">-{file.deletions}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity tab */}
      {activeTab === "activity" && (
        <div className="flex flex-col overflow-y-auto min-h-0 flex-1 px-2 pt-2">
          {ACTIVITY_ENTRIES.map((entry, i) => (
            <div key={`${entry.type}-${i}`} className="flex">
              {/* Timeline column */}
              <div className="flex flex-col items-center w-6 shrink-0">
                {i > 0 && (
                  <div className="w-px h-2 bg-primary-800" />
                )}
                <div className="h-4 flex items-center">
                  <ActivityIcon type={entry.type} className="text-primary-500 shrink-0 " />
                </div>
                {i < ACTIVITY_ENTRIES.length - 1 && (
                  <div className="w-px flex-1 min-h-2 bg-primary-800" />
                )}
              </div>
              {/* Content */}
              <div
                className={`flex items-center gap-2 flex-1 min-w-0 ml-2 px-2 h-7 rounded-lg cursor-pointer transition-colors duration-150 ${
                  hoveredIndex === i ? "bg-primary-900/50" : ""
                }`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span className="text-primary-300 text-xs truncate flex-1">
                  <span className="font-medium">{entry.text}</span>
                  {entry.timeAgo && (
                    <span className="text-primary-600"> · {entry.timeAgo}</span>
                  )}
                </span>
                <ChevronRight className="text-primary-600 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
