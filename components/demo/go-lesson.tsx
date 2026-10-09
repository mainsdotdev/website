"use client";

import { useCallback, useEffect, useRef } from "react";

/** Runs the original HTML lesson in its own document, at the app's scale. */
export function GoLesson() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const syncTheme = useCallback(() => {
    frameRef.current?.contentWindow?.postMessage({
      type: "mains-demo-theme",
      theme: document.documentElement.dataset.theme === "light" ? "light" : "dark",
    }, "*");
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    syncTheme();
    return () => observer.disconnect();
  }, [syncTheme]);

  return (
    <div className="relative h-90 w-full overflow-hidden">
      <iframe
        ref={frameRef}
        src="/demos/go-first-steps.html"
        title="Learn to play Go — six interactive lessons"
        sandbox="allow-scripts"
        loading="lazy"
        onLoad={syncTheme}
        className="absolute top-0 left-0 border-0 bg-transparent"
        style={{ width: 850, height: 560, transform: "scale(0.64)", transformOrigin: "top left" }}
      />
    </div>
  );
}
