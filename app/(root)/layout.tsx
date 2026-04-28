import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Footer from "@/components/footer";

const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  style: "normal",
  subsets: ["latin-ext"],
});
export const metadata: Metadata = {
  metadataBase: new URL("https://mains.dev"),
  title: "Mains",
  description: "Mains is a powerful AI assistant that helps you write better code, faster. It provides intelligent code suggestions, error detection, and code optimization to enhance your coding experience.",
  openGraph: {
    title: "Mains",
    siteName: "Mains",
    url: "https://mains.dev",
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: `/manifest.json`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="overflow-x-hidden 
        "
    >
      <head></head>
      <body
        className={`scroll-smooth antialiased mx-auto bg-primary-950 ${inter.className} `}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
