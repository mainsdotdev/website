"use client";

import { useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import { ArrowUp, Attach, Brain, Chat, Edit, Minus } from "@/components/icons";

/**
 * The app's floating chat (`floating-chat-overlay.tsx`), for mockups: a chat
 * card pinned to the bottom-right corner of whatever it floats over. Minimize
 * folds it into a round chat button in that corner; the button opens it again.
 *
 * Sizes are the app's, scaled to the mockups' ~0.6 design scale. The card
 * grows out of, and shrinks back into, its bottom-right corner on the app's
 * surface spring; the contents keep their full size throughout and are
 * clipped, so nothing reflows mid-animation.
 */

const CARD = { width: 330, height: 300, radius: 18 };
const BUTTON = 30;
const SURFACE_SPRING = { type: "spring", stiffness: 500, damping: 45, mass: 1 } as const;

export function FloatingChat({
  title,
  titleAccessory,
  above,
  children,
  composer,
}: {
  title: string;
  /**
   * Sits just above the chat, centred on it — over the card, or over the
   * button once minimized, following it as it folds.
   */
  above?: React.ReactNode;
  /** Beside the title — the app's send-target chevron, for one. */
  titleAccessory?: React.ReactNode;
  /** The transcript. */
  children: React.ReactNode;
  composer: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <MotionConfig reducedMotion="user">
      {/* Unclipped, so `above` can sit outside the card it rides on. */}
      <div className="pointer-events-none absolute right-2.5 bottom-2.5 z-10 flex flex-col items-center gap-2">
        {above && <div className="pointer-events-auto">{above}</div>}
        <motion.div
          initial={false}
          animate={
            open
              ? { width: CARD.width, height: CARD.height, borderRadius: CARD.radius }
              : { width: BUTTON, height: BUTTON, borderRadius: BUTTON / 2 }
          }
          transition={SURFACE_SPRING}
          className="pointer-events-auto relative overflow-hidden bg-(--demo-content) text-primary-100 shadow-[0_12px_32px_-12px_var(--demo-shadow)] glass-outline"
          style={{ transformOrigin: "bottom right" }}
        >
          <motion.div
            role="region"
            aria-label={title}
            aria-hidden={!open}
            inert={!open}
            initial={false}
            animate={{ opacity: open ? 1 : 0 }}
            transition={{ duration: open ? 0.2 : 0.1, delay: open ? 0.08 : 0 }}
            className="absolute right-0 bottom-0 flex flex-col"
            style={{ width: CARD.width, height: CARD.height }}
          >
            <div className="flex h-8 shrink-0 items-center gap-1.5 border-b border-primary-800/50 px-2.5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Minimize chat"
                className="flex size-5 cursor-pointer items-center justify-center rounded-md text-primary-300 transition-colors hover:bg-primary-800/40 hover:text-primary-50"
              >
                <Minus className="size-3" />
              </button>
              <span className="min-w-0 truncate text-[10px] font-medium text-primary-50">{title}</span>
              {titleAccessory}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-2.5 pt-2.5 noscrollbar">{children}</div>
            <div className="shrink-0 px-2 pt-1 pb-2">{composer}</div>
          </motion.div>

          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Show chat"
            aria-hidden={open}
            tabIndex={open ? -1 : 0}
            initial={false}
            animate={{ opacity: open ? 0 : 1 }}
            transition={{ duration: open ? 0.08 : 0.18, delay: open ? 0 : 0.1 }}
            className="absolute right-0 bottom-0 flex cursor-pointer items-center justify-center rounded-full text-primary-100 hover:bg-primary-800/40"
            style={{ width: BUTTON, height: BUTTON, pointerEvents: open ? "none" : "auto" }}
          >
            <Chat className="size-3.5" />
          </motion.button>
        </motion.div>
      </div>
    </MotionConfig>
  );
}

/** The floating chat's compact composer: attach, the field, effort and permission, send. */
export function FloatingChatComposer() {
  return (
    <div className="flex items-center gap-2 rounded-2xl px-2.5 py-1.5 text-primary-300 glass-outline">
      <Attach className="size-3 shrink-0" />
      <span className="min-w-0 flex-1 truncate text-[9px] text-primary-400">
        Ask a follow-up, use @ or / for commands, files, plugins, and skills
      </span>
      <Brain className="size-3 shrink-0" />
      <Edit className="size-3 shrink-0" />
      <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-950">
        <ArrowUp className="size-2.5" />
      </span>
    </div>
  );
}
