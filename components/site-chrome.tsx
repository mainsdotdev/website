"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import WorkFooter from "@/components/work-footer";
import AtlasFooter from "@/components/atlas-footer";
import BridgeFooter from "@/components/bridge-footer";

/** Orbit previews are full-screen canvases with their own controls. */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/orbit" || pathname === "/orbit2") return <>{children}</>;

  return (
    <>
      <Header />
      {children}
      {pathname === "/bridge" ? (
        <BridgeFooter />
      ) : pathname === "/atlas" ? (
        <AtlasFooter />
      ) : pathname === "/work" ? (
        <WorkFooter />
      ) : (
        <Footer />
      )}
    </>
  );
}
