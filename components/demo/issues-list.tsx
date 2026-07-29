"use client";

import { useState } from "react";
import { Github, Linear, Gitlab, ChevronDown } from "@/components/icons";

type LabelType = "feature" | "enhancement" | "bug" | "documentation";
type SourceType = "github" | "linear" | "gitlab";

type Issue = {
  title: string;
  labels: LabelType[];
  source: SourceType;
};

const ISSUES: Issue[] = [
  { title: "Implement multi-file diff viewer component", labels: ["feature"], source: "github" },
  { title: "Add WebSocket support for real-time updates", labels: ["feature"], source: "github" },
  { title: "Refactor AST parser to support TypeScript", labels: ["enhancement"], source: "linear" },
  { title: "Git merge conflict resolution UI", labels: ["feature"], source: "linear" },
  { title: "Fix race condition in concurrent file access", labels: ["bug"], source: "gitlab" },
  { title: "Add LSP integration for code intelligence", labels: ["feature"], source: "github" },
  { title: "Optimize tree-sitter parsing for large files", labels: ["enhancement"], source: "linear" },
  { title: "SSH tunnel drops connection after idle timeout", labels: ["bug"], source: "gitlab" },
  { title: "Implement workspace snapshot & restore", labels: ["feature"], source: "linear" },
  { title: "Add OpenAPI spec generation from routes", labels: ["enhancement"], source: "github" },
];

const labelColors: Record<LabelType, string> = {
  enhancement: "bg-blue-900/60 text-blue-300",
  feature: "bg-green-900/60 text-green-300",
  bug: "bg-red-900/60 text-red-300",
  documentation: "bg-purple-900/60 text-purple-300",
};

const sourceIcons: Record<SourceType, React.FC<{ className?: string }>> = {
  github: Github,
  linear: Linear,
  gitlab: Gitlab,
};

export function IssuesList() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="w-full h-full flex flex-col mt-4 overflow-hidden text-sm select-none">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between glass-button px-2 py-1.5 rounded-xl shrink-0 w-full text-left cursor-pointer hover:bg-primary-900/30 transition-colors"
      >
        <div className="flex items-center gap-2 ">
          <ChevronDown
            width={14}
            height={14}
            className={`text-primary-400 transition-transform duration-200 ${expanded ? "rotate-0" : "-rotate-90"}`}
          />
          <span className="font-medium text-xs text-white">Issues</span>
        </div>
        <span className="text-primary-500 text-xs">{ISSUES.length}</span>
      </button>

      {/* Issue list - scrollable */}
      {expanded && (
        <div className="flex flex-col pt-2 overflow-y-auto min-h-0 flex-1">
          {ISSUES.map((issue, i) => (
            <div
              key={issue.title}
              className={`flex items-start gap-3 px-2 py-2 rounded-xl transition-colors duration-150 cursor-pointer ${
                hoveredIndex === i ? "bg-primary-900/50" : ""
              }`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {(() => {
                const Icon = sourceIcons[issue.source];
                return <Icon className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />;
              })()}

              <div className="flex-1 min-w-0">
                <span className="text-white text-xs font-medium truncate block">
                  {issue.title}
                </span>
                <div className="flex items-center gap-1.5 mt-1.5">
                  {issue.labels.map((label) => (
                    <span
                      key={label}
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${labelColors[label]}`}
                    >
                      {label.charAt(0).toUpperCase() + label.slice(1)}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
