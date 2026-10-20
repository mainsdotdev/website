import { SectionHeader } from "@/components/section-header";
import { MAINS_DOWNLOAD_DMG_URL } from "@/lib/constants";

const STEPS = [
  {
    title: "Get the latest Mains",
    description: "Bridge comes with the newest version of the app. Update Mains, or download it if you’re new.",
    link: { label: "Download Mains", href: MAINS_DOWNLOAD_DMG_URL },
  },
  {
    title: "Open Settings › Bridge",
    description: "Click Sign in, name this computer, and choose whether to bring your existing history along. Your browser opens to finish.",
  },
  {
    title: "Sign in with email or GitHub",
    description: "That’s your request. We’re letting people in in small groups, and Bridge starts syncing once your access is approved.",
  },
];

export function BridgeJoinSection() {
  return (
    <section id="join" aria-label="Join the Bridge beta" className="relative mx-auto max-w-304 scroll-mt-24 px-5 pb-28 sm:px-8 lg:pb-36">
      <SectionHeader
        layout="column"
        title="Join the beta."
        description="Bridge is in beta. There’s no form to fill in: signing in from the Mains app is how you ask for access."
        titleClassName="max-w-4xl leading-tight text-primary-50"
        descriptionClassName="mt-1 max-w-2xl text-lg leading-relaxed sm:text-xl"
      />

      <ol className="mt-10 grid gap-4 sm:mt-14 sm:gap-5 lg:grid-cols-3">
        {STEPS.map(({ title, description, link }, index) => (
          <li key={title} className="glass-card flex flex-col rounded-4xl p-6 sm:p-7 lg:p-8">
            <span aria-hidden className="mb-5 font-mono text-sm text-primary-500">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-xl font-semibold tracking-tight text-primary-50">{title}</h3>
            <p className="mt-3 text-base leading-relaxed text-primary-300 sm:text-lg">{description}</p>
            {link && (
              <a
                href={link.href}
                className="mt-6 w-fit text-sm font-medium text-primary-50 underline decoration-primary-600 underline-offset-4 transition-colors hover:decoration-primary-300"
              >
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
