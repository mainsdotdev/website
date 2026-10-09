import Image from "next/image";
import { ChatScroll, OpenChatButton } from "@/components/demo/chat-tabs";
import { CHAT_TABS, type ChatTabId } from "@/components/demo/chat-tabs-data";
import { MarkdownMessage } from "@/components/demo/markdown-message";
import {
  ArrowUp,
  Attach,
  ChevronDown,
  Clipboard,
  Clock,
  Codex,
  Document,
  Fork,
  Microphone,
  Shield,
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

export function DailyPlanChat() {
  return (
    <ChatLayout overlay={<OrbFlightSlot stop="app-window" className="size-20" />} footer={<Composer voice="live" />}>
      <UserTurn>Morning. Help me get today in order.</UserTurn>
      <AgentTurn>Of course. Let&apos;s start with your calendar.</AgentTurn>

      <UserTurn>What&apos;s on today, and when can I get groceries?</UserTurn>
      <ToolRow icon={<Clock className="size-3" />} label="Read today&apos;s calendar" />
      <AgentTurn>
        Dentist at 10, then a team call at 2. You&apos;re free from 11 to 1,
        so there&apos;s time to pick up groceries and have lunch before the call.
      </AgentTurn>

      <UserTurn>Plan three vegetarian dinners for two. Under 30 minutes, with a grocery list.</UserTurn>
      <AgentTurn>I&apos;ll put the meal plan and shopping list in their own chat.</AgentTurn>
      <DelegatedChat chat="dinner" status="Plan ready" />

      <UserTurn>And make me a new desktop wallpaper. Earth from the Moon, no text.</UserTurn>
      <AgentTurn>Starting your wallpaper now.</AgentTurn>
      <DelegatedChat chat="image" status="Image ready" />

      <AgentTurn>
        All set. Three quick dinners, one grocery list, and your new wallpaper.
        The list uses the rice and olive oil you already have, so there&apos;s less to buy.
      </AgentTurn>
    </ChatLayout>
  );
}

const DINNER_PLAN = `**Three easy dinners for two**, all under 30 minutes.

| Day | Dinner | Time |
| --- | --- | --- |
| Day 1 | Chickpea bowls with cucumber, lemon, and yogurt | 20 min |
| Day 2 | Tomato and spinach pasta | 25 min |
| Day 3 | Vegetable fried rice with eggs | 20 min |

**Grocery list**

- **Produce:** 1 cucumber, 2 lemons, 1 bag of spinach, 2 carrots, 1 bunch of spring onions.
- **Pantry:** 2 cans of chickpeas, 1 can of tomatoes, 250 g of pasta, soy sauce.
- **Fridge:** plain yogurt and 4 eggs.

You already have **rice and olive oil**. The spinach goes into both the pasta and the fried rice, and the lemons work for the chickpea bowls and the pasta.
`;

export function DinnerPlanChat() {
  return (
    <ChatLayout footer={<Composer voice="idle" />}>
      <UserTurn fromVoice>
        Plan three vegetarian dinners for two people, each under 30 minutes.
        Make one grocery list, reuse ingredients where it makes sense, and check
        my pantry note before adding anything to the list.
      </UserTurn>
      <WorkSummary label="1 message · 2 tool calls" />
      <AgentTurn>
        Your pantry note lists rice and olive oil. I&apos;ll build around those
        and share a few ingredients across the meals to keep the shopping simple.
      </AgentTurn>
      <ToolRow icon={<Document className="size-3" />} label="Read pantry note" />

      <UserTurn fromVoice>
        Keep it simple. I&apos;d rather do one grocery trip and use everything up.
      </UserTurn>
      <WorkSummary label="2 messages · 3 tool calls" />
      <div className="flex flex-col gap-2.5">
        <MarkdownMessage source={DINNER_PLAN} />
        <TurnMeta duration="38s" />
      </div>
    </ChatLayout>
  );
}

export function ImageChat() {
  return (
    <ChatLayout footer={<Composer voice="idle" />}>
      <UserTurn fromVoice>
        Make a desktop wallpaper: a photorealistic view
        of Earth above the lunar horizon, grey regolith and craters in the foreground,
        hard sunlight, black sky. 16:9, no text or logos. Save it as{" "}
        <code className={CODE}>Downloads/earth-from-moon.webp</code> and show it here.
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
        <code className={CODE}>Downloads/earth-from-moon.webp</code> (1672 × 941). This
        image is AI-generated.
      </AgentTurn>
      <TurnMeta duration="49s" />
    </ChatLayout>
  );
}
