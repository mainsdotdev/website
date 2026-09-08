import { useEffect, useState } from "react";

/** Which build the visitor can actually install. */
export type Platform = "mac" | "ios" | "other";

/**
 * iOS is its own answer rather than a flavour of macOS: an iPhone cannot open
 * a .dmg, and the iPhone app is a companion that pairs with a Mac rather than
 * a second way to get Mains — so the two platforms want different buttons and
 * different copy.
 *
 * SSR has no `navigator`, so the first paint assumes macOS: it is the majority
 * case and the widest pill, which keeps the correction from reflowing the row.
 */
export function usePlatformDetection() {
  const [platform, setPlatform] = useState<Platform>("mac");

  useEffect(() => {
    const p = navigator.platform?.toLowerCase() ?? "";
    const ua = navigator.userAgent.toLowerCase();
    const apple = p.includes("mac") || ua.includes("mac");

    // iPadOS 13+ reports a desktop Safari UA, so `mac` alone can't separate the
    // two — a Mac reports no touch points, an iPad reports five.
    const isIOS =
      /iphone|ipod|ipad/.test(ua) || (apple && navigator.maxTouchPoints > 1);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlatform(isIOS ? "ios" : apple ? "mac" : "other");
  }, []);

  return { platform, isMac: platform === "mac", isIOS: platform === "ios" };
}
