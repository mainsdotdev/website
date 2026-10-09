import { CodeLine } from "@/components/demo/code-line";
import { DiffStat } from "@/components/demo/diff-stat";
import { FloatingChat, FloatingChatComposer } from "@/components/demo/floating-chat";
import { NavigationRail } from "@/components/demo/navigation-rail";
import { OrbFlightSlot } from "@/components/orb-flight";
import { ScaleToFit } from "@/components/demo/scale-to-fit";
import {
  ArrowUp,
  Branch,
  Chat,
  ChevronDown,
  Clipboard,
  Edit,
  MinimizeView,
  React as ReactFileIcon,
  Refresh,
  Review,
  Search,
  SidebarClose,
  Trash,
} from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Mains' Review: every uncommitted change as one scrolling diff, a comment
 * left on a line, and a chat asking about it — the review use case, drawn
 * instead of filmed. Same chrome and rail as the hero's window.
 */

type Row =
  | { kind: "context" | "add" | "del"; line: number; code: string; comment?: string }
  | { kind: "fold"; count: number };

/** The comment the chat's "1 review comment" points at. */
const COMMENT = "Muse was pinned here before. Was dropping it on purpose?";

const APP_WINDOW_DIFF: Row[] = [
  { kind: "context", line: 71, code: "const PINNED_APPS: RailItem[] = [" },
  { kind: "del", line: 72, code: '  { label: "Muse", icon: Muse },', comment: COMMENT },
  { kind: "context", line: 72, code: '  { label: "Figma", icon: Figma },' },
  { kind: "context", line: 73, code: '  { label: "Linear", icon: Linear },' },
  { kind: "context", line: 74, code: "];" },
  { kind: "fold", count: 48 },
  { kind: "del", line: 169, code: "      aria-hidden" },
  { kind: "del", line: 170, code: '      className="absolute -right-2 bottom-0 size-2"' },
  { kind: "del", line: 171, code: "      style={{" },
  { kind: "del", line: 172, code: "        background:" },
  { kind: "del", line: 173, code: '          "radial-gradient(circle at top right, transparent 8px, var(--demo-content) 8px)",' },
  { kind: "del", line: 174, code: "      }}" },
  { kind: "del", line: 175, code: "    />" },
  { kind: "del", line: 176, code: "  </div>" },
  { kind: "del", line: 177, code: ");" },
  { kind: "del", line: 178, code: "}" },
  { kind: "context", line: 128, code: "function TitleBar() {" },
  { kind: "context", line: 129, code: "  return (" },
  { kind: "context", line: 130, code: '    <div className="flex shrink-0 items-end">' },
  { kind: "fold", count: 15 },
  { kind: "context", line: 148, code: '      <div className="flex min-w-0 flex-1 items-end gap-2 pr-3">' },
  { kind: "del", line: 201, code: "        <WindowTab />" },
  { kind: "add", line: 149, code: "        <ChatTabStrip />" },
  { kind: "context", line: 150, code: '        <Plus className="mb-2 size-3.5 shrink-0 text-primary-500" />' },
  { kind: "context", line: 151, code: "" },
  { kind: "context", line: 152, code: "        <WindowToolbar />" },
  { kind: "fold", count: 14 },
  { kind: "context", line: 167, code: '        active ? "bg-primary-900 text-primary-50" : "text-primary-300",' },
  { kind: "context", line: 168, code: "      )}" },
  { kind: "context", line: 169, code: "    >" },
  { kind: "add", line: 170, code: "      {/* Only the active destination asks for `filled`. */}" },
  { kind: "add", line: 171, code: "      {active ? (" },
  { kind: "add", line: 172, code: '        <Icon className={cn("size-3.5", iconClassName)} filled />' },
  { kind: "add", line: 173, code: "      ) : (" },
  { kind: "del", line: 222, code: '      <Icon className={cn("size-3.5", iconClassName)} />' },
  { kind: "add", line: 174, code: '        <Icon className={cn("size-3.5", iconClassName)} />' },
  { kind: "add", line: 175, code: "      )}" },
  { kind: "context", line: 176, code: "    </span>" },
];

const ROW_TINT = {
  add: "bg-[#879a39]/14 before:bg-[#879a39]",
  del: "bg-[#d14d41]/14 before:bg-[#d14d41]",
  context: "",
};

function CommentCard({ line, code, comment }: { line: number; code: string; comment: string }) {
  return (
    <div className="my-1.5 mr-90 ml-12 rounded-xl px-2.5 py-2 glass-outline bg-(--demo-content)">
      <div className="mb-1.5 flex items-center gap-2 text-[8.5px] text-primary-400">
        <span className="min-w-0 flex-1 truncate">components/demo/app-window.tsx · L{line}</span>
        <Edit className="size-2.5" />
        <Trash className="size-2.5" />
      </div>
      <pre className="mb-1.5 truncate rounded-md bg-primary-50/5 px-1.5 py-1 font-mono text-[8.5px] text-primary-400">
        {code.trim()}
      </pre>
      <p className="text-[9.5px] text-primary-100">{comment}</p>
    </div>
  );
}

function DiffRows({ rows }: { rows: Row[] }) {
  return (
    // Monospace goes on the code rows only, not this wrapper: the site's
    // `font-sans` can't undo it (its --font-sans resolves on <body>, not
    // :root), so the fold labels and comment cards inherit the page font.
    <div className="text-[9px] leading-[16px]">
      {rows.map((row, index) =>
        row.kind === "fold" ? (
          <div key={index} className="mx-1.5 my-1 rounded-md bg-primary-900/50 px-2 py-1 text-[8.5px] text-primary-400">
            {row.count} unmodified lines
          </div>
        ) : (
          <div key={index}>
            <div
              className={cn(
                "relative flex font-mono before:absolute before:inset-y-0 before:left-0 before:w-0.5",
                ROW_TINT[row.kind]
              )}
            >
              <span
                className={cn(
                  "w-10 shrink-0 pr-3 text-right tabular-nums",
                  row.kind === "add" ? "text-[#879a39]" : row.kind === "del" ? "text-[#d14d41]" : "text-primary-500"
                )}
              >
                {row.line}
              </span>
              <span className="min-w-0 flex-1 truncate pr-4 whitespace-pre text-primary-200">
                <CodeLine code={row.code} />
              </span>
            </div>
            {row.comment && <CommentCard line={row.line} code={row.code} comment={row.comment} />}
          </div>
        )
      )}
    </div>
  );
}

function FileHeader({
  path,
  status,
  additions,
  deletions,
  open,
}: {
  path: string;
  status: "M" | "A";
  additions: number;
  deletions: number;
  open: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5 border-b border-primary-800/50 px-3 py-1.5">
      <ArrowUp className={cn("size-2.5 text-primary-400", open ? "rotate-180" : "rotate-90")} />
      <ReactFileIcon className="size-3 text-blue-400" />
      <span className="min-w-0 flex-1 truncate text-[10px] text-primary-100">{path}</span>
      <span className="text-[9px] text-primary-400">{status}</span>
      <DiffStat additions={additions} deletions={deletions} className="font-mono text-[9px]" />
    </div>
  );
}

/** The review toolbar's unified/split switch, drawn as the app draws it. */
function DiffLayoutIcon() {
  return (
    <svg aria-hidden className="size-3.5" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1" />
      <path d="M5 6h14v5H5z" fill="#d14d41" opacity=".65" />
      <path d="M5 13h14v5H5z" fill="#879a39" opacity=".65" />
    </svg>
  );
}

function TitleBar() {
  return (
    <div className="flex shrink-0 items-center gap-3 px-3 py-2.5">
      <div className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
      </div>
      <SidebarClose className="size-3.5 text-primary-200" />

      <div className="ml-3 flex min-w-0 flex-1 items-center gap-1.5 text-primary-400">
        <Review className="size-3.5" />
        <span className="text-[11px] font-medium">Review</span>
        <span className="truncate text-[10px]">Uncommitted changes · 51 files</span>
      </div>

      <div className="flex items-center gap-3 text-primary-400">
        <Search className="size-3.5" />
        <DiffLayoutIcon />
        <Refresh className="size-3.5" />
        <MinimizeView className="size-3.5" />
      </div>
    </div>
  );
}

function Transcript() {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="ml-auto flex flex-col items-end gap-1.5">
        <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] text-primary-200 glass-outline">
          <Chat className="size-2.5 text-primary-400" />1 review comment
        </span>
        <span className="rounded-2xl bg-primary-900/50 px-2.5 py-1.5 text-[10px] text-primary-200">why?</span>
      </div>
      <p className="text-[10px] leading-4.5 text-primary-200">
        I&apos;ll check the change around that icon to see what was removed and why.
      </p>
      <div className="flex items-center gap-1.5 text-[9px] text-primary-400">
        <span>12s</span>
        <span>·</span>
        <Clipboard className="size-2.5" />
        <Branch className="size-2.5" />
      </div>
    </div>
  );
}

const DESIGN_WIDTH = 1152;
const DESIGN_HEIGHT = 648;

export function ReviewDemo({ className }: { className?: string }) {
  return (
    <ScaleToFit
      designWidth={DESIGN_WIDTH}
      designHeight={DESIGN_HEIGHT}
      // Below `lg` the window is a picture: its controls are too small to hit.
      className={cn("pointer-events-none lg:pointer-events-auto", className)}
    >
      <div
        role="group"
        aria-label="Mains reviewing uncommitted changes as one diff, with a comment left on a removed line and a chat asking about it"
        className="relative h-full w-full overflow-hidden bg-primary-950 text-left text-primary-200 select-none glass-outline"
      >
        <div className="relative flex h-full flex-col bg-(--demo-chrome-translucent) backdrop-blur-2xl">
          <TitleBar />
          <div className="flex min-h-0 flex-1">
            <NavigationRail voiceSlot={<OrbFlightSlot stop="case-review" className="mb-1 size-5" />} />

            <div className="relative mr-1 mb-1 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-(--demo-content)">
              <div className="min-h-0 flex-1 overflow-y-auto pb-24 noscrollbar">
                <FileHeader path="components/demo/app-window.tsx" status="M" additions={49} deletions={152} open />
                <DiffRows rows={APP_WINDOW_DIFF} />
                <FileHeader path="components/demo/browser-demo.tsx" status="A" additions={248} deletions={0} open={false} />
              </div>

              <FloatingChat
                title="Question About Removed Icon"
                titleAccessory={<ChevronDown className="size-2.5 shrink-0 text-primary-400" fill="currentColor" />}
                composer={<FloatingChatComposer />}
              >
                <Transcript />
              </FloatingChat>
            </div>
          </div>
        </div>
      </div>
    </ScaleToFit>
  );
}
