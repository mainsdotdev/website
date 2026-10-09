import { cn } from "@/lib/utils";

/**
 * The Atlas page's backdrop, after a survey map: topographic contour lines,
 * every fifth one heavier, as the developer page has its blueprint grid and
 * the Work page its dotted canvas.
 *
 * The lines are one static SVG (`public/atlas-topo.svg`, contours of a seeded
 * noise terrain) used as a mask over the text color, so they follow the
 * theme. A radial fade keeps them to the top of the page and off its edges.
 */
export function AtlasBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-x-0 top-0 h-[64rem]", className)}
      style={{ maskImage: "radial-gradient(ellipse 75% 70% at 50% 30%, #000 25%, transparent 80%)" }}
    >
      <div
        className="size-full bg-primary-50/15"
        style={{
          maskImage: "url(/atlas-topo.svg)",
          maskSize: "cover",
          maskPosition: "center top",
          maskRepeat: "no-repeat",
        }}
      />
    </div>
  );
}
