"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HeroChatDialog } from "@/components/hero-chat-dialog";
import { ImageGenerationLoader } from "@/components/image-generation-loader";
import { Gallery } from "./icons";

const MOSAIC_IMAGE = "/demos/earth-mosaic.png";
const IMAGE_REVEAL_DELAY_MS = 3_500;

function GeneratedImage() {
  const [delayComplete, setDelayComplete] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const ready = delayComplete && imageLoaded;

  useEffect(() => {
    const timeout = window.setTimeout(() => setDelayComplete(true), IMAGE_REVEAL_DELAY_MS);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div className="relative aspect-1672/941 w-full max-w-180">
      <figure
        aria-hidden={!ready}
        className={`relative size-full overflow-hidden rounded-2xl bg-primary-900 transition-opacity duration-500 motion-reduce:transition-none ${ready ? "opacity-100" : "opacity-0"}`}
      >
        <Image
          src={MOSAIC_IMAGE}
          alt="Generated ceramic mosaic of Earth from space with a spiral galaxy, stars, Saturn and the Moon"
          fill
          sizes="(max-width: 768px) 100vw, 720px"
          className="object-cover"
          onLoad={() => setImageLoaded(true)}
        />
      </figure>
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageGenerationLoader />
        </div>
      )}
    </div>
  );
}

export function HeroImageGenTile({
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
      <li className={`hero-release-tile relative z-0 w-52 shrink-0 lg:pointer-events-auto lg:absolute ${hoverClass} ${position}`}>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open image generation chat preview"
          aria-describedby="hero-image-gen-description"
          aria-haspopup="dialog"
          aria-expanded={open}
          className="group relative block w-full cursor-pointer rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-primary-50 focus-visible:ring-offset-4 focus-visible:ring-offset-primary-950"
        >
          <span className="block">
            <span className="relative block aspect-1672/941 w-full overflow-hidden rounded-xl ">
              <Image
                src={MOSAIC_IMAGE}
                alt="Ceramic mosaic of Earth viewed from space"
                fill
                sizes="(min-width: 1536px) 256px, (min-width: 1280px) 224px, 208px"
                className="object-cover transition-transform duration-600 ease-spring group-hover:scale-105"
              />
            </span>

            <span
              id="hero-image-gen-description"
              className="hero-tile-caption mt-2 block font-medium text-[12px] leading-snug text-primary-300"
            >
              Generate an image in Mains.
            </span>
          </span>
        </button>
      </li>

      {open && (
        <HeroChatDialog
          title="Image generation in a Mains conversation"
          prompt={
            <>
              <span>Create a ceramic mosaic of Earth from space, with stars and Saturn.</span>
              <span className="ml-2 inline-flex items-center gap-1 rounded-lg bg-primary-950 px-2 py-1 text-xs text-primary-200">
                <Gallery className="size-3"/> Image Gen
              </span>
            </>
          }
          onClose={close}
          triggerRef={buttonRef}
        >
          <GeneratedImage />
        </HeroChatDialog>
      )}
    </>
  );
}
