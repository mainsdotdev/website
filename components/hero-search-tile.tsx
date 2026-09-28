"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { HeroCommandMenu, type CommandMenuRelease } from "@/components/hero-command-menu";

export function HeroSearchTile({
  position,
  hoverClass,
  releases,
}: {
  position: string;
  hoverClass: string;
  releases: CommandMenuRelease[];
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
          aria-label="Open the search menu demo"
          aria-describedby="hero-search-description"
          aria-haspopup="dialog"
          aria-expanded={open}
          className="group relative block w-full cursor-pointer rounded-sm text-left outline-none transition-transform duration-600 ease-spring hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-primary-50 focus-visible:ring-offset-4 focus-visible:ring-offset-primary-950 motion-reduce:transition-none"
        >
          <span className="relative block aspect-[4/3] overflow-hidden rounded-sm shadow-[0_12px_28px_-16px_var(--demo-shadow)]">
            <Image
              src="/changelog/0-11/search-poster.webp"
              alt="Searching across Mains conversations"
              fill
              sizes="(min-width: 1536px) 224px, (min-width: 1280px) 192px, 176px"
              className="object-cover transition-transform duration-600 ease-spring group-hover:scale-105"
            />
          </span>
          <span className="mt-2 block text-center font-mono text-[10px] text-primary-400">
            0.11 / Search
          </span>
          <span
            id="hero-search-description"
            className="hero-tile-caption mt-1 block text-center text-[10px] leading-snug text-primary-300"
          >
            Search this site the way you search in Mains.
          </span>
        </button>
      </li>

      {open && <HeroCommandMenu releases={releases} onClose={close} triggerRef={buttonRef} />}
    </>
  );
}
