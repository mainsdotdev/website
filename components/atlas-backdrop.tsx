import { cn } from "@/lib/utils";
/** Static meridian lines, following the theme and fading into the page. */
export function AtlasBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-x-0 top-0 h-[64rem] overflow-hidden", className)}
      style={{ maskImage: "radial-gradient(ellipse 85% 80% at 50% 25%, #000 20%, transparent 85%)" }}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "radial-gradient(ellipse 60% 65% at 65% 15%, rgb(151 139 104 / 9%), transparent 75%)" }}
      />
      <div
        className="absolute inset-0 bg-primary-50/15"
        style={{
          maskImage: "url(/atlas-meridians.svg)",
          maskSize: "cover",
          maskPosition: "center top",
          maskRepeat: "no-repeat",
        }}
      />
    </div>
  );
}
