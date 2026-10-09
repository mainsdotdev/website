"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Close, Plus, Search } from "@/components/icons";
import { OrbFlightSlot } from "@/components/orb-flight";
import { cn } from "@/lib/utils";
import { NavigationRail } from "./navigation-rail";
import { INITIAL_PULSES, PULSE_TEMPLATES, type DemoPulse } from "./pulse-data";
import { ScaleToFit } from "./scale-to-fit";

type PulseDraft = Pick<
  DemoPulse,
  "title" | "project" | "schedule" | "prompt"
> & { id?: string };

function matchesSearch(query: string, ...fields: string[]) {
  const text = fields.join(" ").toLowerCase();
  return query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .every((term) => text.includes(term));
}

/** The Work Pulse route, with its real suggestions and local demo controls. */
export function PulseDemo({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [pulses, setPulses] = useState(INITIAL_PULSES);
  const [draft, setDraft] = useState<PulseDraft | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const nextId = useRef(0);
  const editorOpen = draft !== null;

  useEffect(() => {
    if (!editorOpen) triggerRef.current?.focus();
  }, [editorOpen]);

  const visiblePulses = pulses.filter((pulse) =>
    matchesSearch(query, pulse.title, pulse.prompt),
  );
  const visibleTemplates = PULSE_TEMPLATES.filter((template) =>
    matchesSearch(query, template.title, template.description),
  );
  const running = visiblePulses.filter((pulse) => pulse.enabled).length;
  const noMatches = visiblePulses.length === 0 && visibleTemplates.length === 0;

  const openDraft = (value: PulseDraft, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setDraft(value);
  };

  const closeDraft = () => {
    setDraft(null);
  };

  const saveDraft = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft || !draft.title.trim() || !draft.prompt.trim()) return;
    const saved = {
      ...draft,
      title: draft.title.trim(),
      prompt: draft.prompt.trim(),
    };
    if (draft.id) {
      setPulses((current) =>
        current.map((pulse) =>
          pulse.id === draft.id ? { ...pulse, ...saved } : pulse,
        ),
      );
    } else {
      nextId.current += 1;
      setPulses((current) => [
        ...current,
        {
          ...saved,
          id: `demo-${nextId.current}`,
          next: "Scheduled",
          enabled: true,
        },
      ]);
    }
    setQuery("");
    closeDraft();
  };

  const handleDialogKey = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      closeDraft();
    }
    if (event.key !== "Tab") return;
    const controls = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        "button, input, select, textarea",
      ),
    );
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  return (
    <ScaleToFit
      designWidth={1152}
      designHeight={648}
      className={cn("pointer-events-none lg:pointer-events-auto", className)}
    >
      <div
        role="group"
        aria-label="Pulse scheduled automations in Mains Work"
        className="relative flex h-full flex-col overflow-hidden bg-(--demo-chrome) text-left text-primary-200 select-none"
      >
        <div
          aria-hidden
          className="flex h-7 shrink-0 items-center gap-1.5 px-3"
        >
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>

        <div className="flex min-h-0 flex-1">
          <NavigationRail mode="work" activeLabel="Pulse" showSpaces />
          <main
            inert={draft !== null}
            className="mr-1 mb-1 min-w-0 flex-1 overflow-y-auto rounded-xl bg-(--demo-content) px-8 pt-10 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="mx-auto max-w-152">
              <header className="flex items-start justify-between gap-5">
                <div>
                  <h3 className="text-[14px] leading-5 text-primary-100">
                    Pulse
                  </h3>
                  <p className="mt-0.5 text-[10px] leading-4 text-primary-400">
                    Pulse keeps your work in motion with scheduled, automated
                    runs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(event) =>
                    openDraft(
                      {
                        title: "",
                        project: "Work Stuff",
                        schedule: PULSE_TEMPLATES[0].schedule,
                        prompt: "",
                      },
                      event.currentTarget,
                    )
                  }
                  className="glass-submit flex h-6 shrink-0 cursor-pointer items-center gap-1 rounded-lg px-2.5 text-[9px] font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                >
                  <Plus className="size-3" />
                  New Pulse
                </button>
              </header>

              <div className="glass-outline relative mt-4 rounded-full">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3 -translate-y-1/2 text-primary-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape" && query) {
                      event.stopPropagation();
                      setQuery("");
                    }
                  }}
                  aria-label="Search pulses and suggestions"
                  placeholder="Search pulses and suggestions"
                  className="h-6 w-full rounded-full bg-transparent pr-8 pl-7 text-[10px] text-primary-200 outline-none placeholder:text-primary-500 focus-visible:ring-1 focus-visible:ring-blue-500/60"
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setQuery("")}
                    className="absolute top-1/2 right-2 flex size-4 -translate-y-1/2 cursor-pointer items-center justify-center rounded text-primary-400 hover:text-primary-100"
                  >
                    <Close className="size-2.5" />
                  </button>
                )}
              </div>

              {noMatches ? (
                <p className="mt-6 px-1 text-[10px] text-primary-400">
                  Nothing matches “{query.trim()}”.
                </p>
              ) : (
                <>
                  {visiblePulses.length > 0 && (
                    <section aria-label="Your pulses" className="mt-6">
                      <div className="mb-2 flex items-center justify-between px-1 text-[10px] leading-3">
                        <h4 className="text-primary-200">Your pulses</h4>
                        <span className="text-[9px] text-primary-500">
                          {running} of {visiblePulses.length} running
                        </span>
                      </div>
                      <div className="glass-card rounded-2xl px-2.5 py-0.5">
                        {visiblePulses.map((pulse) => (
                          <div
                            key={pulse.id}
                            className="flex min-h-10 items-center gap-2.5 border-b border-primary-700/15 last:border-b-0"
                          >
                            <span
                              aria-hidden
                              className={cn(
                                "size-1.5 shrink-0 rounded-full",
                                pulse.enabled
                                  ? "bg-green-500 shadow-[0_0_0_3px_rgb(34_197_94/8%)]"
                                  : "bg-primary-600",
                              )}
                            />
                            <button
                              type="button"
                              aria-label={`Edit ${pulse.title}`}
                              onClick={(event) =>
                                openDraft(pulse, event.currentTarget)
                              }
                              className="min-w-0 flex-1 cursor-pointer rounded py-1.5 text-left focus-visible:outline-1 focus-visible:outline-blue-400"
                            >
                              <span className="block text-[10px] leading-3.5 text-primary-200">
                                {pulse.title}
                              </span>
                              <span className="block text-[9px] leading-3 text-primary-500">
                                {pulse.project} · {pulse.schedule} ·{" "}
                                {pulse.enabled ? pulse.next : "Paused"}
                              </span>
                            </button>
                            <button
                              type="button"
                              role="switch"
                              aria-label={pulse.title}
                              aria-checked={pulse.enabled}
                              onClick={() =>
                                setPulses((current) =>
                                  current.map((item) =>
                                    item.id === pulse.id
                                      ? { ...item, enabled: !item.enabled }
                                      : item,
                                  ),
                                )
                              }
                              className={cn(
                                "relative h-3.5 w-8 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400",
                                pulse.enabled
                                  ? "bg-blue-600"
                                  : "bg-primary-700",
                              )}
                            >
                              <span
                                className={cn(
                                  "absolute top-0.5 left-0.5 size-2.5 rounded-full bg-white transition-transform",
                                  pulse.enabled && "translate-x-4.5",
                                )}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {visibleTemplates.length > 0 && (
                    <section aria-label="Pulse suggestions" className="mt-8">
                      <h4 className="px-1 text-[10px] leading-3.5 text-primary-200">
                        Suggestions
                      </h4>
                      <p className="mt-2 mb-1 px-2 text-[9px] leading-3 text-primary-500">
                        Docs &amp; digests
                      </p>
                      {visibleTemplates.map((template) => (
                        <button
                          key={template.id}
                          type="button"
                          onClick={(event) =>
                            openDraft(
                              {
                                title: template.title,
                                project: "Work Stuff",
                                schedule: template.schedule,
                                prompt: template.prompt,
                              },
                              event.currentTarget,
                            )
                          }
                          className="group flex min-h-9.5 w-full cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1.5 text-left hover:bg-primary-50/5 focus-visible:outline-1 focus-visible:outline-blue-400"
                        >
                          <span
                            className={cn(
                              "relative flex size-3.5 shrink-0 items-center justify-center",
                              template.tint,
                            )}
                          >
                            <template.icon className="size-3 transition-opacity group-hover:opacity-0" />
                            <Plus className="absolute size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                          </span>
                          <span className="min-w-0">
                            <span className="flex items-baseline gap-1.5">
                              <span className="text-[10px] leading-3.5 text-primary-200">
                                {template.title}
                              </span>
                              <span className="text-[9px] text-primary-500">
                                {template.schedule}
                              </span>
                            </span>
                            <span className="block text-[9px] leading-3 text-primary-500">
                              {template.description}
                            </span>
                          </span>
                        </button>
                      ))}
                    </section>
                  )}
                </>
              )}
            </div>
          </main>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute top-[26.3%] left-[18.8%] -translate-x-1/2 -translate-y-1/2"
        >
          <OrbFlightSlot stop="case-browser" className="size-9" />
        </div>

        {draft && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <form
              role="dialog"
              aria-modal="true"
              aria-label={draft.id ? "Edit Pulse" : "New Pulse"}
              onSubmit={saveDraft}
              onKeyDown={handleDialogKey}
              className="glass-card w-90 rounded-2xl p-4 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-xs text-primary-100">
                  {draft.id ? "Edit Pulse" : "New Pulse"}
                </h4>
                <button
                  type="button"
                  aria-label="Close Pulse editor"
                  onClick={closeDraft}
                  className="flex size-5 cursor-pointer items-center justify-center rounded text-primary-400 hover:bg-primary-50/5 hover:text-primary-100"
                >
                  <Close className="size-3" />
                </button>
              </div>
              <input
                autoFocus
                required
                aria-label="Automation title"
                placeholder="Automation title"
                value={draft.title}
                onChange={(event) =>
                  setDraft({ ...draft, title: event.target.value })
                }
                className="mb-3 w-full bg-transparent text-sm text-primary-100 outline-none placeholder:text-primary-500"
              />
              <div className="mb-3 flex gap-2 text-[10px] text-primary-300">
                <select
                  aria-label="Project"
                  value={draft.project}
                  onChange={(event) =>
                    setDraft({ ...draft, project: event.target.value })
                  }
                  className="min-w-0 rounded-lg border border-primary-700/40 bg-(--demo-content) px-2 py-1.5 outline-none focus:border-blue-500"
                >
                  <option>Work Stuff</option>
                  <option>Rabbit Hole</option>
                  <option>Living Room</option>
                </select>
                <input
                  required
                  aria-label="Schedule"
                  value={draft.schedule}
                  onChange={(event) =>
                    setDraft({ ...draft, schedule: event.target.value })
                  }
                  className="min-w-0 flex-1 rounded-lg border border-primary-700/40 bg-(--demo-content) px-2 py-1.5 outline-none focus:border-blue-500"
                />
              </div>
              <textarea
                required
                aria-label="Automation prompt"
                placeholder="Add a prompt for your agent…"
                value={draft.prompt}
                onChange={(event) =>
                  setDraft({ ...draft, prompt: event.target.value })
                }
                className="h-32 w-full resize-none bg-transparent text-[11px] leading-5 text-primary-300 outline-none placeholder:text-primary-500"
              />
              <div className="mt-4 flex justify-end gap-2 text-[10px]">
                <button
                  type="button"
                  onClick={closeDraft}
                  className="glass-button cursor-pointer rounded-lg px-3 py-1.5 text-primary-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="glass-submit cursor-pointer rounded-lg px-3 py-1.5 text-white"
                >
                  {draft.id ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </ScaleToFit>
  );
}
