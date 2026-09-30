"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { HeroChatDialog } from "@/components/hero-chat-dialog";
import coverImage from "@/public/demos/rails-architecture-cover.png";

function ActivityLine({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-xs text-primary-400 sm:text-sm">
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-primary-500" />
      <span>{children}</span>
      <span aria-hidden="true">›</span>
    </div>
  );
}

function PresentationConversation() {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="space-y-6 text-sm leading-relaxed text-primary-100 sm:space-y-7 sm:text-base">
      <p className="border-b border-primary-700/30 pb-3 text-xs text-primary-400 sm:text-sm">
        3 updates · 2 steps
      </p>

      <p>
        I’ll build a short deck that makes the Rails architecture easy to follow. The
        opening slide introduces the layers; the next traces one request through MVC
        and Active Record.
      </p>

      <ActivityLine>Outlined the slides and request lifecycle</ActivityLine>

      <p>
        The route selects a controller action, Active Record handles the data, and
        the view renders the response. I’m turning that path into a clean diagram
        that can be explained at a glance.
      </p>

      <ActivityLine>Created the deck and checked the slide layout</ActivityLine>

      <p>
        The presentation is ready to preview. It opens with the blue
        Rails architecture cover, then walks through the request lifecycle.
      </p>

      <div className="flex items-center gap-3 rounded-2xl border border-primary-700/25 bg-primary-900/65 p-3 sm:max-w-2xl sm:p-4">
        <span className="relative block size-12 shrink-0 overflow-hidden rounded-lg bg-primary-800 sm:size-14">
          <Image
            src={coverImage}
            alt=""
            fill
            sizes="56px"
            className="object-cover"
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium text-primary-50">Inside_Ruby_on_Rails.pptx</span>
          <span className="block text-xs text-primary-400 sm:text-sm">Presentation · sample preview</span>
        </span>
        <button
          type="button"
          onClick={() => setShowPreview((current) => !current)}
          aria-expanded={showPreview}
          aria-label={showPreview ? "Close presentation cover preview" : "Open presentation cover preview"}
          className="shrink-0 rounded-full bg-primary-800 px-3 py-1.5 text-xs font-medium text-primary-100 transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 sm:px-4 sm:text-sm"
        >
          {showPreview ? "Close" : "Open"}
        </button>
      </div>

      {showPreview && (
        <figure className="max-w-3xl overflow-hidden rounded-xl border border-primary-700/30 bg-primary-900">
          <Image
            src={coverImage}
            alt="Inside Ruby on Rails presentation cover with a diagram of its architecture"
            width={1672}
            height={941}
            sizes="(max-width: 768px) 100vw, 768px"
            className="h-auto w-full"
          />
          <figcaption className="px-3 py-2 text-xs text-primary-400">Slide 1</figcaption>
        </figure>
      )}
    </div>
  );
}

export function HeroPresentationTile({
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
          aria-label="Open Rails PowerPoint chat preview"
          aria-describedby="hero-presentation-description"
          aria-haspopup="dialog"
          aria-expanded={open}
          className="group relative block w-full cursor-pointer rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-primary-50 focus-visible:ring-offset-4 focus-visible:ring-offset-primary-950"
        >
          <span className="relative block aspect-1672/941 w-full overflow-hidden rounded-2xl bg-primary-900 shadow-[0_18px_40px_-15px_var(--demo-shadow)]">
            <Image
              src={coverImage}
              alt="Inside Ruby on Rails presentation cover"
              fill
              sizes="(min-width: 1536px) 256px, (min-width: 1280px) 224px, 208px"
              loading="eager"
              placeholder="blur"
              className="object-cover transition-transform duration-600 ease-spring group-hover:scale-105 motion-reduce:transition-none"
            />
          </span>
          <span className="mt-2 block text-center font-medium text-[12px] text-primary-400">
            Presentation
          </span>
          <span
            id="hero-presentation-description"
            className="hero-tile-caption mt-1 block text-center text-[11px] leading-snug text-primary-300"
          >
            Create a presentation in Mains.
          </span>
        </button>
      </li>

      {open && (
        <HeroChatDialog
          title="Rails PowerPoint in a Mains conversation"
          prompt={
            <>
              <span>Create a PowerPoint on Ruby on Rails architecture, MVC, Active Record, and the request lifecycle.</span>
              <span className="ml-2 inline-flex items-center gap-1 rounded-lg bg-primary-950 px-2 py-1 text-xs text-primary-200">
                <span aria-hidden="true">▣</span> Presentations
              </span>
            </>
          }
          onClose={close}
          triggerRef={buttonRef}
        >
          <PresentationConversation />
        </HeroChatDialog>
      )}
    </>
  );
}
