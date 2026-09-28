"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/**
 * Just past the `[data-closing]` transitions in `.hero-dialog` (they end by
 * 220ms), so the dialog has fully faded before it unmounts.
 */
const EXIT_MS = 240;

/**
 * The modal shell every hero card opens: a native `<dialog>` that grows out of
 * the card that opened it and shrinks back into it, locks the page's scroll
 * while open, and closes on Escape or a click outside. Mount it to open it; it
 * calls `onClose` once its exit has played, and the caller unmounts it then.
 */
export function HeroDialog({
  className,
  onClose,
  triggerRef,
  children,
  ...labelProps
}: {
  className?: string;
  onClose: () => void;
  /** The card that opened the dialog: it grows out of it and shrinks back in. */
  triggerRef?: RefObject<HTMLElement | null>;
  /** Gets `requestClose`, which plays the exit before `onClose` runs. */
  children: (requestClose: () => void) => ReactNode;
} & ({ "aria-label": string } | { "aria-labelledby": string })) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // The page scrolls on <html>, not <body>: the root's `overflow-x-hidden`
    // stops body's overflow from reaching the viewport, so locking body does
    // nothing. Pad by the scrollbar's width so hiding it doesn't nudge the page.
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousPaddingRight = root.style.paddingRight;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (scrollbarWidth > 0) root.style.paddingRight = `${scrollbarWidth}px`;
    if (!dialog.open) dialog.showModal();

    // Offsets rather than getBoundingClientRect: the opening transition has
    // already scaled the dialog, and the origin is measured from its
    // untransformed box.
    const trigger = triggerRef?.current?.getBoundingClientRect();
    if (trigger) {
      const x = trigger.left + trigger.width / 2 - dialog.offsetLeft;
      const y = trigger.top + trigger.height / 2 - dialog.offsetTop;
      dialog.style.transformOrigin = `${x}px ${y}px`;
    }

    return () => {
      if (dialog.open) dialog.close();
      root.style.overflow = previousOverflow;
      root.style.paddingRight = previousPaddingRight;
    };
  }, [triggerRef]);

  // Closing plays the exit first; the parent unmounts the dialog after it.
  useEffect(() => {
    if (!closing) return;
    const timeout = window.setTimeout(() => onCloseRef.current(), EXIT_MS);
    return () => window.clearTimeout(timeout);
  }, [closing]);

  const requestClose = () => setClosing(true);

  return createPortal(
    <dialog
      ref={dialogRef}
      {...labelProps}
      data-closing={closing || undefined}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onPointerDown={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom
        ) {
          requestClose();
        }
      }}
      className={cn("hero-dialog", className)}
    >
      {children(requestClose)}
    </dialog>,
    document.body
  );
}
