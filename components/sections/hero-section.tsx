"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/header";
import { ScrambleText } from "@/components/scramble-text";
import { Download, Github, GrainOverlay, Windows } from "@/components/icons";
import { FADE_IN_BLUR_DELAY, FADE_IN_BLUR_UP_DELAY } from "@/lib/animations";
import { usePlatformDetection } from "@/hooks/usePlatformDetection";

export function HeroSection() {
  const { isMac } = usePlatformDetection();

  return (
    <div className="relative overflow-hidden">
      {/* Gradient Blur Background */}
      <div className="absolute inset-0 z-0 bg-primary-950">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[60%] rounded-full bg-[#D97757] opacity-60 blur-[90px]" style={{ animation: 'blob-float-1 20s ease-in-out infinite' }} />
        <div className="absolute top-[10%] left-[20%] w-[60%] h-[70%] rounded-full bg-[#000000] opacity-70 blur-[90px]" style={{ animation: 'blob-float-2 25s ease-in-out infinite' }} />
        <div className="absolute top-[5%] right-[-5%] w-[40%] h-[50%] rounded-full bg-[#09111c] opacity-50 blur-[90px]" style={{ animation: 'blob-float-3 22s ease-in-out infinite' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[55%] h-[60%] rounded-full bg-[#193a4f] opacity-65 blur-[90px]" style={{ animation: 'blob-float-1 28s ease-in-out infinite reverse' }} />
        <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-[#0d2d4a] opacity-80 blur-[90px]" style={{ animation: 'blob-float-2 24s ease-in-out infinite reverse' }} />
      </div>
      {/* Noise/Grain Overlay */}
      <GrainOverlay className="absolute inset-0 w-full h-full z-0 opacity-[0.05] pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-primary-950 z-0" />
    <div className="relative z-10">
      <Header />
    <section className="pt-10 pb-20 max-w-7xl mx-auto px-6">
      {/* Title & Subtitle - Left aligned */}
      <motion.div
        {...FADE_IN_BLUR_DELAY(0.2)}
        className="relative z-10 mb-4"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-snug font-sans">
          Jinzo for{" "}
          <ScrambleText
            words={["all.", "agents.", "issues.", "bugs.", "PRs."]}
            interval={3000}
            className="text-primary"
          />
        </h1>
        <p className="pb-2 pt-2 text-md text-primary-300 font-sans">
          Run AI coding agents in secure workspaces. Inspect changes, collaborate with agents, and ship with confidence.
        </p>
        {/* <p className="pb-4 text-xs text-primary-100 font-sans">
          Works with Claude Code and GitHub Copilot. Codex, Gemini CLI and more coming soon.
        </p> */}
      </motion.div>

      {/* CTA Button */}
      <motion.div
        {...FADE_IN_BLUR_DELAY(0.6)}
        className="relative z-10 mb-16"
      >
        <div className="flex items-center gap-3">
          {isMac ? (
            <a
              href="https://github.com/OkanBilal/jinzo/releases/download/v0.1.6/Jinzo-0.1.6-arm64.dmg"
              className="inline-flex items-center gap-2 md:px-6 px-3 md:py-3 py-3 text-xs md:text-sm font-medium text-black bg-white rounded-full hover:bg-neutral-200 transition-colors"
            >
              Download for macOS
              <Download width={16} height={16} />
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 md:px-6 px-3 md:py-3 py-3 text-xs md:text-sm font-medium text-primary-500 bg-primary-900/50 rounded-full cursor-default">
              <Windows width={16} height={16} />
              Windows — Coming Soon
            </span>
          )}
          <Link
            href="https://github.com/OkanBilal/jinzo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 md:px-6 px-3 md:py-3 py-3 text-xs md:text-sm font-medium text-white bg-black  rounded-full hover:bg-primary-950 transition-colors"
          >
            <Github width={16} height={16} />
            View Source
          </Link>
        </div>
      </motion.div>

      {/* Hero Video */}
      <motion.div
        {...FADE_IN_BLUR_UP_DELAY(0.8)}
        className="relative z-10 max-w-7xl mx-auto sm:rounded-xl rounded-lg overflow-hidden border border-white/5 "
      >
        <video
          autoPlay
          poster="/poster.png"
          loop
          muted
          playsInline
          className="w-full h-auto "
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </motion.div>

    </section>
    </div>
    </div>
  );
}
