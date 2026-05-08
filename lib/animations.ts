import type { Variants } from "framer-motion";

export const FADE_IN_UP = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px 0px" },
  transition: { duration: 0.42, ease: [0.25, 0.1, 0.25, 1] },
} as const;

export const FADE_IN_UP_DELAY = (delay: number) =>
  ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px 0px" },
    transition: { duration: 0.42, ease: [0.25, 0.1, 0.25, 1], delay },
  }) as const;

export const FADE_IN_BLUR = {
  initial: { opacity: 0, filter: "blur(10px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
} as const;

export const FADE_IN_BLUR_DELAY = (delay: number) =>
  ({
    initial: { opacity: 0, filter: "blur(10px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1], delay },
  }) as const;

export const FADE_IN_BLUR_UP = {
  initial: { opacity: 0, filter: "blur(10px)", y: 16 },
  animate: { opacity: 1, filter: "blur(0px)", y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
} as const;

export const FADE_IN_BLUR_UP_DELAY = (delay: number) =>
  ({
    initial: { opacity: 0, filter: "blur(10px)", y: 16 },
    animate: { opacity: 1, filter: "blur(0px)", y: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay },
  }) as const;

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.25, 0.1, 0.25, 1] },
  },
};
