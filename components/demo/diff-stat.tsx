import { cn } from "@/lib/utils";

/** The app's diff colors (features/workspace/lib/severity.ts), dark half. */
export const ADDED_TEXT = "text-green-400";
export const REMOVED_TEXT = "text-red-400";
/** `--color-success` from the app's theme. */
export const SUCCESS_TEXT = "text-[#22C55E]";

/** `+n −n` changeset summary, shown on workspace rows and panel rows alike. */
export function DiffStat({
  additions,
  deletions,
  className,
}: {
  additions: number;
  deletions: number;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-1 font-medium", className)}>
      <span className={ADDED_TEXT}>+{additions}</span>
      <span className={REMOVED_TEXT}>-{deletions}</span>
    </span>
  );
}
