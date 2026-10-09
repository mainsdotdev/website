import { AtlasImageCreatorDemo } from "@/components/demo/atlas-image-creator-demo";
import { ArrowRightLine } from "@/components/icons";
import { SectionHeader } from "@/components/section-header";

export function AtlasImageCreationSection() {
  return (
    <section aria-label="Create images in Atlas" className="relative mx-auto max-w-304 px-5 pb-28 sm:px-8 lg:pb-36">
      <div className="glass-card grid gap-8 rounded-xl p-5 sm:p-6 lg:grid-cols-[1fr_2fr] lg:items-center lg:gap-8">
        <div className="py-4 lg:py-8">
          <p className="mb-4 text-xs font-semibold tracking-[0.14em] text-violet-400">IMAGE CREATION</p>
          <SectionHeader
            layout="column"
            title="Start with an idea. Make it visual."
            description="Create posters, illustrations, logos, and more with your agents. Pick a template or bring a reference photo, then describe what you have in mind."
            titleClassName="text-2xl leading-tight text-primary-50 md:text-3xl lg:text-3xl"
            descriptionClassName="text-sm leading-relaxed sm:text-base"
          />
          <a href="#try-atlas-title" className="mt-6 inline-flex items-center gap-2 rounded-lg text-sm text-primary-200 transition-colors hover:text-primary-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-400">
            Try Atlas on Mains <ArrowRightLine className="size-4" />
          </a>
        </div>
        <div className="min-w-0 overflow-hidden rounded-lg shadow-xl shadow-(color:--demo-shadow)">
          <AtlasImageCreatorDemo />
        </div>
      </div>
    </section>
  );
}
