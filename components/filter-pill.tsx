import { cn } from "@/lib/utils";

type FilterPillProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
};

export function FilterPill({ label, isActive, onClick, className }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-2xl text-sm font-medium transition-all glass-outline",
        isActive
          ? "bg-primary-900/20 text-primary-50"
          : "bg-primary-50/10 text-primary-50 hover:bg-primary-900/10",
        className
      )}
    >
      {label}
    </button>
  );
}
