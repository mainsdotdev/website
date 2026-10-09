import { GoLesson } from "@/components/demo/go-lesson";
import { NavigationRail } from "@/components/demo/navigation-rail";
import { ScaleToFit } from "@/components/demo/scale-to-fit";
import { Composer, TurnMeta, UserTurn } from "@/components/demo/voice-chats";
import { WorkSidebarContent } from "@/components/demo/work-sidebar";
import { ArrowUp, Bolt, ChevronDown, Codex, Document, Ellipsis, Gallery, Goal, Menu, SidebarClose, Web } from "@/components/icons";
import { OrbFlightSlot } from "@/components/orb-flight";
import { cn } from "@/lib/utils";

const SIDEBAR_WIDTH = "w-52";

function TitleBar() {
  return (
    <div className="flex h-8 shrink-0 items-end">
      <div className={cn("flex h-full shrink-0 items-center gap-3 px-3", SIDEBAR_WIDTH)}>
        <div aria-hidden className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <SidebarClose className="size-3.5 text-primary-400" />
      </div>
      <div className="relative flex h-7 w-32 items-center gap-1 rounded-t-xl bg-(--demo-content) px-2 text-primary-200 shadow-[inset_0_1px_0_rgb(255_255_255/12%)]">
        <Codex className="size-3 shrink-0" />
        <span className="text-[9px]">Learn To Play Go</span>
        <Ellipsis className="ml-auto size-3 text-primary-500" />
        <span aria-hidden className="absolute -right-2 bottom-0 size-2" style={{ background: "radial-gradient(circle at top right, transparent 8px, var(--demo-content) 8px)" }} />
      </div>
      <div aria-hidden className="mb-2 ml-auto flex items-center gap-3 pr-3 text-primary-500">
        <Menu className="size-3.5" /><Web className="size-3.5" />
      </div>
    </div>
  );
}

const CONTROLS = (
  <>
    <span className="flex items-center gap-1 text-[10px]">
      <Codex className="size-3" />
      <span className="text-primary-50">GPT 6.1 Sol</span>
      <span className="text-primary-400">Extra High</span>
      <ChevronDown className="size-2.5 text-primary-400" fill="currentColor" />
    </span>
    <Bolt className="size-3 text-primary-400" />
    <Goal className="size-3 text-primary-400" />
    <span className="flex items-center gap-1.5 text-[10px] text-primary-400">
      <span aria-hidden className="flex -space-x-1">
        {['bg-blue-500', 'bg-red-500', 'bg-green-500'].map((tint) => <span key={tint} className={cn("flex size-3.5 items-center justify-center rounded border border-primary-950 text-white", tint)}><Document className="size-2" /></span>)}
      </span>
      Plugins
    </span>
  </>
);

/** Visualize renders a working lesson directly in a Mains Work conversation. */
export function VisualizeDemo({ className }: { className?: string }) {
  return (
    <ScaleToFit designWidth={1152} designHeight={648} className={cn("pointer-events-none lg:pointer-events-auto", className)}>
      <div role="group" aria-label="Mains Work teaching Go with an interactive Visualize lesson" className="relative flex h-full flex-col overflow-hidden bg-(--demo-chrome) text-left text-primary-200 select-none">
        <TitleBar />
        <div className="flex min-h-0 flex-1">
          <aside className={cn("flex shrink-0", SIDEBAR_WIDTH)}>
            <NavigationRail mode="work" showSpaces voiceSlot={<OrbFlightSlot stop="case-visualize" className="my-1 size-5" />} />
            <WorkSidebarContent featuredChat={{ project: "Rabbit Hole", title: "Learn To Play Go" }} />
          </aside>

          <div className="mr-1 mb-1 flex min-w-0 flex-1 flex-col rounded-xl rounded-tl-none bg-(--demo-content) px-8">
            <div className="mx-auto flex min-h-0 w-full max-w-136 flex-1 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto pt-6 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <UserTurn>
                  <span className="flex items-center gap-1.5">Teach me how to play Go <span className="flex items-center gap-1 text-blue-500"><Gallery className="size-2.5" />Visualize</span></span>
                </UserTurn>
                <div className="mt-4 flex items-center gap-1 border-b border-primary-800/25 pb-1.5 text-[9px] text-primary-500">
                  4 messages · 29 tool calls <ArrowUp className="size-2.5 rotate-90" />
                </div>
                <div className="mt-6"><GoLesson /></div>
                <p className="mt-4 text-[10px] leading-4">Before each move, ask: <strong>“Is one of my groups—or my opponent&apos;s—in atari?”</strong></p>
                <div className="mt-2"><TurnMeta duration="7m 35s" /></div>
              </div>
              <Composer voice="idle" controls={CONTROLS} />
            </div>
          </div>
        </div>
      </div>
    </ScaleToFit>
  );
}
