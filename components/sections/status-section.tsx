"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function StatusSection() {
  return (
    <section className="py-20 max-w-6xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex flex-col md:flex-row items-center gap-12"
      >
        {/* Text */}
        <div className="md:w-2/6 flex flex-col gap-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-snug font-sans">
            Agents turn ideas into code
          </h2>
          <p className="text-sm md:text-base text-neutral-400 leading-relaxed">
            Accelerate development by handing off tasks to Laurel, while you
            focus on making decisions.
          </p>
        </div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="md:w-4/6 rounded-xl overflow-hidden border border-white/10 shadow-[0_0_80px_-20px_rgba(255,255,255,0.08)]"
        >
          <Image
            src="/status2.png"
            alt="Agent status view"
            width={1920}
            height={1080}
            className="w-full h-auto"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
