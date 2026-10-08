import Image from "next/image";
import { EDITED_FILES } from "@/components/demo/full-access-data";
import { TurnChangesCard } from "@/components/demo/turn-changes-card";
import { AgentTurn, ChatLayout, Composer, TurnMeta, UserTurn } from "@/components/demo/voice-chats";
import { WorkAccordion } from "@/components/demo/work-accordion";
import {
  ArrowUp,
  Bash,
  Bolt,
  ChevronDown,
  Codex,
  Edit,
  Glob,
  Goal,
  Grep,
  React as ReactFileIcon,
  Read,
} from "@/components/icons";

/**
 * The developer page's chat: a Codex turn that adds a confirmation before Full
 * Access, folded the way the app leaves a finished turn — the request, the
 * work behind "N messages · N tool calls", then the answer and what it edited.
 *
 * A server component: only the fold and the card's file list are interactive.
 */

const ICON = "size-3 shrink-0";

/** A collapsed run of tool calls: up to three of its kinds, then a summary. */
function ToolGroup({ icons, summary }: { icons: React.ReactNode; summary: string }) {
  return (
    <div className="flex items-center gap-1 text-[10px] text-primary-400">
      <span className="flex items-center gap-1">{icons}</span>
      <span className="truncate">{summary}</span>
      <ArrowUp className="size-2.5 shrink-0 rotate-90" />
    </div>
  );
}

/**
 * A file reference in an answer, which the app opens in its editor. Drawn in
 * the theme's accent, like the app's links; blue where no theme sets one.
 */
function FileCitation({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 align-bottom text-(--color-accent,var(--color-blue-400))">
      <ReactFileIcon className="size-3 text-sky-400" />
      {children}
    </span>
  );
}

const COMPOSER_CONTROLS = (
  <>
    <span className="flex items-center gap-1 text-[10px] text-primary-50">
      <Codex className="size-3" />
      <span>GPT 6 Sol Extra High</span>
      <ChevronDown className="size-2.5 text-primary-400" fill="currentColor" />
    </span>
    <Bolt className="size-3" />
    <span className="flex items-center gap-1 text-[10px] text-primary-50">
      <Edit className="size-3" />
      <span>Write</span>
      <ChevronDown className="size-2.5 text-primary-400" fill="currentColor" />
    </span>
    <Goal className="size-3" />
  </>
);

export function FullAccessChat() {
  return (
    <ChatLayout footer={<Composer voice="idle" controls={COMPOSER_CONTROLS} />}>
      <div className="flex flex-col items-end gap-1.5">
        <Image
          src="/demos/full-access-modal.png"
          alt="A screenshot of a confirmation modal asking to turn on Full Access"
          width={132}
          height={132}
          sizes="52px"
          className="size-13 rounded-xl glass-outline"
        />
        <UserTurn>
          <p>
            When enabling &quot;Full Access&quot; permission mode for a project in codex,
            display a confirmation modal similar to the attached screenshot.
          </p>
          <p>Requirements:</p>
          <ul className="list-disc pl-4">
            <li>
              Show the modal every time the user attempts to enable Full Access, even if
              previously confirmed.
            </li>
            <li>Use existing app components and design patterns.</li>
            <li>Only enable Full Access after the user confirms.</li>
            <li>Canceling should leave the current permission mode unchanged.</li>
            <li>Keep the implementation simple and consistent with the existing codebase.</li>
          </ul>
        </UserTurn>
      </div>

      <WorkAccordion label="7 messages · 86 tool calls">
        <AgentTurn>
          I&apos;ll trace where project permission mode changes in the desktop app, then
          add the confirmation using its existing dialog components. I&apos;ll check the
          relevant flows and tests after the change.
        </AgentTurn>
        <ToolGroup
          icons={<><Bash className={ICON} /><Read className={ICON} /><Glob className={ICON} /></>}
          summary="Read a file, looked for files, ran commands"
        />
        <AgentTurn>
          I&apos;m using the frontend design skill for the modal&apos;s layout and
          interaction details. I found unrelated edits already in the workspace and will
          keep this change separate from them.
        </AgentTurn>
        <ToolGroup
          icons={<><Read className={ICON} /><Grep className={ICON} /><Glob className={ICON} /></>}
          summary="Read files, searched the code, looked for files"
        />
        <AgentTurn>
          I found two ways to select Codex Full Access: the project composer&apos;s
          permission menu and the Codex settings sandbox selector. I&apos;ll route both
          through one confirmation modal so the mode changes only after confirmation.
        </AgentTurn>
        <ToolGroup
          icons={<><Read className={ICON} /><Grep className={ICON} /><Glob className={ICON} /></>}
          summary="Edited files, read files, searched the code"
        />
        <AgentTurn>
          The confirmation is wired into both selectors. Selecting Full Access now opens
          the modal while the current value stays in place; confirming applies the
          selection, and canceling dismisses it. I&apos;ve added a composer test for
          cancel, confirm, and selecting Full Access again.
        </AgentTurn>
        <ToolGroup
          icons={<><Bash className={ICON} /><Edit className={ICON} /><Grep className={ICON} /></>}
          summary="Edited files, read files, searched the code"
        />
        <AgentTurn>
          Both focused interaction tests pass. They cover the composer and settings paths,
          including cancel leaving the mode unchanged. Type checking and lint are still
          running.
        </AgentTurn>
        <ToolGroup
          icons={<><Bash className={ICON} /><Edit className={ICON} /></>}
          summary="Edited files, ran commands"
        />
        <AgentTurn>
          Type checking passed. Lint found one repository import convention: shared UI
          must come through its index. I&apos;ve fixed that import and am rerunning the
          focused checks.
        </AgentTurn>
        <ToolGroup
          icons={<><Bash className={ICON} /><Edit className={ICON} /><Grep className={ICON} /></>}
          summary="Edited a file, searched the code, ran commands"
        />
        <AgentTurn>
          The focused tests and lint now pass. I&apos;m finishing the renderer type check
          and reviewing the changed files; the unrelated workspace edits remain untouched.
        </AgentTurn>
      </WorkAccordion>

      <div className="flex flex-col gap-0.5">
        <AgentTurn>
          Added a Codex Full Access confirmation modal to the project composer and Codex
          settings. It appears on <strong className="font-semibold text-primary-50">every</strong>{" "}
          Full Access selection, including after a previous confirmation. Full Access is
          applied only when the user confirms; Cancel leaves the current mode unchanged.
        </AgentTurn>
        <AgentTurn>
          The modal uses the app&apos;s existing{" "}
          <FileCitation>Modal and Button components</FileCitation>. Type checking, lint,
          and the focused tests passed (13 tests).
        </AgentTurn>
      </div>

      <div className="flex flex-col gap-2.5">
        <TurnChangesCard files={EDITED_FILES} />
        <TurnMeta duration="6m 14s" />
      </div>
    </ChatLayout>
  );
}
