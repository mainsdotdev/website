import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeader } from "@/components/section-header";
import { INTEGRATIONS } from "@/lib/constants";
import { FADE_IN_UP } from "@/lib/animations";

export function IntegrationsSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4">
      <motion.div {...FADE_IN_UP}>
        <SectionHeader
          layout="column"
          title="Powerful integrations"
          description="Powered by MCP servers and APIs. Mains connects to your tools natively, so your agents can read, write, and act across services without leaving the app."
          className="mb-10"
          descriptionClassName="text-primary-400"
        />

        <div className="relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 z-10 w-32 bg-linear-to-r from-primary-950 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 z-10 w-32 bg-linear-to-l from-primary-950 to-transparent pointer-events-none" />

          <div className="flex gap-3 animate-scroll-left">
            {[...INTEGRATIONS, ...INTEGRATIONS].map((integration, i) => (
              <div
                key={`${integration.name}-${i}`}
                className="w-24 h-24 shrink-0 rounded-3xl glass-card flex items-center justify-center"
              >
                <Image
                  src={integration.logo}
                  alt={integration.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
