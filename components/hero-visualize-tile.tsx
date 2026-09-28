"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { SynthDemoModal } from "@/components/synth-demo-modal";

export function HeroVisualizeTile({
  position,
  hoverClass,
}: {
  position: string;
  hoverClass: string;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => buttonRef.current?.focus());
  };

  return (
    <>
      <li className={`hero-release-tile relative z-0 w-44 shrink-0 lg:pointer-events-auto lg:absolute ${hoverClass} ${position}`}>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open interactive synthesizer demo"
          aria-describedby="hero-visualize-description"
          aria-haspopup="dialog"
          aria-expanded={open}
          className="group relative block w-full cursor-pointer rounded-sm text-left outline-none transition-transform duration-600 ease-spring hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-primary-50 focus-visible:ring-offset-4 focus-visible:ring-offset-primary-950 motion-reduce:transition-none"
        >
          <span className="relative block aspect-16/10 overflow-hidden rounded-sm shadow-[0_12px_28px_-16px_var(--demo-shadow)]">
            <Image
              src="/demos/field-synth-preview.png"
              alt="FIELD/01 synthesizer preview"
              fill
              sizes="(min-width: 1536px) 224px, (min-width: 1280px) 192px, 176px"
              className="object-cover transition-transform duration-600 ease-spring group-hover:scale-105"
            />
          </span>
          <span className="mt-2 block text-center font-mono text-[10px] text-primary-400">
            Visualize
          </span>
          <span
            id="hero-visualize-description"
            className="hero-tile-caption mt-1 block text-center text-[10px] leading-snug text-primary-300"
          >
            Play a synthesizer made in a Mains conversation.
          </span>
        </button>
      </li>

      {open && <SynthDemoModal onClose={close} triggerRef={buttonRef} />}
    </>
  );
}
