"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Link } from "@/components/icons";

type ShareButtonProps = {
  title: string;
  /** Site-relative post path; the absolute URL is read off the browser. */
  url: string;
};

/** Native share sheet where the browser has one, copy-link everywhere else. */
export function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  const onShare = useCallback(async () => {
    const absoluteUrl = new URL(url, window.location.origin).toString();

    if (navigator.share) {
      try {
        await navigator.share({ title, url: absoluteUrl });
        return;
      } catch {
        // Dismissed sheet or an unsupported payload — fall through to copying.
      }
    }

    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context / denied permission) — stay quiet.
    }
  }, [title, url]);

  return (
    <button
      type="button"
      onClick={onShare}
      aria-label="Share this post"
      className="flex items-center gap-2 text-sm text-primary-300 transition-colors hover:text-white"
    >
      {copied ? (
        <Check className="size-4" />
      ) : (
        <Link className="size-4" />
      )}
      <span>{copied ? "Copied" : "Share"}</span>
    </button>
  );
}
