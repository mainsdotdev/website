import Image from "next/image";
import { ChevronLeft, Close, Crop, Ellipsis, Plus, Refresh } from "@/components/icons";
import { WindowTab } from "@/components/demo/window-tab";
import { cn } from "@/lib/utils";

/**
 * The app's built-in browser, expanded to fill the window, for site mockups.
 * Two pieces because the app splits them: once the browser is expanded its
 * tab strip moves up into the window's title bar (`BrowserTabStrip`), while
 * the toolbar and page stay in the content area (`BrowserPanel`).
 */

/** The browser's tab strip in the title bar: one tab, with its favicon. */
export function BrowserTabStrip({ title, favicon }: { title: string; favicon: string }) {
  return (
    <div className="flex min-w-0 items-end gap-2">
      <WindowTab
        title={title}
        icon={<Image src={favicon} alt="" width={14} height={14} className="size-3 shrink-0 rounded-[3px]" />}
      />
      <Plus className="mb-2 size-3.5 shrink-0 text-primary-500" />
    </div>
  );
}

/**
 * The page, as a screenshot in each theme: the mockup follows the site's
 * theme toggle, so the page inside it does too.
 */
export type BrowserPage = { light: string; dark: string; alt: string; width: number; height: number };

/**
 * Toolbar and page, after the app's `BrowserPanel`: back, forward and reload,
 * the address field, then annotate and the browser menu. `children` floats
 * over the page — the app puts its floating chat there.
 */
export function BrowserPanel({
  url,
  page,
  children,
  className,
}: {
  url: string;
  page: BrowserPage;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-(--demo-content)", className)}>
      <div className="flex shrink-0 items-center gap-1 border-b border-primary-800/50 px-2 py-1">
        <div className="flex items-center gap-1.5 px-1 text-primary-400">
          <ChevronLeft className="size-3.5" />
          <ChevronLeft className="size-3.5 rotate-180" />
          <Refresh className="size-3 rotate-180" />
        </div>

        <div className="mx-auto my-0.5 flex h-6 min-w-0 max-w-120 flex-1 items-center rounded-lg px-2.5 glass-outline">
          <span className="min-w-0 flex-1 truncate text-[10px] text-primary-100">{url}</span>
          <Close className="size-2.5 shrink-0 text-primary-400" />
        </div>

        <div className="flex items-center gap-2.5 px-1 text-primary-400">
          <Crop className="size-3" />
          <Ellipsis className="size-3 rotate-90" />
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <Image
          src={page.light}
          alt={page.alt}
          width={page.width}
          height={page.height}
          sizes="(min-width: 1024px) 860px, 100vw"
          className="browser-page-light absolute inset-0 size-full object-cover object-top"
        />
        <Image
          src={page.dark}
          alt=""
          aria-hidden
          width={page.width}
          height={page.height}
          sizes="(min-width: 1024px) 860px, 100vw"
          className="browser-page-dark absolute inset-0 size-full object-cover object-top"
        />
        {children}
      </div>
    </div>
  );
}
