import { cn } from "@/lib/utils";

/**
 * An active title-bar tab, following the app's `BaseTab`: painted in the
 * content colour with only its top corners rounded, then flared back out
 * with an inverted corner so it reads as merging into the surface below.
 */
export function WindowTab({
  icon,
  title,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex w-40 min-w-0 items-center gap-1.5 rounded-t-xl bg-(--demo-content) py-1.5 pr-5 pl-2.5",
        className
      )}
      style={{ boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--color-primary) 20%, transparent)" }}
    >
      {icon}
      <span className="truncate text-[10px] font-medium tracking-tight text-primary-200">{title}</span>
      <span
        aria-hidden
        className="absolute -right-2 bottom-0 size-2"
        style={{ background: "radial-gradient(circle at top right, transparent 8px, var(--demo-content) 8px)" }}
      />
    </div>
  );
}
