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
  metadataBase: new URL("https://usejinzo.com"),
  title: "Jinzo",
  description: "Jinzo is a powerful AI assistant that helps you write better code, faster. It provides intelligent code suggestions, error detection, and code optimization to enhance your coding experience.",
  openGraph: {
    title: "Jinzo",
    siteName: "Jinzo",
    url: "https://usejinzo.com",
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icons/icon-android-chrome-192x192.png",
    apple: "/icons/icon-apple-touch-icon.png",
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
