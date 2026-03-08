import { useEffect, useState } from "react";

export function usePlatformDetection() {
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    const platform = navigator.platform.toLowerCase();
    const userAgent = navigator.userAgent.toLowerCase();

    const isMacOS =
      platform.includes("mac") ||
      userAgent.includes("mac") ||
      userAgent.includes("iphone") ||
      userAgent.includes("ipad");

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMac(isMacOS);
  }, []);

  return { isMac };
}
