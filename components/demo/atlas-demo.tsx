"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { NavigationRail } from "@/components/demo/navigation-rail";
import { ScaleToFit } from "@/components/demo/scale-to-fit";
import { Shine, SquareSpinner } from "@/components/demo/spinners";
import { WindowFrame, WORK_PROJECTS } from "@/components/demo/work-window";
import { WindowTab } from "@/components/demo/window-tab";
import {
  ArrowUp,
  Attach,
  Bolt,
  Brain,
  BrowserCursor,
  Cat,
  Clipboard,
  Cpu,
  Edit,
  Ellipsis,
  Globe,
  Library,
  Mains,
  Minus,
  Page,
  Passport,
  Picture,
  Plus,
  Read,
  Star,
  Trash,
  Web,
} from "@/components/icons";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

/**
 * Atlas, the app's library of Pages, with a page being written by its own
 * chat. The run follows the dev database's "Create Generative UI Page": the
 * visitor asks for a page, Codex reads its page-writing skill, searches, saves
 * the page and checks it, and the page fills in when the save lands. Then it
 * generates a cover and picks an icon, which the page takes on last. (That
 * part is ahead of the app: its Atlas tools don't set covers or icons yet.)
 *
 * The chat is the app's `FloatingChatOverlay`: a bar while it is empty, a card
 * once a message is sent, and a round button when minimized. Its minimize and
 * show buttons work, so a visitor can tuck it away to read the page.
 */

// ─── The run ─────────────────────────────────────────────────────────────────

const PROMPT =
  "Write a page on generative UI: how it works, an example, and the main approaches with their tradeoffs. Add a cover and an icon that fit.";
const FIRST_TITLE = "Untitled page";
const PAGE_TITLE = "Generative UI overview";

type Tool = { Icon: React.FC<React.SVGProps<SVGSVGElement>>; verb: string; running: string };

const READ_PAGE: Tool = { Icon: Globe, verb: "Read Atlas page", running: "Reading Atlas page" };
const UPDATE_PAGE: Tool = { Icon: Globe, verb: "Updated Atlas page", running: "Updating Atlas page" };
const READ: Tool = { Icon: Read, verb: "Read", running: "Reading" };
const SEARCH: Tool = { Icon: Web, verb: "Searched the web", running: "Searching the web" };
const COMPUTER: Tool = { Icon: BrowserCursor, verb: "Computer use", running: "Computer use" };
const GENERATE_IMAGE: Tool = { Icon: Picture, verb: "Generated an image", running: "Generating an image" };
const DRESS_PAGE: Tool = { Icon: Globe, verb: "Updated Atlas page", running: "Updating Atlas page" };

type Entry =
  | { kind: "message"; text: string }
  | { kind: "tool"; tool: Tool; detail: string; note?: string };

/** Codex's generated cover, used for the page and shown in the chat as it lands. */
const COVER_SRC = "/demos/generative-ui-cover.webp";

/** The run's messages and tool calls, in the order they come. */
const ENTRIES: Entry[] = [
  {
    kind: "message",
    text: "I’ll write an overview of generative UI on this page: how it works, an example, and the approaches with their tradeoffs. I’m using the page-writing skill to structure it.",
  },
  { kind: "tool", tool: READ_PAGE, detail: FIRST_TITLE, note: "v1" },
  { kind: "tool", tool: READ, detail: "SKILL.md" },
  { kind: "tool", tool: READ, detail: "writing_quality.md" },
  { kind: "tool", tool: READ, detail: "edit-requests.md" },
  { kind: "tool", tool: READ, detail: "page-content.md" },
  { kind: "tool", tool: SEARCH, detail: "ai-sdk.dev generative user interfaces" },
  { kind: "tool", tool: READ, detail: "page-content.md" },
  { kind: "tool", tool: READ, detail: "writing_quality.md" },
  { kind: "tool", tool: SEARCH, detail: "ai-sdk.dev/docs/ai-sdk-ui/generative-user-interfaces" },
  {
    kind: "message",
    text: "Generative UI can range from selecting familiar controls to generating a whole interface. I’ll explain those approaches and use a trip-planning example to show how a request becomes something the user can interact with.",
  },
  { kind: "tool", tool: COMPUTER, detail: "Check the current page preview" },
  { kind: "tool", tool: UPDATE_PAGE, detail: PAGE_TITLE, note: "v1 → v2" },
  { kind: "tool", tool: READ_PAGE, detail: PAGE_TITLE, note: "v2" },
  { kind: "tool", tool: COMPUTER, detail: "Inspect the saved page" },
  { kind: "tool", tool: COMPUTER, detail: "Check page readability" },
  { kind: "message", text: "The page is saved and checked. Next I’ll generate a cover that matches it and give it an icon." },
  { kind: "tool", tool: GENERATE_IMAGE, detail: "Cover for Generative UI overview" },
  { kind: "tool", tool: DRESS_PAGE, detail: "Cover and icon", note: "v2 → v3" },
];

/** The entry whose result is the saved page. */
const SAVE_INDEX = ENTRIES.findIndex((entry) => entry.kind === "tool" && entry.tool === UPDATE_PAGE);
const TOOL_COUNT = ENTRIES.filter((entry) => entry.kind === "tool").length;
const MESSAGE_COUNT = ENTRIES.length - TOOL_COUNT;

// ─── Timeline, in ms from the window coming into view ────────────────────────

const TYPE_START = 700;
const TYPE_MS_PER_CHAR = 22;
const SEND = TYPE_START + PROMPT.length * TYPE_MS_PER_CHAR + 450;
const ENTRIES_START = SEND + 800;
/** How long an entry holds the end of the run before the next one arrives. */
function holdFor(entry: Entry) {
  if (entry.kind === "message") return 1300;
  if (entry.tool === GENERATE_IMAGE) return 2600;
  if (entry.tool === UPDATE_PAGE || entry.tool === DRESS_PAGE) return 900;
  return 430;
}

const ENTRIES_AT = (() => {
  let at = ENTRIES_START;
  return ENTRIES.map((entry) => {
    const start = at;
    at += holdFor(entry);
    return start;
  });
})();
const IMAGE_INDEX = ENTRIES.findIndex((entry) => entry.kind === "tool" && entry.tool === GENERATE_IMAGE);
const DRESS_INDEX = ENTRIES.findIndex((entry) => entry.kind === "tool" && entry.tool === DRESS_PAGE);
/** A step's result lands as it finishes; the page changes from there. */
const finishedAt = (index: number) => ENTRIES_AT[index] + holdFor(ENTRIES[index]);
const SAVED = finishedAt(SAVE_INDEX);
const IMAGE_READY = finishedAt(IMAGE_INDEX);
/** The cover and icon reach the page. */
const DRESSED = finishedAt(DRESS_INDEX);
const BLOCK_MS = 90;
const DONE = finishedAt(ENTRIES.length - 1) + 300;
const END = DONE + 1500;
/** The run's length in the app, for the line under the answer. */
const RUN_TIME = "3m 06s";

// ─── The page ────────────────────────────────────────────────────────────────

function Link({ children }: { children: React.ReactNode }) {
  return <span className="text-blue-400 underline decoration-blue-400/60 underline-offset-2">{children}</span>;
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="mb-1.5 text-[10px] leading-4.5 text-primary-100">{children}</p>;
}

function Heading({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-3.5 mb-1.5 text-[12px] font-semibold tracking-tight text-primary-50">{children}</h3>;
}

const STEPS = [
  ["Understand the request.", "The model receives the person’s message and relevant context."],
  ["Retrieve information.", "It can call a tool to obtain data from a service."],
  ["Choose a presentation.", "The application maps the result to an appropriate component."],
  ["Render the interface.", "The person sees useful controls alongside any explanation."],
  ["Continue the interaction.", "Selections and edits can inform the next response."],
];

const APPROACHES = [
  ["Component selection", "A tool request or result that the app displays with a predefined component.", "Predictable presentation, limited variety."],
  ["Structured composition", "A description of components, layout, and data bindings that the app renders.", "More flexible arrangements, within a supported component catalog."],
  ["Full interface generation", "A custom web page and supporting assets.", "Broad creative freedom, greater validation and maintenance demands."],
];

/** The page as Codex saved it (revision 2), block by block, down to where the window cuts it off. */
const BLOCKS: React.ReactNode[] = [
  <Paragraph key="intro">
    Generative UI, or GenUI, uses AI to choose, assemble, or generate a user interface in response to a person’s
    request and context. An answer can include interactive controls such as cards, forms, charts, and maps. These let
    the person act on the response directly. <Link>AI SDK overview</Link>, <Link>A2UI introduction</Link>.
  </Paragraph>,
  <Paragraph key="goal">
    The goal is to make the next step easier: compare options, adjust a plan, explore information, or complete a task.
    The central design challenge is balancing this flexibility with a consistent, understandable experience.
  </Paragraph>,
  <Heading key="how">How generative UI works</Heading>,
  <Paragraph key="common">A common approach connects AI decisions to components the product already supports:</Paragraph>,
  <ol key="steps" className="mb-1.5 list-decimal pl-4 text-[10px] leading-4.5 text-primary-100 marker:text-primary-300">
    {STEPS.map(([lead, rest]) => (
      <li key={lead} className="pl-1">
        <span className="font-semibold text-primary-50">{lead}</span> {rest}
      </li>
    ))}
  </ol>,
  <Paragraph key="sdk">
    The AI SDK documents this pattern using tool results and predefined interface components. <Link>AI SDK guide</Link>.
  </Paragraph>,
  <Heading key="trip">An example of trip planning</Heading>,
  <Paragraph key="imagine">
    Imagine a person asks, “Help me plan a three day trip to Istanbul with museums and vegetarian food.”
  </Paragraph>,
  <Paragraph key="interface">
    A generative interface could show an editable daily itinerary, a map of suggested stops, and filters for walking
    distance and interests. If the person selects “Less walking,” the application could revise the route and preserve
    activities they have pinned. Before booking anything, it would show a separate review step.
  </Paragraph>,
  <Paragraph key="illustrative">
    This is an illustrative experience. Opening hours, availability, prices, and booking actions would need connections
    to real services. Generating the interface does not make its information accurate or its actions functional.
  </Paragraph>,
  <Heading key="choosing">Choosing an approach</Heading>,
  <Paragraph key="tradeoffs">
    These approaches offer different degrees of freedom. The tradeoffs below are practical design considerations.
  </Paragraph>,
  <div key="table" className="mt-2 overflow-hidden rounded-md border border-primary-800 text-[9px] leading-3.5">
    <div className="grid grid-cols-[0.8fr_1.4fr_1fr] bg-primary-900 font-semibold text-primary-50">
      {["Approach", "What the AI produces", "Main tradeoff"].map((cell) => (
        <div key={cell} className="border-r border-primary-800 px-2 py-1.5 last:border-r-0">
          {cell}
        </div>
      ))}
    </div>
    {APPROACHES.map((row) => (
      <div key={row[0]} className="grid grid-cols-[0.8fr_1.4fr_1fr] border-t border-primary-800 text-primary-100">
        {row.map((cell) => (
          <div key={cell} className="border-r border-primary-800 px-2 py-1.5 last:border-r-0">
            {cell}
          </div>
        ))}
      </div>
    ))}
  </div>,
];

/** The page's icon wherever the app shows it: the generic page until Codex gives it one. */
function PageIcon({ dressed, className }: { dressed: boolean; className?: string }) {
  return dressed ? <Cpu className={cn(className, "text-blue-400")} /> : <Page className={className} />;
}

/** The app's cover height (`md:h-64`) at the window's scale. */
const COVER_HEIGHT = 164;

function PageView({ t, reducedMotion }: { t: number; reducedMotion: boolean }) {
  const saved = t >= SAVED;
  const dressed = t >= DRESSED;
  const shownBlocks = saved ? Math.min(BLOCKS.length, Math.floor((t - SAVED) / BLOCK_MS) + 1) : 0;
  const ease = reducedMotion ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const };
  return (
    <>
      {/* The page toolbar: breadcrumb, then favorite and the page menu. */}
      <div className="flex h-6.5 shrink-0 items-center justify-between px-3">
        <div className="flex min-w-0 items-center gap-1 text-[10px]">
          <span className="font-medium text-primary-100">Pages</span>
          <span className="text-primary-600">/</span>
          <PageIcon dressed={dressed} className="size-3 shrink-0 text-primary-400" />
          <span className="truncate text-primary-300">{saved ? PAGE_TITLE : FIRST_TITLE}</span>
        </div>
        <div className="flex items-center gap-2.5 text-primary-300">
          <Star className="size-3" />
          <Ellipsis className="size-3" />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {/* The cover runs the width of the page and opens down when it lands. */}
        <motion.div
          initial={false}
          animate={{ height: dressed ? COVER_HEIGHT : 0 }}
          transition={ease}
          className="relative overflow-hidden"
        >
          {/* Mounted from the start, so the image is loaded by the time it lands. */}
          <motion.div
            initial={false}
            animate={dressed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.04 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.9, ease: "easeOut" }}
            className="absolute inset-x-0 top-0"
            style={{ height: COVER_HEIGHT }}
          >
            <Image
              src={COVER_SRC}
              alt=""
              fill
              unoptimized
              loading="eager"
              className="object-cover"
              style={{ objectPosition: "50% 22%" }}
            />
          </motion.div>
        </motion.div>

        <div className="px-10">
          {/* Without a cover, room for the app's hover row of "Add icon" and
              "Add cover"; with one, the icon rides up over the cover's edge. */}
          <motion.div initial={false} animate={{ paddingTop: dressed ? 31 : 56 }} transition={ease} className="mx-auto max-w-122.5">
            {dressed && (
              <motion.div
                initial={reducedMotion ? false : { opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 26, delay: 0.35 }}
                className="relative -mt-13.5 mb-3.5 flex size-12.75 items-center justify-center rounded-[15px] bg-primary-950 shadow-sm"
              >
                <Cpu className="size-11 text-blue-400" />
              </motion.div>
            )}
            <motion.h2
              key={saved ? "saved" : "first"}
              initial={saved ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-5 text-[26px] leading-tight font-semibold tracking-tight text-primary-50"
            >
              {saved ? PAGE_TITLE : FIRST_TITLE}
            </motion.h2>
            {BLOCKS.slice(0, shownBlocks).map((block, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {block}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}

// ─── The page's chat ─────────────────────────────────────────────────────────

/** A reply fading in word by word, as the app streams them. */
function Message({ children, text }: { children?: React.ReactNode; text: string }) {
  return (
    <p className="text-[10px] leading-4.25 text-primary-100">
      {text.split(" ").map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: index * 0.022 }}
        >
          {word}{" "}
        </motion.span>
      ))}
      {children}
    </p>
  );
}

function ToolRow({ tool: { Icon, verb, running }, detail, note, active }: { tool: Tool; detail: string; note?: string; active: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex min-w-0 items-center gap-1.5 text-[10px]"
    >
      <span className="flex size-3 shrink-0 items-center justify-center text-primary-400">
        {active ? <SquareSpinner className="size-2.5" /> : <Icon className="size-3" />}
      </span>
      <span className="shrink-0 font-medium text-primary-200">{active ? running : verb}</span>
      <span className="truncate text-primary-500">{detail}</span>
      {note && <span className="shrink-0 text-[9px] text-primary-500">{note}</span>}
      <ArrowUp className="size-2.5 shrink-0 rotate-90 text-primary-600" />
    </motion.div>
  );
}

/** The generated image in the chat: the app's dot field while it's made, then the image. */
function GeneratedImage({ ready }: { ready: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative ml-4.5 aspect-video w-52 overflow-hidden rounded-lg bg-primary-950 glass-outline"
    >
      {ready ? (
        <motion.div
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image src={COVER_SRC} alt="" fill unoptimized loading="eager" className="object-cover" style={{ objectPosition: "50% 22%" }} />
        </motion.div>
      ) : (
        <>
          <div
            className="absolute inset-0 text-primary-500"
            style={{
              backgroundImage: "radial-gradient(currentColor 0.8px, transparent 1.2px)",
              backgroundSize: "7px 7px",
              maskImage: "radial-gradient(ellipse 65% 70% at 50% 50%, #000 15%, transparent 75%)",
            }}
          />
          <motion.div
            className="absolute inset-y-0 w-1/2"
            style={{ background: "linear-gradient(90deg, transparent, rgb(255 255 255 / 0.14), transparent)" }}
            animate={{ x: ["-100%", "250%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <Shine className="absolute bottom-2 left-2.5 text-[9px]">Creating image</Shine>
        </>
      )}
    </motion.div>
  );
}

function Transcript({ t }: { t: number }) {
  const done = t >= DONE;
  const arrived = ENTRIES_AT.filter((at) => t >= at).length;
  const scrollRef = useRef<HTMLDivElement>(null);
  // Keep the newest step in view while the run streams, as the app does.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = done ? 0 : el.scrollHeight;
  }, [arrived, done]);

  return (
    <div
      ref={scrollRef}
      className="noscrollbar min-h-0 flex-1 overflow-hidden px-3.5 pt-3 pb-3"
      // Earlier steps fade out under the title bar rather than being cut off.
      style={{ maskImage: "linear-gradient(to bottom, transparent, black 20px)" }}
    >
      <div className="flex flex-col gap-2.5">
        <div className="ml-auto max-w-[85%] rounded-2xl bg-primary-800 px-3 py-1.5 text-[10px] leading-4 text-primary-50">{PROMPT}</div>

        {done ? (
          // Once it's done, the steps fold into one line above the answer.
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1 border-b border-primary-800/70 pb-1.5 text-[10px] text-primary-400"
            >
              {MESSAGE_COUNT} messages · {TOOL_COUNT} tool calls
              <ArrowUp className="size-2.5 rotate-90" />
            </motion.div>
            <Message text="Created">
              <Link>{PAGE_TITLE}</Link>{" "}
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                with an example, the main approaches and their tradeoffs, design principles, and source links.
              </motion.span>
            </Message>
            <Message text="I generated a cover to match and gave it an icon. The content is saved and verified." />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-1.5 text-[9px] text-primary-500"
            >
              {RUN_TIME}
              <span aria-hidden>·</span>
              <Clipboard className="size-2.5" />
            </motion.div>
          </>
        ) : (
          ENTRIES.slice(0, arrived).map((entry, index) =>
            entry.kind === "message" ? (
              <Message key={index} text={entry.text} />
            ) : entry.tool === GENERATE_IMAGE ? (
              <div key={index} className="flex flex-col gap-2">
                <ToolRow {...entry} active={index === arrived - 1} />
                <GeneratedImage ready={t >= IMAGE_READY} />
              </div>
            ) : (
              <ToolRow key={index} {...entry} active={index === arrived - 1} />
            )
          )
        )}
      </div>
    </div>
  );
}

/**
 * The floating composer, as the app draws it over a page: one row until the
 * message wraps, then it grows upward with the controls on its last line.
 */
function Composer({ typed, running }: { typed: number; running: boolean }) {
  return (
    <div className="flex min-h-8 items-end gap-2 py-1 pr-1 pl-3 text-[10px]">
      <span className="flex h-6 shrink-0 items-center">
        <Attach className="size-3 text-primary-300" />
      </span>
      <span className="min-w-0 flex-1 py-1.25 leading-3.5">
        {typed > 0 ? (
          <span className="text-primary-50">
            {PROMPT.slice(0, typed)}
            <span aria-hidden className="ml-px inline-block h-3 w-px translate-y-0.5 animate-blink bg-primary-100" />
          </span>
        ) : (
          <span className="text-primary-500">Work with this page…</span>
        )}
      </span>
      <span className="flex h-6 shrink-0 items-center gap-2 text-primary-300">
        <Brain className="size-3" />
        <Bolt className="size-3" />
      </span>
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full",
          running ? "bg-primary-50" : typed > 0 ? "bg-primary-50 text-primary-950" : "bg-primary-700 text-primary-300"
        )}
      >
        {running ? <span className="size-2 rounded-xs bg-primary-950" /> : <ArrowUp className="size-3" />}
      </span>
    </div>
  );
}

type ChatMode = "input" | "details" | "icon";

/** The overlay's sizes at the window's scale: a 540px card over the bottom right, its bar 48px tall. */
const CHAT_WIDTH = 344;
const CHAT_HEIGHT = 330;
const BAR = 32;

const VERTICAL = { type: "tween" as const, duration: 0.28, ease: "linear" as const };
/** The composer growing a line as the message wraps. */
const GROW = { type: "tween" as const, duration: 0.18, ease: [0.22, 1, 0.36, 1] as const };
const SPRING = { type: "spring" as const, stiffness: 500, damping: 45, mass: 1 };

function FloatingChat({
  t,
  mode,
  fromInput,
  onMinimize,
  onShow,
  reducedMotion,
}: {
  t: number;
  mode: ChatMode;
  /** Opening from the bar grows the card straight up; to and from the button springs. */
  fromInput: boolean;
  onMinimize: () => void;
  onShow: () => void;
  reducedMotion: boolean;
}) {
  const typed = t < SEND ? Math.max(0, Math.min(PROMPT.length, Math.floor((t - TYPE_START) / TYPE_MS_PER_CHAR))) : 0;
  const running = t >= SEND && t < DONE;
  const title = t >= SAVED ? PAGE_TITLE : FIRST_TITLE;
  const icon = mode === "icon";
  const details = mode === "details";
  const instant = { duration: 0 };

  // The composer's own height, so the surface grows with it as the app's does.
  // `offsetHeight`, not a rect: the window is drawn scaled.
  const composerRef = useRef<HTMLDivElement>(null);
  const [composerHeight, setComposerHeight] = useState(BAR);
  useLayoutEffect(() => {
    const node = composerRef.current;
    if (!node) return;
    const observer = new ResizeObserver(() => setComposerHeight(Math.max(BAR, node.offsetHeight)));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{
        width: icon ? BAR : CHAT_WIDTH,
        height: icon ? BAR : details ? CHAT_HEIGHT + composerHeight - BAR : composerHeight,
        borderRadius: icon ? BAR / 2 : 18,
      }}
      transition={reducedMotion ? instant : mode === "input" ? GROW : details && fromInput ? VERTICAL : SPRING}
      onClick={icon ? onShow : undefined}
      className={cn(
        "absolute right-2.5 bottom-2.5 overflow-hidden glass-outline transition-colors duration-200",
        mode === "input" ? "bg-transparent" : "bg-primary-900 shadow-lg shadow-(color:--demo-shadow)",
        icon && "cursor-pointer"
      )}
    >
      {/* The card: its title bar, with minimize, over the transcript. */}
      <motion.div
        initial={false}
        animate={{ opacity: details ? 1 : 0 }}
        transition={reducedMotion ? instant : { duration: 0.2, delay: details && !fromInput ? 0.12 : 0 }}
        aria-hidden={!details}
        inert={!details}
        className="absolute inset-y-0 right-0 flex flex-col"
        style={{ width: CHAT_WIDTH, paddingBottom: composerHeight }}
      >
        <div className="flex h-8 shrink-0 items-center gap-1 border-b border-primary-800/70 px-2">
          <button
            type="button"
            onClick={onMinimize}
            aria-label="Minimize chat"
            className="pointer-events-auto flex size-5 cursor-pointer items-center justify-center rounded-md text-primary-300 transition-colors hover:bg-primary-800 hover:text-primary-50 focus-visible:outline-1 focus-visible:outline-primary-500"
          >
            <Minus className="size-3" />
          </button>
          <span className="min-w-0 flex-1 truncate text-[10px] font-medium text-primary-50">{title}</span>
          <Ellipsis className="mr-1 size-3 shrink-0 text-primary-400" />
        </div>
        {t >= SEND && <Transcript t={t} />}
      </motion.div>

      {/* The composer, always at the bottom: the whole surface while it's a bar. */}
      <motion.div
        ref={composerRef}
        initial={false}
        animate={{ opacity: icon ? 0 : 1 }}
        transition={reducedMotion ? instant : { duration: 0.15, delay: icon ? 0 : 0.12 }}
        aria-hidden={icon}
        inert={icon}
        className={cn("absolute right-0 bottom-0 bg-primary-900", details && "border-t border-primary-800/70")}
        style={{ width: CHAT_WIDTH, borderRadius: 18 }}
      >
        <Composer typed={typed} running={running} />
      </motion.div>

      {/* Minimized: the Mains mark, or a spinner while the page's run works. */}
      <motion.button
        type="button"
        initial={false}
        animate={{ opacity: icon ? 1 : 0 }}
        transition={reducedMotion ? instant : { duration: 0.15, delay: icon ? 0.12 : 0 }}
        onClick={(event) => {
          event.stopPropagation();
          onShow();
        }}
        aria-label="Show chat"
        tabIndex={icon ? 0 : -1}
        aria-hidden={!icon}
        className={cn(
          "absolute right-0 bottom-0 flex size-8 cursor-pointer items-center justify-center rounded-full text-primary-100 hover:bg-primary-800 focus-visible:outline-1 focus-visible:outline-primary-500",
          !icon && "pointer-events-none"
        )}
      >
        {running ? <SquareSpinner className="size-3" /> : <Mains className="size-3.5" />}
      </motion.button>
    </motion.div>
  );
}

// ─── The window ──────────────────────────────────────────────────────────────

const ATLAS_TYPES = [
  { label: "All", Icon: Library },
  { label: "Pages", Icon: Page },
  { label: "Docs", Icon: Passport },
  { label: "Images", Icon: Picture },
];

const ROW = "flex items-center gap-2 rounded-lg px-1.5 py-1 text-[10px] text-primary-100";

function AtlasSidebar({ title, dressed }: { title: string; dressed: boolean }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col pr-2 pb-2 pl-1">
      <div className="px-1.5 pb-1 text-xs font-medium tracking-tight text-primary-50">Atlas</div>
      <div className={cn(ROW, "mt-1 mb-2")}>
        <Edit className="size-3 shrink-0" />
        New page
      </div>
      {ATLAS_TYPES.map(({ label, Icon }) => (
        <div key={label} className={cn(ROW, label === "Pages" && "bg-primary-50/5 glass-outline")}>
          <Icon className="size-3 shrink-0" />
          {label}
        </div>
      ))}

      <div className="mt-4 px-1.5 py-1 text-[10px] text-primary-400">Recents</div>
      <div className={cn(ROW, "bg-primary-50/5 glass-outline")}>
        <PageIcon dressed={dressed} className="size-3 shrink-0" />
        <span className="truncate">{title}</span>
      </div>
      <div className={ROW}>
        <Cat className="size-3 shrink-0 text-blue-400" />
        <span className="truncate">okanbilal.com</span>
      </div>

      <div className="mt-3 px-1.5 py-1 text-[10px] text-primary-400">Projects</div>
      {WORK_PROJECTS.map(({ name, Icon, tint }) => (
        <div key={name} className={ROW}>
          <Icon className={cn("size-3 shrink-0", tint)} />
          <span className="truncate">{name}</span>
        </div>
      ))}

      <div className={cn(ROW, "mt-auto")}>
        <Trash className="size-3 shrink-0" />
        Trash
      </div>
    </div>
  );
}

const DESIGN_WIDTH = 1152;
const DESIGN_HEIGHT = 648;

/**
 * The run, played once: its clock advances only while the window is in view,
 * so it waits for the visitor and pauses when scrolled away.
 */
function Run({ shown, reducedMotion }: { shown: boolean; reducedMotion: boolean }) {
  const [t, setT] = useState(0);
  const elapsed = useRef(0);
  // The visitor's choice, once they make one; until then the chat follows the run.
  const [chosen, setChosen] = useState<"details" | "icon" | null>(null);

  const running = shown && !reducedMotion;
  useEffect(() => {
    if (!running || elapsed.current > END) return;
    const base = elapsed.current;
    const start = performance.now();
    const clock = setInterval(() => {
      elapsed.current = base + performance.now() - start;
      setT(elapsed.current);
      if (elapsed.current > END) clearInterval(clock);
    }, 40);
    return () => clearInterval(clock);
  }, [running]);

  const at = reducedMotion ? END : t;
  const title = at >= SAVED ? PAGE_TITLE : FIRST_TITLE;
  const dressed = at >= DRESSED;
  const mode: ChatMode = at < SEND ? "input" : (chosen ?? "details");

  return (
    <ScaleToFit designWidth={DESIGN_WIDTH} designHeight={DESIGN_HEIGHT}>
      <WindowFrame
        tabs={
          <>
            <WindowTab icon={<PageIcon dressed={dressed} className="size-3 shrink-0 text-primary-200" />} title={title} />
            <Plus className="mb-2 size-3.5 shrink-0 text-primary-300" />
          </>
        }
        titleBarEnd={<Globe className="size-3.5" />}
        rail={<NavigationRail mode="work" activeLabel="Atlas" showSpaces />}
        sidebar={<AtlasSidebar title={title} dressed={dressed} />}
      >
        <PageView t={at} reducedMotion={reducedMotion} />
        <FloatingChat
          t={at}
          mode={mode}
          fromInput={chosen === null}
          onMinimize={() => setChosen("icon")}
          onShow={() => setChosen("details")}
          reducedMotion={reducedMotion}
        />
      </WindowFrame>
    </ScaleToFit>
  );
}

/** Atlas with a page and its chat; plays once in view, and the chat can be minimized. */
export function AtlasDemo({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion() ?? false;
  const { ref, visible } = useInView(0.35, "0px", false);
  return (
    <div
      ref={ref}
      role="group"
      aria-label="Mains Atlas: Codex writes a page about generative UI from the page’s own chat"
      className={cn("relative", className)}
    >
      <Run shown={visible} reducedMotion={reducedMotion} />
    </div>
  );
}
