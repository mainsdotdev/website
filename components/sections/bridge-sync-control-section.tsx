import { BridgeSettingsDemo } from "@/components/demo/bridge-settings-demo";
import { SectionHeader } from "@/components/section-header";
import { BRIDGE_PLAN } from "@/lib/constants";

const DETAILS = [
  {
    title: "Keep a project local",
    description: "Turn off sync for a project, and its new chats and changes stay on this computer.",
  },
  {
    title: "Files when you open them",
    description: `Images, documents, and attachments up to ${BRIDGE_PLAN.maxFileSize} sync too, and download when you open them. Larger files stay where they were made.`,
  },
  {
    title: "Bring your history",
    description: "Include your existing chats and Atlas when you sign in, or add them later from Settings.",
  },
  {
    title: "Sign-ins stay put",
    description: "Agent sign-ins, connections, and tokens never sync. Each computer keeps its own.",
  },
];

export function BridgeSyncControlSection() {
  return (
    <section aria-label="Choose what syncs" className="relative mx-auto max-w-304 px-5 pb-28 sm:px-8 lg:pb-36">
      <SectionHeader
        layout="column"
        title="You decide what leaves your computer."
        description="Sign in once on each computer, then choose which projects sync. Everything else in Settings › Bridge is there too: your devices, storage, and recovery code."
        titleClassName="max-w-4xl leading-tight text-primary-50"
        descriptionClassName="mt-1 max-w-2xl text-lg leading-relaxed sm:text-xl"
      />

      <div className="mt-12 overflow-hidden rounded-xl sm:mt-16" style={{ maskImage: "linear-gradient(to bottom, black 0%, black 78%, transparent 100%)" }}>
        <BridgeSettingsDemo />
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-10 lg:mt-12 lg:grid-cols-4 lg:gap-12">
        {DETAILS.map(({ title, description }) => (
          <div key={title}>
            <h3 className="text-lg font-medium tracking-tight text-primary-50">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-primary-400 sm:text-base">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
