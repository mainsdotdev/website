import { motion } from "framer-motion";
import { INTEGRATIONS } from "@/lib/constants";
import { FADE_IN_UP } from "@/lib/animations";
import Image from "next/image";

export function IntegrationsSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4">
      <motion.div {...FADE_IN_UP}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-snug font-sans">
          Powerful integrations
        </h2>

        <p className="text-primary-400 text-sm leading-relaxed max-w-lg mb-10">
          Powered by MCP servers and APIs. Mains connects to your tools
          natively, so your agents can read, write, and act across services
          without leaving the app.
        </p>

        <div className="relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 w-32 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, #0c0c0c 0%, transparent 100%)" }}
          />
          <div
            className="absolute inset-y-0 right-0 w-32 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, #0c0c0c 0%, transparent 100%)" }}
          />
          <motion.div
            className="flex gap-3"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
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
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
