"use client";

import { useState } from "react";
import { Sentry, Github, Branch, ChevronDown } from "@/components/icons";

type SentryIssue = {
  id: string;
  title: string;
  culprit: string;
  level: "error" | "warning" | "fatal";
  events: number;
  users: number;
  firstSeen: string;
  status: "unresolved" | "converting" | "converted";
  prNumber?: number;
  prBranch?: string;
};

const ISSUES: SentryIssue[] = [
  {
    id: "JINZO-1A",
    title: "TypeError: Cannot read properties of undefined (reading 'map')",
    culprit: "app/api/projects/[id]/route.ts",
    level: "fatal",
    events: 2847,
    users: 312,
    firstSeen: "2h ago",
    status: "unresolved",
    prNumber: 247,
    prBranch: "fix/project-map-undefined",
  },
  {
    id: "JINZO-1B",
    title: "RangeError: Maximum call stack size exceeded",
    culprit: "lib/parsers/recursive-resolve.ts",
    level: "error",
    events: 1203,
    users: 89,
    firstSeen: "5h ago",
    status: "unresolved",
    prNumber: 248,
    prBranch: "fix/recursive-resolve-overflow",
  },
  {
    id: "JINZO-1C",
    title: "UnhandledPromiseRejection: Connection timeout after 30000ms",
    culprit: "lib/db/connection-pool.ts",
    level: "error",
    events: 567,
    users: 45,
    firstSeen: "1d ago",
    status: "unresolved",
    prNumber: 249,
    prBranch: "fix/db-connection-timeout",
  },
  {
    id: "JINZO-1D",
    title: "Warning: Each child in a list should have a unique 'key' prop",
    culprit: "components/workspace/file-tree.tsx",
    level: "warning",
    events: 234,
    users: 178,
    firstSeen: "3d ago",
    status: "unresolved",
    prNumber: 250,
    prBranch: "fix/file-tree-key-prop",
  },
];

const levelColors: Record<string, string> = {
  fatal: "bg-red-900/60 text-red-300",
  error: "bg-orange-900/60 text-orange-300",
  warning: "bg-yellow-900/60 text-yellow-300",
};

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export function SentryIssues() {
  const [issues, setIssues] = useState<SentryIssue[]>(ISSUES);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleConvert = (id: string) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id ? { ...issue, status: "converting" as const } : issue
      )
    );

    setTimeout(() => {
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === id ? { ...issue, status: "converted" as const } : issue
        )
      );
    }, 1800);
  };

  const unresolvedCount = issues.filter((i) => i.status === "unresolved").length;

  return (
    <div className="bg-primary-950 border border-white/5 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <Sentry className="w-4 h-4 text-primary-400" />
          <span className="text-xs text-white font-medium">Unresolved Issues</span>
          <span className="text-primary-600 text-xs">·</span>
          <span className="text-primary-500 text-xs">{unresolvedCount} open</span>
        </div>
        <div className="flex items-center gap-1.5 text-primary-500 text-xs">
          <span>Priority</span>
          <ChevronDown width={12} height={12} className="text-primary-500" />
        </div>
      </div>

      {/* Issues list */}
      <div className="flex flex-col">
        {issues.map((issue, i) => {
          const isConverting = issue.status === "converting";
          const isConverted = issue.status === "converted";

          return (
            <div
              key={issue.id}
              className={`flex items-start gap-2 sm:gap-3 px-3 sm:px-5 py-3.5 transition-colors duration-150 cursor-pointer ${
                i < issues.length - 1 ? "border-b border-white/3" : ""
              } ${hoveredIndex === i ? "bg-primary-900/30" : ""}`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Level indicator */}
              <div className="flex flex-col items-center gap-1.5 shrink-0 pt-0.5">
                <Sentry className={`w-3.5 h-3.5 ${
                  issue.level === "fatal" ? "text-red-400" : issue.level === "error" ? "text-orange-400" : "text-yellow-400"
                }`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${levelColors[issue.level]}`}>
                    {issue.level.charAt(0).toUpperCase() + issue.level.slice(1)}
                  </span>
                  <span className="text-[11px] text-primary-600 font-mono">{issue.id}</span>
                  <span className="text-primary-600 text-[11px] hidden sm:inline">·</span>
                  <span className="text-primary-500 text-[11px] hidden sm:inline">{issue.firstSeen}</span>
                </div>
                <p className={`text-xs font-medium truncate ${isConverted ? "text-primary-600 line-through" : "text-white"}`}>
                  {issue.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] text-primary-600 font-mono truncate">{issue.culprit}</span>
                  <div className="hidden sm:flex items-center gap-2 text-[11px] text-primary-500 shrink-0">
                    <span>{formatNumber(issue.events)} events</span>
                    <span className="text-primary-600">·</span>
                    <span>{issue.users} users</span>
                  </div>
                </div>

                {/* Converted branch info */}
                {isConverted && (
                  <div className="flex items-center gap-1.5 mt-2 text-[11px]">
                    <Branch className="w-3 h-3 text-green-400" />
                    <span className="font-mono text-green-400/70">{issue.prBranch}</span>
                    <span className="text-primary-600">→</span>
                    <span className="font-mono text-primary-500">main</span>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="shrink-0 pt-0.5">
                {isConverted ? (
                  <div className="flex items-center gap-1.5 text-[11px] text-green-300 bg-green-900/60 rounded-full px-2.5 py-1">
                    <Github className="w-3 h-3" />
                    <span>PR #{issue.prNumber}</span>
                  </div>
                ) : isConverting ? (
                  <div className="flex items-center gap-1.5 text-[11px] text-primary-400 bg-primary-900/60 rounded-full px-2.5 py-1">
                    <div className="w-3 h-3 border border-primary-500 border-t-white rounded-full animate-spin" />
                    <span>Fixing...</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleConvert(issue.id)}
                    className={`flex items-center gap-1.5 text-[11px] text-primary-300 bg-primary-900/60 rounded-full px-2.5 py-1 cursor-pointer hover:bg-primary-800/60 transition-colors ${
                      hoveredIndex === i ? "opacity-100" : "opacity-60"
                    }`}
                  >
                    <span>Fix the issue</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
