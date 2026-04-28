import { motion } from "framer-motion";
import { WindowChrome } from "@/components/window-chrome";
import { FADE_IN_BLUR_UP_DELAY } from "@/lib/animations";

const MacComponent = () => (
  <motion.div
    {...FADE_IN_BLUR_UP_DELAY(1)}
    className="max-w-6xl mx-auto"
  >
    <WindowChrome title="Mains - Overview">
      <div className="p-8 min-h-100 flex items-center justify-center text-primary-500">
        <p className="text-lg">Demo interface</p>
      </div>
    </WindowChrome>
  </motion.div>
);

export default MacComponent;
