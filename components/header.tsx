"use client"

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="mb-8 max-w-7xl mx-auto px-4">
      <nav
        aria-label="Primary navigation"
        className="flex items-center justify-between py-6 "
      >
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Mains — AI coding agent desktop app"
                width={480}
                height={480}
                className="object-contain h-12 w-auto"
              />
          </div>

        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/blog"
            className="text-xs font-medium text-primary-300 transition-colors hover:text-white sm:text-sm"
          >
            Blog
          </Link>
          <Link
            href="https://docs.mains.dev"
            className="text-xs font-medium text-primary-300 transition-colors hover:text-white sm:text-sm"
          >
            Docs
          </Link>
          <Link
            href="https://github.com/mainsdotdev/mains"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-xs font-medium text-primary-300 transition-colors hover:text-white sm:inline sm:text-sm"
          >
            GitHub
          </Link>
        </div>
      </nav>
    </header>
  );
}
