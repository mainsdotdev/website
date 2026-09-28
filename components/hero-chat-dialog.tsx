"use client";

import { useId, type ReactNode, type RefObject } from "react";
import { HeroDialog } from "@/components/hero-dialog";

/** A hero card's preview of a Mains conversation: the prompt, then the reply. */
export function HeroChatDialog({
  title,
  prompt,
  children,
  onClose,
  triggerRef,
}: {
  title: string;
  prompt: ReactNode;
  children: ReactNode;
  onClose: () => void;
  /** The card that opened the dialog: it grows out of it and shrinks back in. */
  triggerRef?: RefObject<HTMLElement | null>;
}) {
  const titleId = useId();

  return (
    <HeroDialog
      aria-labelledby={titleId}
      onClose={onClose}
      triggerRef={triggerRef}
      className="m-auto max-h-[92dvh] w-[min(96vw,1220px)] max-w-none overflow-y-auto rounded-3xl border border-primary-700/15 bg-primary-950 p-0 text-primary-50 shadow-[0_32px_100px_-24px_var(--demo-shadow)] backdrop:bg-primary-950/75 backdrop:backdrop-blur-sm"
    >
      {(requestClose) => (
        <>
          <h2 id={titleId} className="sr-only">{title}</h2>

          <div className="sticky top-0 z-10 flex justify-end bg-primary-950/95 px-4 pt-4 pb-2 sm:px-7">
            <button
              type="button"
              onClick={requestClose}
              aria-label="Close chat preview"
              className="flex size-7 items-center justify-center rounded-full  bg-primary-900 text-lg leading-none text-primary-300 transition-colors hover:bg-primary-800 hover:text-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className="mx-auto max-w-280 px-4 pb-6 sm:px-8 sm:pb-10">
            <div className="mb-8 flex justify-end sm:mb-10">
              <div className="max-w-[85%] rounded-2xl bg-primary-900 px-4 py-3 text-sm text-primary-50 sm:px-5 sm:text-base">
                {prompt}
              </div>
            </div>
            {children}
          </div>
        </>
      )}
    </HeroDialog>
  );
}
