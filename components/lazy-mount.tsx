"use client";

import type { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

/**
 * Defers mounting its children until they are close to the viewport, so the
 * chunks behind `next/dynamic` children stay out of the initial page load.
 * `placeholderClassName` reserves the space until then to avoid layout shift.
 */
export function LazyMount({
  children,
  className,
  placeholderClassName,
}: {
  children: ReactNode;
  className?: string;
  placeholderClassName?: string;
}) {
  const { ref, visible } = useInView(0, "400px");

  return (
    <div ref={ref} className={cn(className, !visible && placeholderClassName)}>
      {visible ? children : null}
    </div>
  );
}
