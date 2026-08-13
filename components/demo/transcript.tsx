"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ArrowUp } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Turns from earlier in the session, above the fold. They exist so the
 * transcript has real history to scroll back through — and the last of them
 * is the change the session panel is showing.
 */
const EARLIER_TURNS: { role: "user" | "agent"; text: string }[] = [
  {
    role: "user",
    text: "Pull the latest main into this workspace and run the test suite.",
  },
  {
    role: "agent",
    text: "Rebased feature/issue-pr-screen onto origin/main — no conflicts. Running the suite now.",
  },
  {
    role: "agent",
    text: "142 tests passed in 18.4s, nothing failed. The workspace is clean apart from the two files you left staged.",
  },
  {
    role: "user",
    text: "The GitHub device-flow panel re-renders on every poll tick. Can you fix that?",
  },
  {
    role: "agent",
    text: "Fixed. The poll interval lived in a state setter, so every tick recreated the callback and re-rendered the panel; it now holds the timer in a ref and only re-renders when the auth status actually changes.",
  },
];

/** The turns the app folds away behind the count. */
const COLLAPSED_MESSAGES = [
  "I'll spawn three parallel agents to review the codebase across security, test coverage, and maintainability.",
  "All three agents (security, test gaps, maintainability) are now running in parallel in the background. I'll wait for all three to complete and then compile a combined summary organized by category with file references.",
  "Test-gap agent is done. Waiting on security and maintainability agents before compiling the combined summary.",
  "Maintainability agent is done too. Still waiting on the security review agent.",
  "All three reviews are complete. Here's the combined summary.",
];

/**
 * The conversation column of the mockup — the one piece that is actually
 * interactive: the message count expands the folded turns.
 *
 * The final reply arrives as `children` so it can stay server-rendered (it
 * goes through react-markdown, which has no business in the client bundle).
 *
 * It is a real scroll area, parked at the bottom on mount the way a live
 * session sits. Expanding inserts content mid-transcript, which would other-
 * wise shove whatever you were reading down the screen, so each toggle also
 * drives the scroll: open parks the clicked row at the top and lets the turns
 * unfold beneath it, close returns to the end of the transcript.
 */
export function Transcript({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const toggleRowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  const toggle = () => {
    const opening = !expanded;
    setExpanded(opening);

    const scroller = scrollRef.current;
    const row = toggleRowRef.current;
    if (!scroller) return;

    // Runs after the state's paint, so the grid row has started expanding and
    // scrollHeight already reflects the taller content.
    requestAnimationFrame(() => {
      const top = opening && row ? row.offsetTop - 8 : scroller.scrollHeight;
      scroller.scrollTo({ top, behavior: "smooth" });
    });
  };

  return (
    <div
      ref={scrollRef}
      className="min-h-0 flex-1 overflow-y-auto noscrollbar"
    >
      <div className="flex flex-col gap-5 pb-5">
        {EARLIER_TURNS.map((turn) =>
          turn.role === "user" ? (
            <div
              key={turn.text}
              className="ml-auto max-w-[80%] rounded-2xl bg-primary-900/50 px-3 py-2 text-[11px] leading-relaxed text-primary-200"
            >
              {turn.text}
            </div>
          ) : (
            <p key={turn.text} className="text-[10px] leading-5 text-primary-200">
              {turn.text}
            </p>
          )
        )}
      </div>

      <div className="ml-auto max-w-[80%] rounded-2xl bg-primary-900/50 px-3 py-2 text-[11px] leading-relaxed text-primary-200">
        Review this app with parallel subagents. Spawn one subagent for security
        risks, one for test gaps, and one for maintainability. Wait for all
        three, then summarize the findings by category with file references.
      </div>

      <div ref={toggleRowRef} className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          className="flex cursor-pointer items-center gap-1 text-[10px] text-primary-400 transition-colors hover:text-primary-100"
        >
          {COLLAPSED_MESSAGES.length - 1} messages
          <ArrowUp
            className={cn(
              "size-2.5 transition-transform duration-200",
              expanded ? "rotate-180" : "rotate-90"
            )}
          />
        </button>
        <span className="h-px flex-1 bg-white/6" />
      </div>

      {/* The app's `PanelCollapse` idiom: 0fr↔1fr grid rows animate to the
          content's natural height with no measurement. */}
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-col gap-2 pt-3 text-[10px] leading-5 text-primary-200">
            {COLLAPSED_MESSAGES.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
