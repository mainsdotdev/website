"use client";

import { useEffect } from "react";

/** Opens the `<details>` a `#question-id` link points at, on load and on hash changes. */
export function FaqHashOpener() {
  useEffect(() => {
    const openFromHash = () => {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (target instanceof HTMLDetailsElement) target.open = true;
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return null;
}
