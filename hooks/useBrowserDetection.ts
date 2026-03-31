import { useSyncExternalStore } from "react";

const CHROMIUM_USER_AGENT_PATTERN = /(chrome|chromium|crios|crmo|edg|opr)/i;
const FIREFOX_USER_AGENT_PATTERN = /(firefox|fxios)/i;

function detectChromiumBrowser() {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return true;
  }

  const userAgent = navigator.userAgent;
  const hasChromeObject = "chrome" in window;
  const isFirefox = FIREFOX_USER_AGENT_PATTERN.test(userAgent);
  const hasChromiumUserAgent = CHROMIUM_USER_AGENT_PATTERN.test(userAgent);

  return !isFirefox && (hasChromeObject || hasChromiumUserAgent);
}

function subscribe() {
  return () => {};
}

function getServerSnapshot() {
  return true;
}

export function useBrowserDetection() {
  const isChrome = useSyncExternalStore(
    subscribe,
    detectChromiumBrowser,
    getServerSnapshot,
  );

  return { isChrome };
}
