import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import styles from "@/components/sections/bridge-faq-section.module.css";
import { FaqHashOpener } from "@/components/sections/faq-hash-opener";
import { BRIDGE_PLAN, MAINS_DOCS_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Question = { id: string; question: string; answer: string };

// Every question has an id, so a link like /bridge#recovery-code opens it.
const GROUPS: { id: string; title: string; questions: Question[] }[] = [
  {
    id: "faq-getting-started",
    title: "Getting started",
    questions: [
      {
        id: "join-beta",
        question: "How do I join the beta?",
        answer: "Open Settings › Bridge in the Mains app and sign in with your email or GitHub. Signing in is your request; there’s nothing else to fill in.",
      },
      {
        id: "after-sign-in",
        question: "What happens after I sign in?",
        answer: "Your account is on the list. We’re letting people in in small groups, and Bridge starts syncing as soon as your access is approved. Until then, your chats and pages stay on your computer.",
      },
      {
        id: "agents-in-cloud",
        question: "Does Bridge run my agents in the cloud?",
        answer: "No. Your agents, terminals, and files stay on the computer that runs them. Bridge only carries encrypted copies of your Atlas pages and chats between your devices.",
      },
      {
        id: "phone",
        question: "Do I need Bridge to use Mains on my phone?",
        answer: "No. The iPhone app connects to one of your computers and shows what’s on it. With Bridge, that includes the chats and pages synced from your other computers.",
      },
    ],
  },
  {
    id: "faq-syncing",
    title: "Syncing",
    questions: [
      {
        id: "continue-chat",
        question: "Can I continue a chat on another computer?",
        answer: "That’s coming in a later version of Bridge. For now, every chat is there to read on all your devices, and you keep working in it on the computer that started it. Atlas pages already go everywhere: edit them on any computer.",
      },
      {
        id: "page-conflicts",
        question: "What happens if two devices edit the same page?",
        answer: "Mains keeps both versions. Pick the one you want, and the page’s history keeps the other.",
      },
      {
        id: "what-doesnt-sync",
        question: "What doesn’t sync?",
        answer: `Agent sign-ins, connections, and tokens stay on each computer, as do projects you keep local. Files larger than ${BRIDGE_PLAN.maxFileSize} stay on the computer that made them.`,
      },
      {
        id: "local-only-projects",
        question: "Does turning off sync for a project remove it from my other devices?",
        answer: "No. Its new chats and changes stay on this computer from then on, but copies that already synced stay where they are.",
      },
    ],
  },
  {
    id: "faq-account",
    title: "Account and plan",
    questions: [
      {
        id: "recovery-code",
        question: "What if I lose my recovery code?",
        answer: "If you still have a signed-in device, create a new code in Settings › Bridge. If you lose every device and the code, your encrypted data can’t be recovered, not even by us.",
      },
      {
        id: "storage-or-subscription",
        question: "What happens if I run out of storage or my subscription ends?",
        answer: "You can still read everything and open files that already synced. New changes wait on your computer and sync once you have room again or renew.",
      },
    ],
  },
];

/** The FAQ's way out: support and the docs, so the page doesn't end in a dead end. */
function HelpCard({ className }: { className?: string }) {
  return (
    <div className={cn("glass-card rounded-3xl p-6 sm:p-7", className)}>
      <p className="text-lg font-medium tracking-tight text-primary-50">Still have questions?</p>
      <p className="mt-2 text-base leading-relaxed text-primary-400">
        Get in touch, or look through the docs for setup details.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/support"
          className="rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-950 transition-opacity hover:opacity-90"
        >
          Contact support
        </Link>
        <a
          href={MAINS_DOCS_URL}
          className="rounded-full bg-primary-50/10 px-4 py-2 text-sm font-medium text-primary-100 transition-colors hover:bg-primary-50/15"
        >
          Read the docs
        </a>
      </div>
    </div>
  );
}

/** A plus whose vertical stroke folds away while its answer is open. */
function ToggleIcon() {
  return (
    <span
      aria-hidden
      className="relative mt-0.5 size-6 shrink-0 rounded-full border border-primary-700 text-primary-400 transition-colors group-open:border-primary-500 group-open:text-primary-100 group-hover/summary:border-primary-500 group-hover/summary:text-primary-100"
    >
      <span className="absolute top-1/2 left-1/2 h-px w-2.5 -translate-x-1/2 -translate-y-1/2 bg-current" />
      <span className="absolute top-1/2 left-1/2 h-2.5 w-px -translate-x-1/2 -translate-y-1/2 bg-current transition-transform duration-200 group-open:scale-y-0 motion-reduce:transition-none" />
    </span>
  );
}

export function BridgeFaqSection() {
  return (
    <section aria-label="Bridge questions" className="relative mx-auto max-w-304 px-5 pb-28 sm:px-8 lg:pb-36">
      <FaqHashOpener />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader
            layout="column"
            title="Questions"
            description="How Bridge handles your data, your devices, and your plan."
            titleClassName="leading-tight text-primary-50"
            descriptionClassName="mt-1 max-w-sm text-lg leading-relaxed"
          />

          <nav aria-label="Question topics" className="mt-8 hidden flex-col items-start gap-2 lg:flex">
            {GROUPS.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="flex items-baseline gap-2 text-base text-primary-400 transition-colors hover:text-primary-50"
              >
                {group.title}
                <span className="text-sm text-primary-600 tabular-nums">{group.questions.length}</span>
              </a>
            ))}
          </nav>

          <HelpCard className="mt-10 hidden max-w-sm lg:block" />
        </div>

        <div className="flex flex-col gap-12">
          {GROUPS.map((group, groupIndex) => (
            <div key={group.id} id={group.id} className="scroll-mt-28">
              <h3 className="mb-2 text-sm font-medium text-primary-500">{group.title}</h3>
              <div className="border-t border-primary-800">
                {group.questions.map(({ id, question, answer }, index) => (
                  <details
                    key={id}
                    id={id}
                    // One answer open at a time; the first one starts open.
                    name="bridge-faq"
                    open={groupIndex === 0 && index === 0}
                    className={cn("group scroll-mt-28 border-b border-primary-800", styles.item)}
                  >
                    <summary className="group/summary flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-lg text-primary-100 transition-colors hover:text-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 group-open:text-primary-50 [&::-webkit-details-marker]:hidden">
                      {question}
                      <ToggleIcon />
                    </summary>
                    <p className="max-w-2xl pr-12 pb-6 text-base leading-relaxed text-primary-400">{answer}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <HelpCard className="lg:hidden" />
        </div>
      </div>
    </section>
  );
}
