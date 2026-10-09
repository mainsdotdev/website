import { BRIDGE_LANES } from "@/components/bridge-mark";
import { cn } from "@/lib/utils";

/** Static versions of the hero's lanes, converging at the canvas center. */
export function BridgeBackdrop({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-48 67 744 400.8"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth={0.75}
      className={cn("pointer-events-none absolute inset-0 h-full w-full text-primary-50/15", className)}
      style={{
        maskImage:
          "radial-gradient(ellipse 30% 80% at 50% 50%, rgb(0 0 0 / 20%), #000 100%)",
      }}
    >
      {BRIDGE_LANES.map((lane) => (
        <path key={lane.path} d={lane.path} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}
