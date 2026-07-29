import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Footer from "@/components/footer";

const siteTitle = "Mains — Open-Source Desktop App for AI Coding Agents";
const siteDescription =
  "Run Claude Code, OpenAI Codex, GitHub Copilot, and Cursor in isolated Git workspaces. Review changes, track costs, and ship safely with Mains.";

const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  style: "normal",
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mains.dev"),
  title: {
    default: siteTitle,
    template: "%s | Mains",
  },
  description: siteDescription,
  applicationName: "Mains",
  creator: "Mains",
  publisher: "Mains",
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    siteName: "Mains",
    url: "/",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/hero-new-image.png",
        width: 4600,
        height: 2490,
        alt: "Mains desktop app for running AI coding agents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/hero-new-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`mx-auto scroll-smooth bg-primary-950 antialiased ${inter.className}`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
