import { Chart, Document, Feed, Notes, Search, Sparkles, Task } from "@/components/icons";
import type { IconComponent } from "./navigation-rail";

type PulseTemplate = {
  id: string;
  title: string;
  description: string;
  schedule: string;
  prompt: string;
  icon: IconComponent;
  tint: string;
};

// The Work mode's Docs & digests suggestions, from the desktop Pulse route.
export const PULSE_TEMPLATES: readonly PulseTemplate[] = [
  {
    id: "daily-doc-digest",
    title: "Daily document digest",
    description: "Morning summary of your project sources — what each covers, what changed, what needs attention.",
    schedule: "Weekdays at 8:30 AM",
    prompt: "Review the project source documents available to you. Produce a short morning digest: what each document covers, anything that looks new or changed, and up to three items that deserve attention today. Write it as a polished summary document the user can skim in one minute.",
    icon: Feed,
    tint: "text-sky-500",
  },
  {
    id: "weekly-report-draft",
    title: "Weekly report draft",
    description: "Drafts the weekly status report from your project sources and recent work.",
    schedule: "Weekly on Friday at 4:00 PM",
    prompt: "Draft a weekly status report from the project source documents available to you. Structure it as: accomplishments, in-progress items, blockers, and next week's focus. Where the sources are thin, mark the section as needing the user's input rather than inventing content. Save the draft as a document the user can edit and share.",
    icon: Notes,
    tint: "text-primary-400",
  },
  {
    id: "meeting-notes-cleanup",
    title: "Meeting notes cleanup",
    description: "Turns rough meeting notes in your sources into structured minutes with action items.",
    schedule: "Weekly on Friday at 5:00 PM",
    prompt: "Find meeting notes among the project source documents. Rewrite each set as structured minutes: attendees (if stated), decisions, action items with owners, and open questions. Keep the original files untouched; produce cleaned versions as new documents and list what you produced.",
    icon: Sparkles,
    tint: "text-amber-400",
  },
  {
    id: "deliverable-status",
    title: "Deliverable status check",
    description: "Reviews in-progress documents and reports what is finished, stale, or blocked.",
    schedule: "Weekly on Monday at 9:30 AM",
    prompt: "Review the documents you have produced in this project so far, together with the project sources. Report per deliverable: finished, in progress, or stale (untouched lately), and whether anything blocks completion. End with a short prioritized list of what to finish next.",
    icon: Chart,
    tint: "text-green-500",
  },
  {
    id: "action-item-sweep",
    title: "Action item sweep",
    description: "Pulls every open action item out of your material into one owner-and-date list.",
    schedule: "Weekdays at 9:00 AM",
    prompt: "Go through the project source documents and the documents you have produced here, and pull out every action item, promise, or follow-up you can find. Consolidate them into a single list with owner, what was asked for, and any date mentioned; mark the ones where the owner or date is unstated. Save it as one document, replacing your previous sweep if there is one, and name the most urgent few in your reply.",
    icon: Task,
    tint: "text-violet-400",
  },
  {
    id: "source-consistency-check",
    title: "Source consistency check",
    description: "Cross-reads your sources for figures, dates, and claims that contradict each other.",
    schedule: "Weekly on Wednesday at 11:00 AM",
    prompt: "Cross-read the project source documents against each other. Report figures, dates, names, or claims that disagree between documents, plus anything that reads as out of date. For each conflict, quote both sides and say which document appears more recent when that is knowable. Save the findings as a short discrepancy report — flag the conflicts, don't resolve them yourself.",
    icon: Search,
    tint: "text-orange-500",
  },
  {
    id: "executive-one-pager",
    title: "Executive one-pager",
    description: "Condenses the current material into a single page a busy reader can absorb.",
    schedule: "Weekly on Thursday at 3:00 PM",
    prompt: "Condense the project source documents into a one-page brief for someone with no prior context: what this is, where it stands, what has been decided, and what is still open. No jargon, no filler, one page. Save it as a document and say in your reply what you had to leave out to make it fit.",
    icon: Document,
    tint: "text-sky-500",
  },
];

export type DemoPulse = {
  id: string;
  title: string;
  project: string;
  schedule: string;
  prompt: string;
  next: string;
  enabled: boolean;
};

export const INITIAL_PULSES: DemoPulse[] = [
  {
    id: "digest",
    title: "Daily document digest",
    project: "Work Stuff",
    schedule: "Weekdays at 8:30 AM",
    prompt: PULSE_TEMPLATES[0].prompt,
    next: "Next in 9h",
    enabled: true,
  },
  {
    id: "presentation",
    title: "Presentation outline",
    project: "Work Stuff",
    schedule: "Weekly on Wednesday at 2:00 PM",
    prompt: "Turn the latest project material into a slide-by-slide presentation outline. Lead with the conclusion, then support it with the key facts and decisions. Keep it to ten slides or fewer.",
    next: "Next in 5d",
    enabled: true,
  },
  {
    id: "week-ahead",
    title: "Week ahead plan",
    project: "Rabbit Hole",
    schedule: "Weekly on Monday at 8:30 AM",
    prompt: "Review the upcoming week and the current project sources. Draft a practical plan with the main priorities, time for focused work, and anything that needs preparation.",
    next: "Next in 3d",
    enabled: true,
  },
];
