"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <div
      className="relative h-64 md:h-100 px-4"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="relative h-[calc(100vh+140px)] md:h-[calc(100vh+400px)] -top-[100vh]">
        <div className="h-20 md:h-100 sticky top-[calc(100vh-140px)] md:top-[calc(100vh-400px)] max-w-7xl mx-auto ">
          <h3 className="text-center text-primary-850/40 font-bold text-[6rem] sm:text-[10rem] md:text-[14rem] ">
            人造
          </h3>
          <div className="flex  gap-3 flex-row justify-between items-center ">
            <p className="text-left text-xs sm:text-sm text-primary-500 font-sans tracking-tight">
              © 2026 True Laurel Labs
            </p>
            <div className="flex items-center font-sans gap-4 sm:gap-5 tracking-tight">
              <Link
                href="mailto:team@usejinzo.com"
                className="text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition-colors"
              >
                Contact
              </Link>
              <Link
                href="https://docs.usejinzo.com"
                className="text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition-colors"
              >
                Docs
              </Link>
              <Link
                href="https://github.com/laurelresearch/jinzo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </Link>

            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
