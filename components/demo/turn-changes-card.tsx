"use client";

import { useState } from "react";
import { ADDED_TEXT, REMOVED_TEXT } from "@/components/demo/diff-stat";
import { Diff, React as ReactFileIcon, Typescript, Undo } from "@/components/icons";

export type TurnFile = { path: string; additions: number; deletions: number };

/** The app shows this many files before "Show N more files". */
const COLLAPSED_FILE_COUNT = 2;

function splitPath(path: string) {
  const slash = path.lastIndexOf("/");
  return { dir: path.slice(0, slash + 1), name: path.slice(slash + 1) };
}

/** Unlike `DiffStat`, the card spells out a side with nothing to report. */
function LineCounts({ additions, deletions }: { additions: number; deletions: number }) {
  return (
    <span className="shrink-0 tabular-nums">
      <span className={ADDED_TEXT}>+{additions}</span>{" "}
      <span className={REMOVED_TEXT}>-{deletions}</span>
    </span>
  );
}

function FileIcon({ name }: { name: string }) {
  return name.endsWith(".tsx") ? (
    <ReactFileIcon className="size-3.5 shrink-0 text-sky-400" />
  ) : (
    <Typescript className="size-3.5 shrink-0 text-blue-400" />
  );
}

/**
 * The transcript's "Edited N files" card, after the app's `TurnChangesCard`:
 * totals and Undo / Review up top, the first files below, and the rest behind
 * "Show N more files". Undo and Review are drawn but do nothing here.
 */
export function TurnChangesCard({ files }: { files: TurnFile[] }) {
  const [expanded, setExpanded] = useState(false);
  const additions = files.reduce((sum, file) => sum + file.additions, 0);
  const deletions = files.reduce((sum, file) => sum + file.deletions, 0);
  const visibleFiles = expanded ? files : files.slice(0, COLLAPSED_FILE_COUNT);
  const hiddenFileCount = files.length - COLLAPSED_FILE_COUNT;

  return (
    <div className="overflow-hidden rounded-2xl">
      <div className="flex items-center gap-2.5 rounded-t-2xl px-2.5 py-2 glass-card">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-(--demo-chrome)">
          <Diff className="size-3.5 text-primary-400" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[10px] font-medium text-primary-50">
            Edited {files.length} files
          </div>
          <div className="text-[9px]">
            <LineCounts additions={additions} deletions={deletions} />
          </div>
        </div>
        <span className="flex items-center gap-1 px-1.5 text-[10px] text-primary-200">
          Undo
          <Undo className="size-3" />
        </span>
        <span className="rounded-lg px-2.5 py-1 text-[9px] font-medium text-primary-50 glass-primary">
          Review
        </span>
      </div>

      <div className="rounded-b-2xl border-x border-b border-primary-50/10">
        {visibleFiles.map((file) => {
          const { dir, name } = splitPath(file.path);
          return (
            <div key={file.path} className="flex items-center gap-2 px-2.5 py-1.5 text-[10px]">
              <FileIcon name={name} />
              <span className="min-w-0 flex-1 truncate text-primary-100">
                <span className="opacity-60">{dir}</span>
                {name}
              </span>
              <span className="text-[9px]">
                <LineCounts additions={file.additions} deletions={file.deletions} />
              </span>
            </div>
          );
        })}
        {hiddenFileCount > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            className="w-full cursor-pointer border-t border-primary-50/10 px-2.5 py-1.5 text-left text-[9px] text-primary-200 transition-colors hover:bg-primary-50/5"
          >
            {expanded ? "Show less" : `Show ${hiddenFileCount} more files`}
          </button>
        )}
      </div>
    </div>
  );
}
