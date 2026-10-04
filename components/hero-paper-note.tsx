"use client";

import { useState, type PointerEvent } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Attach } from "@/components/icons";
import releaseArtwork from "@/public/changelog/0-15/cover.webp";

// Homepage card for 0.15. The release note names Codex; the card stays generic.
const RELEASE_NOTE = {
  version: "0.15",
  title: "Talk it through",
  href: "/changelog#release-0-15",
  paragraphs: [
    "Talk out loud and steer it while it works.",
    "Open apps from the rail and review changes line by line.",
  ],
};

const backfaceStyle = {
  backfaceVisibility: "hidden" as const,
  WebkitBackfaceVisibility: "hidden" as const,
};

export function HeroPaperNote({
  position,
  hoverClass,
}: {
  position: string;
  hoverClass: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const reduceMotion = useReducedMotion();
  const tiltX = useSpring(0, { stiffness: 360, damping: 32 });
  const tiltY = useSpring(0, { stiffness: 360, damping: 32 });

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return;

    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - left) / width - 0.5;
    const y = (event.clientY - top) / height - 0.5;

    tiltX.set(-y * 10);
    tiltY.set(x * 12);
  }

  function resetTilt() {
    tiltX.set(0);
    tiltY.set(0);
  }

  return (
    <li className={`hero-release-tile relative z-0 w-60 shrink-0 lg:pointer-events-auto lg:absolute ${hoverClass} ${position}`}>
      <div className="relative aspect-5/4 perspective-midrange">
        <div
          aria-hidden
          className="absolute inset-0 translate-x-2 translate-y-2 -rotate-6 rounded-xl border border-primary-700/50 bg-primary-800 shadow-[0_18px_40px_-15px_var(--demo-shadow)]"
        />

        <motion.button
          type="button"
          aria-pressed={flipped}
          aria-label={
            flipped
              ? `Turn Mains ${RELEASE_NOTE.version} card back to its artwork`
              : `Turn Mains ${RELEASE_NOTE.version} card over to read release notes`
          }
          onClick={() => setFlipped((current) => !current)}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetTilt}
          onBlur={resetTilt}
          style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
          className="relative z-10 block h-full w-full cursor-pointer rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-primary-50 focus-visible:ring-offset-4 focus-visible:ring-offset-primary-950"
        >
          <motion.span
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 240, damping: 27, mass: 0.85 }
            }
            style={{ transformStyle: "preserve-3d" }}
            className="relative block h-full w-full"
          >
            <span
              style={backfaceStyle}
              className="absolute inset-0 flex flex-col overflow-hidden rounded-lg border border-primary-700/50 bg-primary-900 p-2 pb-0 shadow-[0_24px_50px_-18px_var(--demo-shadow)]"
            >
              <span className="block text-[8px]   text-primary-400">
                MAINS {RELEASE_NOTE.version} <span aria-hidden="true" className="mx-1 text-primary-500">·</span> NO. 015
              </span>
              <span className="mt-3.5 block  text-lg leading-[1.02] font-medium text-primary-50 xl:text-xl">
                {RELEASE_NOTE.title}
              </span>
              <span className="relative mx-1 mt-4 block min-h-0 flex-1 overflow-hidden rounded-t-lg">
                <Image
                  src={releaseArtwork}
                  alt={`Mains ${RELEASE_NOTE.version} release artwork`}
                  fill
                  sizes="(min-width: 1536px) 296px, (min-width: 1280px) 232px, (min-width: 1024px) 168px, 216px"
                  loading="eager"
                  placeholder="blur"
                  className="object-cover object-center"
                />
              </span>
            </span>

            <span
              style={{ ...backfaceStyle, transform: "rotateY(180deg)" }}
              className="absolute inset-0 flex flex-col rounded-lg border border-primary-700/50 bg-primary-900 p-3 text-primary-50 shadow-[0_24px_50px_-18px_var(--demo-shadow)] lg:p-2 xl:p-3"
            >
              <span className=" text-[9px]  text-primary-400 uppercase">
                Mains {RELEASE_NOTE.version} / release letter
              </span>
              <span className="mt-2 text-xl leading-none lg:text-base xl:text-xl">
                {RELEASE_NOTE.title}.
              </span>
              <span className="mt-2 flex flex-col gap-2">
                {RELEASE_NOTE.paragraphs.map((paragraph) => (
                  <span key={paragraph} className="block text-[12px] italic leading-normal text-primary-200 lg:text-[10px] xl:text-[12px]">
                    {paragraph}
                  </span>
                ))}
              </span>
              <span className="mt-auto pt-2 text-[9px] text-primary-400">
                Click to turn back ↶
              </span>
            </span>
          </motion.span>

          <Attach
            aria-hidden
            className="pointer-events-none absolute top-0 -right-5 z-20 size-10 -rotate-35 text-primary-300 drop-shadow-sm"
          />
        </motion.button>
      </div>

      <div className="hero-note-caption mt-3 text-center font-medium text-[12px] text-primary-400">
        {flipped ? (
          <Link
            href={RELEASE_NOTE.href}
            className="pointer-events-auto underline underline-offset-4 hover:text-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-50"
          >
            Read all {RELEASE_NOTE.version} notes {">"}
          </Link>
        ) : (
          <span>{RELEASE_NOTE.version} / turn over to read</span>
        )}
      </div>
    </li>
  );
}
