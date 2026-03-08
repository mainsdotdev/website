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
        "bg-white/90 text-gray-800 font-mono text-sm font-medium",
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
