"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Renders a fixed-size design at whatever width it is given.
 *
 * The window mockup is laid out at one size — 190px sidebar, 10px labels, a
 * 230px panel — and those numbers are the design, not a starting point for
 * reflow. So instead of rewriting the layout per breakpoint, the whole thing
 * is drawn at its design size and scaled, the way a screenshot would be.
 */
export function ScaleToFit({
  designWidth,
  designHeight,
  className,
  children,
}: {
  designWidth: number;
  designHeight: number;
  className?: string;
  children: React.ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    // Set before the first paint, then keep it in step with the container.
    setScale(frame.clientWidth / designWidth);

    const observer = new ResizeObserver(() => {
      setScale(frame.clientWidth / designWidth);
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, [designWidth]);

  return (
    <div
      ref={frameRef}
      className={cn("relative w-full overflow-hidden", className)}
      style={{ aspectRatio: `${designWidth} / ${designHeight}` }}
    >
      <div
        style={{
          width: designWidth,
          height: designHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
