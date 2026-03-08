"use client";

import { useState } from "react";

type LabelType = "enhancement" | "bug" | "documentation";

type Issue = {
  title: string;
  labels: LabelType[];
};

const ISSUES: Issue[] = [
  { title: "Landing Page", labels: ["enhancement"] },
  { title: "Create Feed Page Integrating Data fro…", labels: ["enhancement"] },
  { title: "[Epic] Functionality Enhancements and…", labels: ["enhancement"] },
  { title: "Task Management System", labels: ["enhancement"] },
  { title: "Workflow Automation Implementation", labels: ["enhancement"] },
  { title: "Voice Assistant Support", labels: ["enhancement"] },
  { title: "Performance Optimization Sprint", labels: ["enhancement"] },
  { title: "API Rate Limiting & Caching", labels: ["bug"] },
  { title: "User Onboarding Flow", labels: ["enhancement"] },
  { title: "Dashboard Analytics Refactor", labels: ["enhancement"] },
];

const labelColors: Record<LabelType, string> = {
  enhancement: "bg-blue-900/60 text-blue-300",
  bug: "bg-red-900/60 text-red-300",
  documentation: "bg-purple-900/60 text-purple-300",
};

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.607.069-.607 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

export function IssuesList() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="w-full h-full flex flex-col mt-4 overflow-hidden text-sm select-none">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between bg-primary-50/5 px-2 py-1.5 rounded-lg shrink-0 w-full text-left cursor-pointer hover:bg-primary-900/30 transition-colors"
      >
        <div className="flex items-center gap-2 ">
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            className={`text-primary-400 transition-transform duration-200 ${expanded ? "rotate-0" : "-rotate-90"}`}
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
              <GitHubIcon className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />

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
