import Image from "next/image";
import { Apps, ChevronDown, DownloadLine, Layers, Sparkles } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * A design editor, the way a Canva MCP App draws itself inside Mains' app
 * panel — recoloured to the site's palette rather than the vendor's. The
 * design is the 0.15 social card, on the Earth render the hero's image chat
 * made.
 */

const UPLOADS = [
  { src: "/demos/earth-from-moon.webp", width: 800, height: 450, alt: "Earth above the lunar horizon", selected: true },
  { src: "/demos/fuji-stamp.png", width: 1176, height: 1338, alt: "A Fuji National Park stamp" },
  { src: "/demos/earth-mosaic.png", width: 1672, height: 941, alt: "A mosaic of Earth and Saturn" },
  { src: "/demos/rails-architecture-cover.png", width: 1672, height: 941, alt: "An Inside Ruby on Rails cover" },
];

/** The letter mark for the Text tool. */
function TextGlyph({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("flex items-center justify-center font-semibold leading-none", className)}>
      T
    </span>
  );
}

const TOOLS = [
  { label: "Design", icon: <Layers className="size-3.5" /> },
  { label: "Elements", icon: <Sparkles className="size-3.5" /> },
  { label: "Text", icon: <TextGlyph className="size-3.5 text-[12px]" /> },
  { label: "Uploads", icon: <DownloadLine className="size-3.5 rotate-180" />, active: true },
  { label: "Apps", icon: <Apps className="size-3.5" /> },
];

function TopBar() {
  return (
    <div className="flex h-9 shrink-0 items-center gap-3 border-b border-primary-800/50 px-3 text-[10px] text-primary-200">
      <span>File</span>
      <span>Resize</span>
      <span className="h-3 w-px bg-primary-800" />
      <span className="flex items-center gap-1">
        Editing
        <ChevronDown className="size-2.5 text-primary-400" fill="currentColor" />
      </span>
      <span className="mx-auto truncate text-primary-400">Mains 0.15 · Social card</span>
      <span className="flex -space-x-1.5">
        <span className="size-4.5 rounded-full border border-(--demo-content) bg-[#da702c]" />
        <span className="size-4.5 rounded-full border border-(--demo-content) bg-[#4385be]" />
      </span>
      <span className="rounded-full bg-primary-50 px-3 py-1 text-[9.5px] font-medium text-primary-950">Share</span>
    </div>
  );
}

function ToolStrip() {
  return (
    <div className="flex w-14 shrink-0 flex-col items-center gap-2.5 border-r border-primary-800/50 pt-3">
      {TOOLS.map(({ label, icon, active }) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <span
            className={cn(
              "flex size-7 items-center justify-center rounded-lg",
              active ? "bg-primary-900 text-primary-50" : "text-primary-300"
            )}
          >
            {icon}
          </span>
          <span className={cn("text-[8px]", active ? "text-primary-50" : "text-primary-400")}>{label}</span>
        </div>
      ))}
    </div>
  );
}

function UploadsDrawer() {
  return (
    <div className="flex w-40 shrink-0 flex-col gap-2.5 border-r border-primary-800/50 p-2.5">
      <div className="rounded-lg px-2 py-1.5 text-[9px] text-primary-400 glass-outline">Search uploads</div>
      <span className="rounded-lg bg-primary-50 py-1.5 text-center text-[9px] font-medium text-primary-950">
        Upload files
      </span>
      <div className="grid grid-cols-2 gap-1.5">
        {UPLOADS.map(({ src, width, height, alt, selected }) => (
          <Image
            key={src}
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes="80px"
            className={cn(
              "aspect-square w-full rounded-md object-cover",
              selected && "ring-2 ring-primary-50 ring-offset-1 ring-offset-(--demo-content)"
            )}
          />
        ))}
      </div>
    </div>
  );
}

/** The selected text box's handles: corners plus the side midpoints. */
function SelectionHandles() {
  const handle = "absolute size-2 rounded-full border border-[#7c7a73] bg-[#fff]";
  return (
    <>
      <span className={cn(handle, "-top-1 -left-1")} />
      <span className={cn(handle, "-top-1 -right-1")} />
      <span className={cn(handle, "-bottom-1 -left-1")} />
      <span className={cn(handle, "-right-1 -bottom-1")} />
      <span className={cn(handle, "top-1/2 -left-1 -translate-y-1/2")} />
      <span className={cn(handle, "top-1/2 -right-1 -translate-y-1/2")} />
    </>
  );
}

/**
 * The canvas. The design sits top-left rather than centred: expanded in
 * Mains, the app's chat floats over the bottom-right corner, and the card
 * should stay in view beside it.
 */
function Canvas() {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col bg-primary-900/70">
      <div className="flex min-h-0 flex-1 flex-col items-center self-start px-7 pt-4">
        {/* The text toolbar the selection brings up. */}
        <div className="flex items-center gap-2.5 rounded-xl bg-(--demo-content) px-2.5 py-1.5 text-[9.5px] text-primary-200 shadow-[0_8px_20px_-12px_var(--demo-shadow)] glass-outline">
          <span className="flex items-center gap-1">
            Schibsted Grotesk
            <ChevronDown className="size-2.5 text-primary-400" fill="currentColor" />
          </span>
          <span className="h-3 w-px bg-primary-800" />
          <span className="flex items-center gap-1.5 tabular-nums">
            <span className="text-primary-400">−</span>64<span className="text-primary-400">+</span>
          </span>
          <span className="h-3 w-px bg-primary-800" />
          <span className="font-bold">B</span>
          <span className="italic">I</span>
          <span className="size-3 rounded-full border border-primary-700 bg-[#fff]" />
        </div>

        <div className="relative mt-3 aspect-[1200/630] w-90 overflow-hidden rounded-sm shadow-[0_14px_30px_-14px_var(--demo-shadow)]">
          <Image
            src="/demos/earth-from-moon.webp"
            alt="The social card's background: Earth above the lunar horizon"
            width={800}
            height={450}
            sizes="360px"
            className="absolute inset-0 size-full object-cover"
          />
          {/* Literal white: the site's light theme turns its `white` token
              dark, and this is artwork, not page text. */}
          <div className="absolute top-5 left-5 text-[#fff]">
            <div className="text-[7px] tracking-[0.22em] text-[#fff]/70">MAINS 0.15</div>
            <div className="relative mt-1.5 -ml-1.5 px-1.5 py-1 outline outline-1 outline-[#fff]/90">
              <span className="block text-[22px] leading-[1.05] font-semibold tracking-tight">
                Talk it
                <br />
                through.
              </span>
              <SelectionHandles />
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-8 shrink-0 items-center gap-3 px-3 text-[9px] text-primary-400">
        <span>Notes</span>
        <span className="flex items-center gap-2">
          <span className="relative h-0.5 w-20 rounded-full bg-primary-700">
            <span className="absolute top-1/2 left-[42%] size-2 -translate-y-1/2 rounded-full bg-primary-50" />
          </span>
          <span className="tabular-nums text-primary-200">48%</span>
        </span>
        <span>Page 1 / 1</span>
      </div>
    </div>
  );
}

export function DesignEditor() {
  return (
    <div className="flex h-full flex-col text-left">
      <TopBar />
      <div className="flex min-h-0 flex-1">
        <ToolStrip />
        <UploadsDrawer />
        <Canvas />
      </div>
    </div>
  );
}
