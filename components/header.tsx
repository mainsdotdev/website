"use client"

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {

  return (
    <header className="mb-8 max-w-7xl mx-auto px-4">
      <nav className="flex items-center justify-between py-6 font-mono">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
                 <Image
                src="/header.png"
                alt="Mains Logo"
                width={480}
                height={480}
                className="object-contain h-12 w-auto"
              />
          </div>

        </Link>

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
