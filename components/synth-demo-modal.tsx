"use client";

import { useEffect, useRef, type RefObject } from "react";
import { HeroChatDialog } from "@/components/hero-chat-dialog";

export function SynthDemoModal({
  onClose,
  triggerRef,
}: {
  onClose: () => void;
  triggerRef?: RefObject<HTMLElement | null>;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    let animationFrame = 0;
    const fitFrame = () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        frame.style.height = "1px";
        const page = frame.contentDocument;
        const contentHeight = page
          ? Math.max(page.documentElement.scrollHeight, page.body.scrollHeight)
          : 640;
        frame.style.height = `${Math.max(500, contentHeight + 8)}px`;
      });
    };

    frame.addEventListener("load", fitFrame);
    window.addEventListener("resize", fitFrame);
    if (frame.contentDocument?.readyState === "complete") fitFrame();

    return () => {
      frame.removeEventListener("load", fitFrame);
      window.removeEventListener("resize", fitFrame);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <HeroChatDialog
      title="Interactive synthesizer in a Mains conversation"
      prompt="make me a synth"
      onClose={onClose}
      triggerRef={triggerRef}
    >
      <iframe
        ref={frameRef}
        src="/demos/field-synth"
        title="FIELD/01 playable synthesizer"
        allow="autoplay"
        loading="eager"
        className="block w-full border-0 bg-transparent"
        style={{ height: 640 }}
      />
    </HeroChatDialog>
  );
}
