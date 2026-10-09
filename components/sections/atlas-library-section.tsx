import { AtlasLibraryDemo } from "@/components/demo/atlas-library-demo";
import { SectionHeader } from "@/components/section-header";

const FEATURES = [
  { title: "Edit with Markdown", description: "Write and refine your pages with familiar Markdown. Keep notes, checklists, and longer documents easy to read and easy to change." },
  { title: "Use a template", description: "Start with a project brief, research notes, or a launch checklist. Give your ideas a little structure, then make the page your own." },
  { title: "Save forever", description: "Keep the pages, documents, and images you want to come back to. Your work stays in Atlas, ready for the next conversation." },
];

export function AtlasLibrarySection() {
  return (
    <section aria-label="Your Atlas library" className="relative mx-auto max-w-304 px-5 pt-20 pb-28 sm:px-8 lg:pt-32 lg:pb-36">
      <SectionHeader
        layout="column"
        title="Everything you make, in one place."
        description="Collect your pages, documents, and images in Atlas. Create with your agents, organize your ideas, and keep the work worth coming back to."
        titleClassName="max-w-4xl text-primary-50 leading-tight"
        descriptionClassName="mt-1 max-w-2xl text-lg leading-relaxed sm:text-xl"
      />

      <div className="mt-12 overflow-hidden rounded-xl sm:mt-16" style={{ maskImage: "linear-gradient(to bottom, black 0%, black 78%, transparent 100%)" }}>
        <AtlasLibraryDemo />
      </div>

      <div className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-10 lg:mt-12 lg:gap-14">
        {FEATURES.map(({ title, description }) => (
          <div key={title}>
            <h3 className="text-lg font-medium tracking-tight text-primary-50">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-primary-400 sm:text-base">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
