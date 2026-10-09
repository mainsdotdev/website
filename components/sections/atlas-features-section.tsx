import { Chat, DownloadLine, ProjectFolder, Search } from "@/components/icons";
import { SectionHeader } from "@/components/section-header";

const FEATURES = [
  {
    title: "Find it again",
    description: "Search your library and narrow it down to pages, documents, or images. Keep favorites close so the things you use most are easy to return to.",
    Icon: Search,
  },
  {
    title: "Organize by project",
    description: "Keep your research, plans, and creative work with the project they belong to. Switch between projects or see everything together in one library.",
    Icon: ProjectFolder,
  },
  {
    title: "Save from a conversation",
    description: "Save useful files and images from your conversations directly to Atlas. Keep the results you want to revisit, alongside the pages you write.",
    Icon: Chat,
  },
  {
    title: "Keep your work portable",
    description: "Export your pages as Markdown or JSON. Use your notes outside Mains, keep a copy, or carry an idea into another tool.",
    Icon: DownloadLine,
  },
] as const;

export function AtlasFeaturesSection() {
  return (
    <section aria-label="Atlas features" className="relative mx-auto max-w-304 px-5 pb-28 sm:px-8 lg:pb-36">
      <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-violet-400">BUILT IN</p>
      <SectionHeader
        layout="column"
        title="Keep your work within reach."
        description="Search what you’ve saved, organize it by project, and come back to it when you need it. Atlas keeps the useful pieces together."
        titleClassName="max-w-4xl leading-tight text-primary-50"
        descriptionClassName="mt-1 max-w-2xl text-lg leading-relaxed sm:text-xl"
      />

      <ul className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5">
        {FEATURES.map(({ title, description, Icon }) => (
          <li key={title} className="glass-card rounded-xl p-6 sm:p-7 lg:p-8">
            <span aria-hidden className="mb-5 block text-violet-400">
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
