import Image from "next/image";
import { ChatScroll } from "@/components/demo/chat-tabs";
import { ScaleToFit } from "@/components/demo/scale-to-fit";
import { ArrowUp, Branch, ChevronLeft, ChevronUp, Clipboard, Ellipsis, Plus } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * The Mains iPhone app beside the desktop window: a finished Codex run, read
 * from the phone. Laid out in iOS points on a 402 × 852 screen and scaled, like
 * the desktop mockups, so the type keeps its iOS proportions at any width.
 */

/** Phone body plus the side buttons that stand proud of it. */
const DESIGN_WIDTH = 436;
const DESIGN_HEIGHT = 880;

/** The iOS app's accent and its glass controls, read off the app. */
const ACCENT = "bg-[#026bd3]";
const GLASS = "bg-[#202020]";
const LINK = "text-[#2f8cf5]";

function StatusBar() {
  return (
    <div className="flex h-13 items-center justify-between px-9 pt-1 text-white">
      <span className="w-16 text-center text-[17px] font-semibold tracking-tight">3:22</span>
      <span className="flex items-center gap-1.5">
        <span className="flex gap-0.75" aria-hidden>
          {[0, 1, 2, 3].map((dot) => (
            <span key={dot} className="size-1 rounded-full bg-white/40" />
          ))}
        </span>
        <svg viewBox="0 0 18 13" className="h-3 w-4.5" fill="currentColor" aria-hidden>
          <path d="M9 2.4c2.5 0 4.8 1 6.5 2.6l1.2-1.3A11.2 11.2 0 0 0 9 .6 11.2 11.2 0 0 0 1.3 3.7L2.5 5A9.3 9.3 0 0 1 9 2.4Zm0 3.6c1.5 0 2.9.6 3.9 1.5l1.3-1.3A7.4 7.4 0 0 0 9 4.2c-2 0-3.8.8-5.2 2l1.3 1.3C6.1 6.6 7.5 6 9 6Zm0 3.6c.6 0 1.1.2 1.5.5L9 11.7 7.5 10.1c.4-.3.9-.5 1.5-.5Z" />
        </svg>
        <span className="flex items-center gap-px" aria-hidden>
          <span className="h-3 w-6 rounded-sm bg-white" />
          <span className="h-1 w-0.5 rounded-r-full bg-white/50" />
        </span>
      </span>
    </div>
  );
}

function NavBar() {
  return (
    <div className="flex items-center gap-3 px-4 pt-1">
      <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-full", GLASS)}>
        <ChevronLeft className="size-5 text-white" />
      </span>
      <span className="min-w-0 flex-1 truncate text-[17px] font-semibold text-white">
        Expand Chat Area Drag and Drop
      </span>
      <span className={cn("flex h-11 shrink-0 items-center gap-5 rounded-full px-4 text-white", GLASS)}>
        {/* Compose: a square with a pencil across its corner. */}
        <svg viewBox="0 0 24 24" className="size-5.5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
          <path d="M17.5 3.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 8.5-8.5Z" />
        </svg>
        <Ellipsis className="size-5" />
      </span>
    </div>
  );
}

function Composer() {
  return (
    <div className={cn("rounded-[30px] px-4 pt-3.5 pb-2.5", GLASS)}>
      <div className="text-[17px] text-[#6e6e73]">Continue this run…</div>
      <div className="mt-4 flex items-center gap-3 text-[16px] text-[#a1a1a6]">
        <Plus className="size-5" />
        <span>
          <span className="font-semibold">GPT 6.1 Sol</span>{" "}
          <span className="text-[#8e8e93]">Max</span>
        </span>
        <span className="font-semibold">Write</span>
        <span className={cn("ml-auto flex size-10 items-center justify-center rounded-full text-white", ACCENT)}>
          <ChevronUp className="size-5.5" />
        </span>
      </div>
    </div>
  );
}

function Transcript() {
  return (
    <div className="flex flex-col gap-5 px-4.5 pt-30 pb-36 text-[16px] leading-5.75 text-white">
      <div className="flex flex-col items-end gap-2">
        <Image
          src="/demos/drop-overlay.png"
          alt="A screenshot of the chat dimmed under a drop overlay that reads Add anything"
          width={566}
          height={420}
          sizes="280px"
          className="w-70 rounded-[20px]"
        />
        <div className={cn("max-w-[86%] rounded-3xl px-4 py-3", ACCENT)}>
          Extend file and image drag-and-drop to the entire chat area, like the attached
          screenshot. While dragging, dim the chat and show &quot;Add anything&quot; in
          the center.
        </div>
      </div>

      <div className="flex items-center gap-1.5 border-b border-white/12 pb-2.5 text-[15px] text-[#8e8e93]">
        7 messages · 56 tool calls
        <ArrowUp className="size-3.5 rotate-90" />
      </div>

      <div className="flex flex-col gap-2.5">
        <p>
          Files and images can now be dropped anywhere in the main chat pane. A full-area
          overlay dims the chat and shows the requested message during file drags, then
          clears when the drag leaves or the file is dropped. Text drags do not trigger it.
        </p>
        <p>
          Chat and composer drops use the same attachment handling, preserving supported
          formats, previews, and existing attachments. The changes are in{" "}
          <span className={LINK}>workspace-provider-page.tsx</span> and{" "}
          <span className={LINK}>composer-uploads.ts</span>.
        </p>
        <p>
          Verification passed: 21 focused tests, renderer typecheck, ESLint, and{" "}
          <code className="font-mono text-[15px]">git diff --check</code>.
        </p>
        <div className="mt-1 flex items-center gap-5 text-[#8e8e93]">
          <Clipboard className="size-5" />
          <Branch className="size-5" />
        </div>
      </div>
    </div>
  );
}

export function PhoneChat({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="The Mains iPhone app showing a finished Codex run"
      // The shadow lives out here: ScaleToFit clips to the design box.
      className={cn("drop-shadow-[0_28px_36px_rgb(0_0_0/0.6)]", className)}
    >
      <ScaleToFit designWidth={DESIGN_WIDTH} designHeight={DESIGN_HEIGHT}>
        <div
          // `text-left` is load-bearing: the hero centers its column.
          className="relative h-full w-full text-left select-none"
          style={{ fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}
        >
          {/* Side buttons: action and volume on the left, power on the right. */}
          <span className="absolute top-36 left-0 h-8 w-1 rounded-l-sm bg-[#3a3a39]" />
          <span className="absolute top-52 left-0 h-15 w-1 rounded-l-sm bg-[#3a3a39]" />
          <span className="absolute top-71 left-0 h-15 w-1 rounded-l-sm bg-[#3a3a39]" />
          <span className="absolute top-60 right-0 h-24 w-1 rounded-r-sm bg-[#3a3a39]" />

          {/* Titanium edge, then the black bezel around the screen. */}
          <div className="absolute inset-y-0 inset-x-0.5 rounded-[68px] bg-linear-to-br from-[#5a5a58] via-[#2b2b2a] to-[#4a4a48] p-0.75">
            <div className="h-full w-full rounded-[65px] bg-black p-3">
              <div className="relative h-full w-full overflow-hidden rounded-[54px] bg-black">
                <div className="absolute inset-0 flex flex-col">
                  <ChatScroll>
                    <Transcript />
                  </ChatScroll>
                </div>

                {/* Status and navigation float over the transcript as it
                    scrolls beneath them. */}
                <div className="absolute inset-x-0 top-0 bg-linear-to-b from-black via-black/85 to-transparent pb-5">
                  <StatusBar />
                  <NavBar />
                </div>
                <span className="absolute top-3 left-1/2 h-9 w-31 -translate-x-1/2 rounded-full bg-black" />

                <div className="absolute inset-x-3.5 bottom-7">
                  <Composer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScaleToFit>
    </div>
  );
}
