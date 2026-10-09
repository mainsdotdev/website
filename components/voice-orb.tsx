"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  createVoiceOrbRenderer,
  readVoiceOrbPalette,
  type VoiceOrbLevels,
  type VoiceOrbStyle,
} from "@/lib/voice-orb-renderer";
import { cn } from "@/lib/utils";

/** How fast each style's surface flows, the app's `ORB_FLOW_SPEED`. */
const ORB_FLOW_SPEED: Record<VoiceOrbStyle, number> = { cloud: 1, sphere: 2, aurora: 2.4 };

const isOrbStyle = (value: string | undefined): value is VoiceOrbStyle =>
  value === "cloud" || value === "sphere" || value === "aurora";

/**
 * Stands in for a live call without asking for a microphone: short, uneven
 * phrases from the agent, with quiet gaps between them. The renderer samples
 * it on its own frame loop.
 */
export function ambientVoiceLevels(timeMs: number): VoiceOrbLevels {
  const time = timeMs / 1000;
  const phrase = Math.pow(Math.max(0, Math.sin(time * 1.35)), 2.5);
  return { input: 0, output: 0.06 + phrase * (0.3 + 0.12 * Math.sin(time * 8) ** 2) };
}

/**
 * The desktop app's voice orb (`features/workspace/components/voice-orb.tsx`),
 * Sphere unless `orbStyle` says otherwise. Colours come from the
 * `--color-voice-orb-*` tokens on `.voice-orb`; the static CSS sphere
 * underneath shows through with reduced motion, without WebGL, and before the
 * first frame.
 *
 * `getLevels` must be stable: a new function restarts the renderer. A new
 * `orbStyle` doesn't: like the app, it only updates the shader's uniform, so
 * the surface keeps flowing through the switch.
 */
export function VoiceOrb({
  getLevels = ambientVoiceLevels,
  orbStyle = "sphere",
  className,
}: {
  getLevels?: (timeMs: number) => VoiceOrbLevels;
  orbStyle?: VoiceOrbStyle;
  className?: string;
}) {
  const orbRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const orb = orbRef.current;
    const canvas = canvasRef.current;
    if (!orb || !canvas || reducedMotion) return;

    let renderer: ReturnType<typeof createVoiceOrbRenderer>;
    let frame: number | undefined;
    let previousTime: number | undefined;
    let flow = 0;
    let visible = true;
    let lost = false;
    let disposed = false;
    // Read from the element, so a style change reaches the running loop.
    const currentStyle = (): VoiceOrbStyle => {
      const value = orb!.dataset.orbStyle;
      return isOrbStyle(value) ? value : "sphere";
    };

    function pause() {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
      previousTime = undefined;
    }
    function draw(time: number) {
      frame = undefined;
      if (disposed || lost || !visible || document.hidden || !renderer) return;
      const elapsed = previousTime === undefined ? 0 : Math.min(0.05, (time - previousTime) / 1000);
      previousTime = time;
      const levels = getLevels(time);
      // Integrate speed so a change in level cannot jump the surface's position.
      flow += elapsed * (0.4 + Math.max(levels.input, levels.output) * 4.2) * ORB_FLOW_SPEED[currentStyle()];
      renderer.draw(flow, levels);
      canvas!.style.opacity = "1";
      frame = requestAnimationFrame(draw);
    }
    function resume() {
      if (disposed || lost || !visible || document.hidden || !renderer || frame !== undefined) return;
      frame = requestAnimationFrame(draw);
    }
    function resize() {
      // The visual size, so a mockup scaled by a transform still renders sharp.
      const size = orb!.getBoundingClientRect().width;
      const pixels = Math.min(256, Math.max(1, Math.round(size * Math.min(window.devicePixelRatio || 1, 2))));
      canvas!.width = canvas!.height = pixels;
    }
    function initialize() {
      const palette = readVoiceOrbPalette(orb!);
      if (!palette) return;
      renderer = createVoiceOrbRenderer(canvas!, palette, currentStyle());
      resize();
      resume();
    }
    function onVisibility() {
      if (document.hidden) pause();
      else resume();
    }
    function onContextLost(event: Event) {
      event.preventDefault();
      lost = true;
      pause();
      renderer?.dispose();
      renderer = undefined;
      canvas!.style.opacity = "0";
    }
    function onContextRestored() {
      lost = false;
      initialize();
    }

    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    document.addEventListener("visibilitychange", onVisibility);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(orb);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) resume();
      else pause();
    });
    intersectionObserver.observe(orb);
    const styleObserver = new MutationObserver(() => renderer?.setStyle(currentStyle()));
    styleObserver.observe(orb, { attributes: true, attributeFilter: ["data-orb-style"] });
    initialize();

    return () => {
      disposed = true;
      pause();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      styleObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      renderer?.dispose();
      canvas.style.opacity = "0";
    };
  }, [getLevels, reducedMotion]);

  return (
    <span
      ref={orbRef}
      aria-hidden="true"
      data-orb-style={orbStyle}
      className={cn("voice-orb relative block size-24 shrink-0 overflow-hidden rounded-full", className)}
    >
      <canvas ref={canvasRef} className="relative block size-full" style={{ opacity: 0 }} />
    </span>
  );
}
