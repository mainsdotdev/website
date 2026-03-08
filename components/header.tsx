"use client"

import React from "react";
import Leaf from "./leaf";
import Image from "next/image";
import { useBrowserDetection } from "@/hooks/useBrowserDetection";

export default function Header() {
  const { isChrome } = useBrowserDetection();

  return (
    <header className="mb-8 max-w-7xl mx-auto px-4">
      <nav className="flex items-center justify-between py-6 font-mono">
        {/* Logo and Brand */}
        <a href="/" className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            {isChrome ? (
              <>
                <Image
                  src="/logo4.png"
                  alt="Jinzo Logo"
                  width={480}
                  height={480}
                  className="object-contain h-12 w-12 opacity-0"
                />
                <span className="absolute inset-0 flex items-center justify-center 
                font-palette-altfour
                font-bold text-[40px] font-handwriting">
                  J
                </span>
              </>
            ) : (
              <Image
                src="/logo.png"
                alt="Jinzo Logo"
                width={120}
                height={120}
                className="object-contain h-12 w-auto"
              />
            )}
          </div>

        </a>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {/* <a
            href="/blog"
            className="text-sm font-medium text-primary-50 hover:text-primary-700 transition-colors"
          >
            Blog
          </a>
          <a
            href="/docs"
            className="text-sm font-medium text-primary-50 hover:text-primary-700 transition-colors"
          >
            Docs
          </a> */}
        </div>
      </nav>
    </header>
  );
}
