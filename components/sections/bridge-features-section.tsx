import { Chat, Library, Refresh, Shield } from "@/components/icons";
import { SectionHeader } from "@/components/section-header";

const FEATURES = [
  {
    title: "End-to-end encrypted",
    description: "Your pages, chats, and files are encrypted on your computer before they’re sent. Bridge only ever stores data it can’t read.",
    Icon: Shield,
  },
  {
    title: "Atlas on every device",
    description: "Start a page on one computer and keep writing on another. If two devices change the same page, Mains keeps both versions so you can choose.",
    Icon: Library,
  },
  {
    title: "Your chats, everywhere",
    description: "Every conversation shows up on all your devices, so you can look back at what an agent did from whichever computer you’re on. Picking a chat up on another computer is coming next.",
    Icon: Chat,
  },
  {
    title: "Works offline, syncs later",
    description: "Every computer keeps working without a connection. Changes wait on your device and catch up as soon as you’re back online.",
    Icon: Refresh,
  },
] as const;

export function BridgeFeaturesSection() {
  return (
    <section aria-label="Bridge features" className="relative mx-auto max-w-304 px-5 pt-8 pb-28 sm:px-8 lg:pb-36">
      <SectionHeader
        layout="column"
        title="Pick up where you left off."
        description="Bridge keeps your Atlas pages and chats in step across the computers you use Mains on. Each one keeps its own copy, so your work is there even without a connection."
        titleClassName="max-w-4xl leading-tight text-primary-50"
        descriptionClassName="mt-1 max-w-2xl text-lg leading-relaxed sm:text-xl"
      />

      <ul className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5">
        {FEATURES.map(({ title, description, Icon }) => (
          <li key={title} className="glass-card rounded-4xl p-6 sm:p-7 lg:p-8">
            <span aria-hidden className="mb-5 block text-primary-400">
              <Icon className="size-7" />
            </span>
            <h3 className="text-xl font-semibold tracking-tight text-primary-50">{title}</h3>
            <p className="mt-3 text-base leading-relaxed text-primary-300 sm:text-lg">{description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
