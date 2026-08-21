"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export type KbdShortcutTarget = "download" | "github";

type ShortcutPillButtonProps = {
  children: React.ReactNode;
  /** Keyboard chip shown on the right; omit for buttons with no shortcut. */
  shortcut?: string;
  shortcutClassName?: string;
  className?: string;
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  onClick?: () => void;
  ariaLabel: string;
  kbdShortcut?: KbdShortcutTarget;
};

export function ShortcutPillButton({
  children,
  shortcut,
  shortcutClassName,
  className,
  href,
  target,
  rel,
  onClick,
  ariaLabel,
  kbdShortcut,
}: ShortcutPillButtonProps) {
  const inner = (
    <>
      <span className="flex min-w-0 items-center gap-2">{children}</span>
      {shortcut && (
        <kbd
          className={cn(
            "inline-flex size-6 shrink-0 items-center justify-center rounded-md text-[10px] font-medium font-mono leading-none md:text-xs",
            shortcutClassName
          )}
          aria-hidden
        >
          {shortcut}
        </kbd>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        className={className}
        data-kbd-shortcut={kbdShortcut}
      >
        {inner}
      </Link>
    );
  }

  return (
    <span
      role="button"
      aria-label={ariaLabel}
      aria-disabled
      className={className}
      onClick={onClick}
    >
      {inner}
    </span>
  );
}
