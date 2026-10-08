import Image from "next/image";
import { ChatScroll, OpenChatButton } from "@/components/demo/chat-tabs";
import { CHAT_TABS, type ChatTabId } from "@/components/demo/chat-tabs-data";
import { MarkdownMessage } from "@/components/demo/markdown-message";
import {
  ArrowUp,
  Attach,
  ChevronDown,
  Clipboard,
  Codex,
  Fork,
  Github,
  Microphone,
  Shield,
  Terminal,
  VoiceWave,
} from "@/components/icons";
import { OrbFlightSlot } from "@/components/orb-flight";

/**
 * The hero mockup's three chats, as a Codex voice conversation leaves them:
 * the call itself, which keeps its turns short and hands longer work off, and
 * the two chats it handed work to. Those receive the coordinator's written-up
 * request, marked as sent from the voice conversation.
 *
 * Server components: the transcripts are constants, so the markdown renders
 * at build time and only the tab switch ships to the client.
 */

const CODE = "rounded bg-primary-50/10 px-1 py-0.5 text-[0.9em] text-primary-100";

export function UserTurn({
  children,
  fromVoice = false,
}: {
  children: React.ReactNode;
  fromVoice?: boolean;
}) {
  return (
    <div className="ml-auto flex max-w-[80%] flex-col items-end gap-1">
      {fromVoice && (
        <span className="flex items-center gap-1 text-[9px] text-primary-400">
          <Microphone className="size-2.5" />
          Sent from voice conversation
        </span>
      )}
      <div className="rounded-2xl bg-primary-900/50 px-3 py-2 text-[11px] leading-relaxed text-primary-200">
        {children}
      </div>
    </div>
  );
}

export function AgentTurn({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] leading-5 text-primary-200">{children}</p>;
}

/** A collapsed tool call, the way the transcript folds one into a row. */
function ToolRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-primary-400">
      {icon}
      <span>{label}</span>
      <ArrowUp className="size-2.5 rotate-90" />
    </div>
  );
}

/** The fold over a stretch of work: its message and tool call counts. */
function WorkSummary({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1 text-[10px] text-primary-400">
        {label}
        <ArrowUp className="size-2.5 rotate-90" />
      </span>
      <span className="h-px flex-1 bg-primary-800/50" />
    </div>
  );
}

/** A chat the voice conversation started, with its state and a way in. */
function DelegatedChat({ chat, status }: { chat: ChatTabId; status: string }) {
  const title = CHAT_TABS.find((tab) => tab.id === chat)?.title;

  return (
    <div className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 glass-outline">
      <Codex className="size-4 shrink-0 text-primary-100" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[10px] font-medium text-primary-50">{title}</div>
        <div className="text-[9px] text-primary-400">{status}</div>
      </div>
      <OpenChatButton chat={chat} />
    </div>
  );
}

/** Duration and the copy/fork actions under a finished reply. */
export function TurnMeta({ duration }: { duration: string }) {
  return (
    <div className="flex items-center gap-2 text-[10px] text-primary-400">
      <span>{duration}</span>
      <span>·</span>
      <Clipboard className="size-3" />
      <Fork className="size-3" />
    </div>
  );
}

/** The model and permission pickers of the voice chats' composer. */
const VOICE_CHAT_CONTROLS = (
  <>
    <span className="flex items-center gap-1 text-[10px]">
      <Codex className="size-3" />
      <span className="text-primary-50">GPT 6.1 Sol</span>
      <span className="text-primary-400">Medium</span>
      <ChevronDown className="size-2.5 text-primary-400" fill="currentColor" />
    </span>

    <span className="flex items-center gap-1 text-[10px] text-amber-500">
      <Shield className="size-3" />
      <span>Full Access</span>
      <ChevronDown className="size-2.5" fill="currentColor" />
    </span>
  </>
);

/**
 * The workspace composer, tracking the app's `RichInputForm` + `InputToolbar`.
 * While a call is live the primary button is Stop, with the microphone beside
 * it; in an idle Codex chat with nothing typed, it is Start voice chat.
 * `controls` are the pickers after the attach button.
 */
export function Composer({
  voice,
  controls = VOICE_CHAT_CONTROLS,
}: {
  voice: "live" | "idle";
  controls?: React.ReactNode;
}) {
  return (
    <div className="mb-4 shrink-0 rounded-[18px] pb-1.5 glass-card bg-primary-900/20">
      <div className="relative pt-1 pr-16 pb-0.5 pl-3.5">
        <span className="text-[10px] text-primary-400">
          Ask a follow-up, use @ or / for commands, files, plugins, and skills
        </span>
        <kbd className="absolute top-2 right-2 px-1 py-0.5 font-sans text-[8px] text-primary-200">
          ⌘ ⇧ P to focus
        </kbd>
      </div>

      <div className="flex items-center justify-between gap-2 px-2 pt-3">
        <div className="ml-1 flex min-w-0 items-center gap-2.5 pr-2 text-primary-200">
          <Attach className="size-3 shrink-0" />
          {controls}
        </div>

        {voice === "live" ? (
          <span className="flex shrink-0 items-center gap-2">
            <Microphone className="size-3.5 text-primary-300" />
            <span
              aria-label="End voice chat"
              className="flex size-5 items-center justify-center rounded-full bg-primary-50"
            >
              <span className="size-1.5 rounded-[2px] bg-primary-950" />
            </span>
          </span>
        ) : (
          <span
            aria-label="Start voice chat"
            className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-950"
          >
            <VoiceWave className="size-3" />
          </span>
        )}
      </div>
    </div>
  );
}

export function ChatLayout({
  children,
  overlay,
  footer,
}: {
  children: React.ReactNode;
  /** Floats over the transcript's bottom edge; the chat scrolls beneath it. */
  overlay?: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative flex min-h-0 flex-1 flex-col">
        <ChatScroll>
          {/* With an overlay, the end of the transcript stops just above it
              rather than under it; anything earlier scrolls behind. */}
          <div className={overlay ? "flex flex-col gap-4 pt-6 pb-26" : "flex flex-col gap-4 pt-6 pb-5"}>
            {children}
          </div>
        </ChatScroll>
        {overlay && (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
            {overlay}
          </div>
        )}
      </div>
      {footer}
    </div>
  );
}

export function VoiceChat() {
  return (
    <ChatLayout overlay={<OrbFlightSlot stop="app-window" className="size-20" />} footer={<Composer voice="live" />}>
      <UserTurn>Hey, got a minute before the release cut?</UserTurn>
      <AgentTurn>Sure. What&apos;s first?</AgentTurn>

      <UserTurn>Is CI green on the sidebar refactor PR?</UserTurn>
      <ToolRow icon={<Github className="size-3" />} label="GitHub listed check runs" />
      <AgentTurn>
        Almost. 11 of 12 checks passed; <code className={CODE}>e2e-macos</code> timed out
        in <code className={CODE}>sidebar-order.spec.ts</code>. It passed on the previous
        commit, so it looks flaky.
      </AgentTurn>

      <UserTurn>Find out why it flakes. Don&apos;t push anything.</UserTurn>
      <AgentTurn>On it. I&apos;ll dig in from its own chat so it can take its time.</AgentTurn>
      <DelegatedChat chat="flaky" status="Reply ready" />

      <UserTurn>Then make the OG image for the 0.15 post, Earth from the Moon.</UserTurn>
      <AgentTurn>Starting the image now.</AgentTurn>
      <DelegatedChat chat="image" status="Reply ready" />

      <AgentTurn>
        Both are back. The flake is a race in the test: on macOS it drags before the
        sidebar settles, about one run in seventeen. The fix is in its chat, waiting for
        your OK.
      </AgentTurn>
    </ChatLayout>
  );
}

const FLAKE_REPORT = `**It's a race in the test, not a bug in the sidebar.** I ran the spec 50 times per platform with \`--repeat-each=50\`.

| Platform | Runs | Failures | p95 duration |
| --- | --- | --- | --- |
| macOS 15 (arm64) | 50 | **3** | 8.4 s |
| Ubuntu 24.04 | 50 | 0 | 6.1 s |
| Windows 11 | 50 | 0 | 7.2 s |

**Root cause:** \`dragProject()\` starts the pointer drag right after \`page.goto()\`. On the macOS runner the sidebar's enter transition takes about 320 ms, so dnd-kit measures the rows mid-animation and the drop resolves to the original index.

- **Fix:** wait until \`document.getAnimations()\` is empty before dragging. With that in place, 200 macOS runs passed.
- **Scope:** the patch is local, in \`e2e/sidebar-order.spec.ts\` (+4 −1). Nothing was pushed and CI config is unchanged.
`;

export function FlakyTestChat() {
  return (
    <ChatLayout footer={<Composer voice="idle" />}>
      <UserTurn fromVoice>
        Investigate the flaky <code className={CODE}>e2e-macos</code> failure in{" "}
        <code className={CODE}>sidebar-order.spec.ts</code> on the sidebar refactor PR.
        Pull the CI logs and trace, reproduce it locally with repeated runs, and find the
        root cause. Don&apos;t push or change CI config; a local patch is fine if you
        explain it. Use the current workspace instead of a new worktree.
      </UserTurn>
      <WorkSummary label="1 message · 6 tool calls" />
      <AgentTurn>
        CI timed out after 30 s waiting for the second project row to move. The trace
        shows the drag starting while the list was still animating in, so the drop landed
        on the old slot. Reproducing it locally now.
      </AgentTurn>
      <ToolRow icon={<Terminal className="size-3" />} label="Ran commands" />

      <UserTurn fromVoice>
        Also check how often it fails, and whether it only happens on macOS.
      </UserTurn>
      <WorkSummary label="2 messages · 11 tool calls" />
      <div className="flex flex-col gap-2.5">
        <MarkdownMessage source={FLAKE_REPORT} />
        <TurnMeta duration="6m 41s" />
      </div>
    </ChatLayout>
  );
}

export function ImageChat() {
  return (
    <ChatLayout footer={<Composer voice="idle" />}>
      <UserTurn fromVoice>
        Generate the Open Graph image for the 0.15 release post: a photorealistic view
        of Earth above the lunar horizon, grey regolith and craters in the foreground,
        hard sunlight, black sky. 16:9, no text or logos. Save it as{" "}
        <code className={CODE}>public/changelog/0-15/og.webp</code>, show it here, and
        don&apos;t touch any other files.
      </UserTurn>
      <WorkSummary label="1 message · 2 tool calls" />
      <Image
        src="/demos/earth-from-moon.webp"
        alt="Earth above the lunar horizon, with grey regolith and craters in the foreground"
        width={800}
        height={450}
        sizes="340px"
        className="w-85 rounded-2xl"
      />
      <AgentTurn>
        Earth over the lunar horizon, saved to{" "}
        <code className={CODE}>public/changelog/0-15/og.webp</code> (1672 × 941). This
        image is AI-generated.
      </AgentTurn>
      <TurnMeta duration="49s" />
    </ChatLayout>
  );
}
