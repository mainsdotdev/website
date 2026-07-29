"use client";

import React from "react";
import Link from "next/link";
import { Github } from "@/components/icons";
import { MAINS_GITHUB_REPO_URL } from "@/lib/constants";

export default function Footer() {
  return (
    <div
      className="relative h-64 md:h-100 px-4"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="relative h-[calc(100vh+140px)] md:h-[calc(100vh+400px)] -top-[100vh]">
        <div className="h-20 md:h-100 sticky top-[calc(100vh-140px)] md:top-[calc(100vh-400px)] max-w-7xl mx-auto ">
          <h3 className="text-center font-serif text-primary-850/40 font-semibold text-[6rem] sm:text-[10rem] md:text-[14rem] ">
            mains.
          </h3>
          <div className="flex  gap-3 flex-row justify-between items-center ">
            <p className="text-left text-xs sm:text-sm text-primary-500 font-sans tracking-tight">
              © 2026 Mains
            </p>
            <div className="flex items-center font-sans gap-4 sm:gap-5 tracking-tight">
              <Link
                href="/blog"
                className="text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition-colors"
              >
                Blog
              </Link>
              <Link
                href="mailto:team@mains.dev"
                className="text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition-colors"
              >
                Contact
              </Link>
              <Link
                href="https://docs.mains.dev"
                className="text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition-colors"
              >
                Docs
              </Link>
              <Link
                href={MAINS_GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Github width={20} height={20} />
              </Link>

            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
