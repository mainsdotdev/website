import { cn } from "@/lib/utils";

type KeyboardKeyProps = {
  character: string;
  isPressed: boolean;
  className?: string;
};

export function KeyboardKey({
  character,
  isPressed,
  className,
}: KeyboardKeyProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-md transition-all duration-75",
        "bg-primary-100 text-primary-950 font-mono text-sm font-medium",
        "shadow-[0_2px_0_0_rgba(0,0,0,0.1)]",
        isPressed
          ? "scale-95 shadow-[0_0_0_0_rgba(0,0,0,0.1)] translate-y-0.5"
          : "scale-100",
        className
      )}
    >
      {character}
    </div>
  );
}
