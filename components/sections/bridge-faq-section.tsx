import { ChevronDown } from "@/components/icons";
import { SectionHeader } from "@/components/section-header";
import { BRIDGE_PLAN } from "@/lib/constants";

const QUESTIONS = [
  {
    question: "How do I join the beta?",
    answer: "Open Settings › Bridge in the Mains app and sign in with your email or GitHub. Signing in is your request; there’s nothing else to fill in.",
  },
  {
    question: "What happens after I sign in?",
    answer: "Your account is on the list. We’re letting people in in small groups, and Bridge starts syncing as soon as your access is approved. Until then, your chats and pages stay on your computer.",
  },
  {
    question: "Does Bridge run my agents in the cloud?",
    answer: "No. Your agents, terminals, and files stay on the computer that runs them. Bridge only carries encrypted copies of your Atlas pages and chats between your devices.",
  },
  {
    question: "Can I continue a chat on another computer?",
    answer: "You can read every chat on every device. To keep working in one, connect to the computer that started it. Atlas pages are different: you can edit them anywhere.",
  },
  {
    question: "What happens if two devices edit the same page?",
    answer: "Mains keeps both versions. Pick the one you want, and the page’s history keeps the other.",
  },
  {
    question: "What doesn’t sync?",
    answer: `Agent sign-ins, connections, and tokens stay on each computer, as do projects you keep local. Files larger than ${BRIDGE_PLAN.maxFileSize} stay on the computer that made them.`,
  },
  {
    question: "Does turning off sync for a project remove it from my other devices?",
    answer: "No. Its new chats and changes stay on this computer from then on, but copies that already synced stay where they are.",
  },
  {
    question: "What if I lose my recovery code?",
    answer: "If you still have a signed-in device, create a new code in Settings › Bridge. If you lose every device and the code, your encrypted data can’t be recovered, not even by us.",
  },
  {
    question: "What happens if I run out of storage or my subscription ends?",
    answer: "You can still read everything and open files that already synced. New changes wait on your computer and sync once you have room again or renew.",
  },
  {
    question: "Do I need Bridge to use Mains on my phone?",
    answer: "No. The iPhone app connects to one of your computers and shows what’s on it. With Bridge, that includes the chats and pages synced from your other computers.",
  },
];

export function BridgeFaqSection() {
  return (
    <section aria-label="Bridge questions" className="relative mx-auto max-w-304 px-5 pb-28 sm:px-8 lg:pb-36">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
        <SectionHeader
          layout="column"
          title="Questions"
          description="How Bridge handles your data, your devices, and your plan."
          titleClassName="leading-tight text-primary-50"
          descriptionClassName="mt-1 max-w-sm text-lg leading-relaxed"
        />

        <div className="border-t border-primary-800">
          {QUESTIONS.map(({ question, answer }) => (
            <details key={question} className="group border-b border-primary-800">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-lg text-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 [&::-webkit-details-marker]:hidden">
                {question}
                <ChevronDown
                  aria-hidden
                  className="mt-1.5 size-4 shrink-0 text-primary-500 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                />
              </summary>
              <p className="max-w-2xl pb-6 text-base leading-relaxed text-primary-400">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
