import { motion, AnimatePresence } from "framer-motion";

type Integration = {
  name: string;
  logo: string;
};

type IntegrationGridProps = {
  integrations: Integration[];
};

export function IntegrationGrid({ integrations }: IntegrationGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {integrations.map((integration, index) => (
        <div
          key={index}
          className="aspect-square rounded-xl flex items-center justify-center transition-all duration-300 overflow-hidden relative"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={integration.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-white text-sm font-semibold text-center absolute inset-0 flex items-center justify-center"
            >
              <img
                src={integration.logo}
                alt={integration.name}
                className="max-h-32 max-w-32 object-contain"
              />
            </motion.span>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
