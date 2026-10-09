import { cn } from "@/lib/utils";

/**
 * A title-bar tab following the app's `BaseTab`. Active tabs merge into the
 * content surface; later tabs flare out on both sides. Passing onClick makes
 * it an interactive button, so mockups can share the same tab treatment.
 */
export function WindowTab({
  icon,
  title,
  active = true,
  showLeftFlare = false,
  onClick,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  active?: boolean;
  showLeftFlare?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      aria-pressed={onClick ? active : undefined}
      className={cn(
        "relative flex w-40 min-w-0 items-center gap-1.5 rounded-t-xl py-1.5 pr-5 pl-2.5 text-left",
        active
          ? "bg-(--demo-content) text-primary-200"
          : "text-primary-400 hover:text-primary-200",
        onClick && "cursor-pointer transition-colors motion-reduce:transition-none",
        className
      )}
      style={active ? { boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--color-primary) 20%, transparent)" } : undefined}
    >
      {icon}
      <span className="truncate text-[10px] font-medium tracking-tight">{title}</span>
      {active && showLeftFlare && (
        <span
          aria-hidden
          className="absolute -left-2 bottom-0 size-2"
          style={{ background: "radial-gradient(circle at top left, transparent 8px, var(--demo-content) 8px)" }}
        />
      )}
      {active && (
        <span
          aria-hidden
          className="absolute -right-2 bottom-0 size-2"
          style={{ background: "radial-gradient(circle at top right, transparent 8px, var(--demo-content) 8px)" }}
        />
      )}
    </Tag>
  );
}
