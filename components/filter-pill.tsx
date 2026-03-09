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
        "px-4 py-2 rounded-full text-sm font-medium transition-all",
        isActive
          ? "bg-white text-black"
          : "bg-primary-800 text-primary-300 hover:bg-primary-700",
        className
      )}
    >
      {label}
    </button>
  );
}
