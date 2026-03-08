import { useEffect, useState } from "react";

export function useBrowserDetection() {
  const [isChrome, setIsChrome] = useState(true); // Default to true for SSR

  useEffect(() => {
    // Feature detection for Chromium-based browsers (Chrome, Edge, Opera, Brave, etc.)
    // Excludes Safari and Firefox which don't support Nabla font properly
    const isChromiumBrowser = 
      typeof window !== 'undefined' &&
      // @ts-expect-error - chrome is not in standard types
      !!(window.chrome) &&
      // Exclude Safari (which doesn't have window.chrome)
      !/Safari/.test(navigator.userAgent) ||
      /Chrome/.test(navigator.userAgent);
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsChrome(isChromiumBrowser);
  }, []);

  return { isChrome };
}
