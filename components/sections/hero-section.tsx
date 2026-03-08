"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/header";
import { ScrambleText } from "@/components/scramble-text";

type HeroSectionProps = {
  platform: "macOS" | "Windows";
};

export function HeroSection({ platform }: HeroSectionProps) {

  return (
    <div className="relative overflow-hidden">
      {/* Gradient Blur Background */}
      <div className="absolute inset-0 z-0 bg-black">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[60%] rounded-full bg-[#D97757] opacity-60 blur-[90px]" style={{ animation: 'blob-float-1 20s ease-in-out infinite' }} />
        <div className="absolute top-[10%] left-[20%] w-[60%] h-[70%] rounded-full bg-[#000000] opacity-70 blur-[90px]" style={{ animation: 'blob-float-2 25s ease-in-out infinite' }} />
        <div className="absolute top-[5%] right-[-5%] w-[40%] h-[50%] rounded-full bg-[#09111c] opacity-50 blur-[90px]" style={{ animation: 'blob-float-3 22s ease-in-out infinite' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[55%] h-[60%] rounded-full bg-[#193a4f] opacity-65 blur-[90px]" style={{ animation: 'blob-float-1 28s ease-in-out infinite reverse' }} />
        <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-[#0d2d4a] opacity-80 blur-[90px]" style={{ animation: 'blob-float-2 24s ease-in-out infinite reverse' }} />
      </div>
      {/* Noise/Grain Overlay */}
      <svg className="absolute inset-0 w-full h-full z-0 opacity-[0.05] pointer-events-none">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="120" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black z-0" />
    <div className="relative z-10">
      <Header />
    <section className="pt-10 pb-20 max-w-7xl mx-auto px-6">
      {/* Title & Subtitle - Left aligned */}
      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 mb-4"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-snug font-sans">
          Jinzo for{" "}
          <ScrambleText
            words={["all.", "agents.", "issues.", "bugs.", "code.", " products."]}
            interval={3000}
            className="text-primary"
          />
        </h1>
        <p className="pb-4 pt-2 text-md text-neutral-400 font-sans">
          Purpose-built for planning and building products. Designed for the AI era.
        </p>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-10 mb-16"
      >
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-black bg-white rounded-full hover:bg-neutral-200 transition-colors">
            Download for {platform}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/></svg>
          </button>
          <Link
            href="https://github.com/OkanBilal/jinzo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-black  rounded-full hover:bg-neutral-900 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            View Source
          </Link>
        </div>
      </motion.div>

      {/* Hero Video */}
      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="relative z-10 max-w-7xl mx-auto rounded-2xl overflow-hidden border border-white/5 "
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto"
        >
          <source src="/hero3.mp4" type="video/mp4" />
        </video>
      </motion.div>

    </section>
    </div>
    </div>
  );
}
