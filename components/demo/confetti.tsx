"use client";

import { useEffect, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Raycast-style confetti: each burst fires from both bottom corners up toward
 * the middle, and the pieces tumble and flutter as they fall. Drawn on one
 * canvas that fills its parent; the loop runs only while pieces are alive.
 */

export type ConfettiHandle = { burst: () => void };

const COLORS = ["#ff5f6d", "#ffc53d", "#36cfc9", "#4d96ff", "#9b6dff", "#ff8a3d", "#ff6fb5", "#7bd88f"];
/** Pieces per corner, per burst. */
const PER_SIDE = 70;
/** How long a piece lives, in frames at 60fps. */
const LIFE = 210;

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  flip: number;
  flipSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  width: number;
  height: number;
  color: string;
  age: number;
};

const random = (min: number, max: number) => min + Math.random() * (max - min);

export function Confetti({ ref, className }: { ref?: React.Ref<ConfettiHandle>; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pieces = useRef<Piece[]>([]);
  const frame = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Sharp on retina: the backing store follows the CSS size times the pixel ratio.
    const fit = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(canvas.clientWidth * ratio);
      canvas.height = Math.round(canvas.clientHeight * ratio);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, []);

  useImperativeHandle(ref, () => {
    let last = 0;

    const tick = (time: number) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) return;
      // Steps are in 60fps frames, so speed doesn't depend on the display's rate.
      const step = last ? Math.min((time - last) / (1000 / 60), 3) : 1;
      last = time;
      const scale = canvas.height / 600;
      const gravity = 0.36 * scale;

      context.clearRect(0, 0, canvas.width, canvas.height);
      pieces.current = pieces.current.filter((piece) => piece.age < LIFE);
      for (const piece of pieces.current) {
        piece.age += step;
        piece.vx *= Math.pow(0.985, step);
        piece.vy = Math.min(piece.vy * Math.pow(0.985, step) + gravity * step, 3.2 * scale);
        piece.wobble += piece.wobbleSpeed * step;
        piece.x += (piece.vx + Math.sin(piece.wobble) * 0.8 * scale) * step;
        piece.y += piece.vy * step;
        piece.angle += piece.spin * step;
        piece.flip += piece.flipSpeed * step;

        const fade = Math.min(1, (LIFE - piece.age) / (LIFE * 0.3));
        context.save();
        context.globalAlpha = fade;
        context.translate(piece.x, piece.y);
        context.rotate(piece.angle);
        // Flipping over: the piece narrows to an edge and back.
        context.scale(1, Math.cos(piece.flip));
        context.fillStyle = piece.color;
        context.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
        context.restore();
      }

      if (pieces.current.length > 0) {
        frame.current = requestAnimationFrame(tick);
      } else {
        frame.current = 0;
        last = 0;
      }
    };

    return {
      burst() {
        const canvas = canvasRef.current;
        if (!canvas || canvas.width === 0) return;
        const scale = canvas.height / 600;
        for (const side of [-1, 1] as const) {
          for (let i = 0; i < PER_SIDE; i++) {
            // From a bottom corner, up and in at 45–80°.
            const angle = random(45, 80) * (Math.PI / 180);
            const speed = random(15, 25) * scale;
            pieces.current.push({
              x: side === -1 ? random(-10, 20) * scale : canvas.width - random(-10, 20) * scale,
              y: canvas.height + random(0, 20) * scale,
              vx: -side * Math.cos(angle) * speed,
              vy: -Math.sin(angle) * speed,
              angle: random(0, Math.PI * 2),
              spin: random(-0.2, 0.2),
              flip: random(0, Math.PI * 2),
              flipSpeed: random(0.08, 0.22),
              wobble: random(0, Math.PI * 2),
              wobbleSpeed: random(0.05, 0.12),
              width: random(6, 11) * scale,
              height: random(3, 6) * scale,
              color: COLORS[Math.floor(Math.random() * COLORS.length)],
              age: 0,
            });
          }
        }
        if (!frame.current) frame.current = requestAnimationFrame(tick);
      },
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={cn("pointer-events-none size-full", className)} />;
}
