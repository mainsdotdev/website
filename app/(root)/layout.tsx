import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import "@/styles/globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Analytics from "@/components/analytics";
import { SITE_SOCIAL_IMAGE } from "@/lib/social-image";

const siteTitle = "Mains — Open-Source Desktop App for AI Coding Agents";
const siteDescription =
  "Run Claude Code, OpenAI Codex, GitHub Copilot, and Cursor in isolated Git workspaces. Review changes, track costs, and ship safely with Mains.";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
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
    images: [SITE_SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [SITE_SOCIAL_IMAGE],
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
      { url: "/favicon.ico?v=00e158b68b0c", sizes: "16x16 32x32 48x48 64x64", type: "image/x-icon" },
      { url: "/icons/favicon-96x96.png?v=00e158b68b0c", sizes: "96x96", type: "image/png" },
      { url: "/icons/android-chrome-192x192.png?v=00e158b68b0c", sizes: "192x192", type: "image/png" },
      { url: "/icons/android-chrome-512x512.png?v=00e158b68b0c", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png?v=00e158b68b0c",
  },
  manifest: "/manifest.json?v=00e158b68b0c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" className="overflow-x-hidden">
      <head>
        <meta name="theme-color" content="#0c0c0c" />
      </head>
      <body
        className={`mx-auto scroll-smooth bg-primary-950 antialiased ${schibstedGrotesk.variable} ${schibstedGrotesk.className}`}
      >
        <Header />
        {children}
        <Footer />
        {process.env.NODE_ENV === "production" && (
          <Analytics token={process.env.NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN} />
        )}
      </body>
    </html>
  );
}
