"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowUp, Bolt, ChevronDown, Codex, Gallery, Plus, SidebarClose, Web } from "@/components/icons";
import { cn } from "@/lib/utils";
import { ATLAS_IMAGE_TEMPLATES } from "./atlas-image-templates";
import { NavigationRail } from "./navigation-rail";
import { ScaleToFit } from "./scale-to-fit";

/** Atlas image creation, with a prompt composer and replaceable template artwork. */
export function AtlasImageCreatorDemo() {
  const [prompt, setPrompt] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  return (
    <ScaleToFit designWidth={960} designHeight={832} className="pointer-events-none lg:pointer-events-auto">
      <div role="group" aria-label="Image creation in Atlas" className="flex h-full flex-col overflow-hidden bg-(--demo-chrome) text-left text-primary-200">
        <div className="flex h-8 shrink-0 items-center gap-3 px-3">
          <div aria-hidden className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </div>
          <SidebarClose className="size-3.5 text-primary-400" />
          <Web aria-hidden className="ml-auto size-3.5 text-primary-500" />
        </div>

        <div className="flex min-h-0 flex-1">
          <NavigationRail activeLabel="Atlas" showPinnedApps={false} />
          <div className="mr-1 mb-1 min-w-0 flex-1 overflow-y-auto rounded-xl bg-(--demo-content) px-8 pt-10 pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="mx-auto max-w-155">
              <h3 className="mb-6 text-center text-2xl tracking-tight text-primary-100">What do you want to create?</h3>

              <div className="glass-card rounded-2xl p-3.5 focus-within:ring-1 focus-within:ring-blue-500/40">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-blue-500">
                    <Gallery className="size-3.5" /> Image Gen
                  </span>
                  <span aria-hidden className="text-[9px] text-primary-600">⌘ ⇧ P to focus</span>
                </div>
                <textarea
                  ref={promptRef}
                  aria-label="Image prompt"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="Describe what you’d like to create…"
                  className="mt-2 h-9 w-full resize-none bg-transparent text-[11px] leading-4 text-primary-200 outline-none placeholder:text-primary-600"
                />
                <div className="mt-2 flex items-center gap-3 text-primary-300">
                  <button type="button" aria-label="Attach a reference photo" onClick={() => uploadRef.current?.click()} className="flex size-5 cursor-pointer items-center justify-center rounded text-primary-400 hover:text-primary-100 focus-visible:outline-2 focus-visible:outline-blue-400">
                    <Plus className="size-3.5" />
                  </button>
                  <span className="flex items-center gap-1.5 text-[10px]">
                    <Codex className="size-3.5" />
                    GPT 6.1 Sol <span className="text-primary-400">Extra High</span>
                    <ChevronDown className="size-2.5 text-primary-500" />
                  </span>
                  <Bolt className="size-3.5 text-primary-400" />
                  <a href="#try-atlas-title" aria-label="Create images with Mains" className="ml-auto flex size-6 items-center justify-center rounded-full bg-primary-100 text-primary-950 transition-colors hover:bg-primary-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">
                    <ArrowUp className="size-3.5" />
                  </a>
                </div>
              </div>

              <section aria-label="Image templates" className="mt-6">
                <h4 className="mb-3 inline-flex rounded-full bg-primary-900 px-3 py-1.5 text-[11px] text-primary-100">Templates</h4>
                <div className="grid grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    aria-label="Upload a photo"
                    onClick={() => uploadRef.current?.click()}
                    className="glass-card group relative flex aspect-4/5 cursor-pointer flex-col items-start justify-end overflow-hidden rounded-2xl p-3 text-left text-xs text-primary-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                  >
                    {photo ? <Image src={photo} alt="Your reference photo" fill unoptimized className="object-cover" /> : <Plus aria-hidden className="absolute top-1/2 left-1/2 size-6 -translate-x-1/2 -translate-y-1/2 text-primary-500 transition-colors group-hover:text-primary-200" />}
                    {photo && <span aria-hidden className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />}
                    <span className={cn("relative", photo && "text-[#fff]")}>{photo ? "Reference photo" : "Upload a photo"}</span>
                  </button>

                  {ATLAS_IMAGE_TEMPLATES.map((template) => (
                    <button
                      key={template.title}
                      type="button"
                      aria-label={`${template.title} template`}
                      aria-pressed={selected === template.title}
                      onClick={() => {
                        setSelected(template.title);
                        setPrompt(template.prompt);
                        promptRef.current?.focus();
                      }}
                      className={cn("group relative flex aspect-4/5 cursor-pointer items-end overflow-hidden rounded-2xl p-3 text-left text-xs text-[#fff] transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400", selected === template.title && "ring-2 ring-blue-500 ring-offset-2 ring-offset-(--demo-content)")}
                      style={{ backgroundColor: template.background }}
                    >
                      <Image src={template.src} alt="" fill sizes="150px" className={cn("transition-transform duration-300 group-hover:scale-[1.04]", template.imageClassName)} />
                      <span aria-hidden className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
                      <span className="relative">{template.title}</span>
                    </button>
                  ))}
                </div>
              </section>

              <input
                ref={uploadRef}
                type="file"
                accept="image/*"
                aria-label="Choose a reference photo"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file?.type.startsWith("image/")) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (typeof reader.result === "string") setPhoto(reader.result);
                  };
                  reader.readAsDataURL(file);
                  event.target.value = "";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </ScaleToFit>
  );
}
