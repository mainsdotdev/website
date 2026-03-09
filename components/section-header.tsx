import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  title: string;
  description?: string;
  layout?: "row" | "column";
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function SectionHeader({
  title,
  description,
  layout = "row",
  className,
  titleClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        layout === "row"
          ? "flex flex-col md:flex-row md:items-start md:justify-between gap-6"
          : "flex flex-col gap-4",
        className
      )}
    >
      <h2
        className={cn(
          "text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-snug font-sans",
          titleClassName
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-sm text-neutral-400 leading-relaxed max-w-sm",
            layout === "row" && "md:pt-2",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
