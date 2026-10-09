import { Cpu, Document, Page, Picture, Rocket } from "@/components/icons";
import type { IconComponent } from "./navigation-rail";
import { ATLAS_TEMPLATES } from "./atlas-templates-data";

export type AtlasLibraryItem = {
  id: string;
  title: string;
  kind: "page" | "doc" | "image";
  Icon: IconComponent;
  markdown: string;
  image?: string;
  aspect?: string;
  project: string;
  origin: "upload" | "generated" | "saved";
  favorite: boolean;
  time: string;
};

export const ATLAS_LIBRARY_ITEMS: AtlasLibraryItem[] = [
  { id: "evening", title: "Evening light.jpg", kind: "image", Icon: Picture, markdown: "", image: "/hero.jpg", aspect: "aspect-[1.7]", project: "Visual Works", origin: "upload", favorite: true, time: "6m ago" },
  { id: "launch", title: "Launch checklist", kind: "page", Icon: Rocket, markdown: ATLAS_TEMPLATES[3].markdown, project: "Work Stuff", origin: "saved", favorite: true, time: "7m ago" },
  {
    id: "genui", title: "Generative UI Explained", kind: "page", Icon: Cpu, project: "Rabbit Hole", origin: "saved", favorite: true, time: "38m ago",
    markdown: `Generative UI is an interface that AI selects, assembles, or creates in response to a person's goal and context. The response can include cards, charts, forms, maps, or interactive tools alongside text.

This lets people work directly with an answer: compare options, adjust inputs, and explore results.

For a product team, the central design question is which parts of the experience should adapt to the task and which should stay familiar. A useful starting point is a stable application with flexible views for specific tasks.

## How the experience changes

| Approach | What the person receives | How they continue |
| --- | --- | --- |
| Text answer | An explanation | Ask another question |
| Interactive response | Controls and useful context | Try, adjust, and explore |

## Start small

- Choose one task people already understand
- Keep navigation and actions familiar
- Make every result easy to edit or save`,
  },
  { id: "earth", title: "Earth mosaic.png", kind: "image", Icon: Picture, markdown: "", image: "/demos/earth-mosaic.png", aspect: "aspect-[1.15]", project: "Visual Works", origin: "generated", favorite: true, time: "33m ago" },
  { id: "moon", title: "Earth from the Moon.webp", kind: "image", Icon: Picture, markdown: "", image: "/demos/earth-from-moon.webp", aspect: "aspect-video", project: "Visual Works", origin: "generated", favorite: false, time: "33m ago" },
  {
    id: "reading", title: "How to Start Reading the Iliad and the Odyssey", kind: "page", Icon: Page, project: "Rabbit Hole", origin: "saved", favorite: true, time: "34m ago",
    markdown: `## Start with the story

Read a short introduction to the Trojan War, then choose a translation whose voice feels inviting.

## A gentle reading plan

- Read one book at a time
- Keep a short list of recurring names
- Notice what the characters want, rather than memorizing every detail

## Keep a reading notebook

Save a passage that stays with you and write one question after each reading session.`,
  },
  {
    id: "tokyo", title: "Tokyo Running Guide", kind: "page", Icon: Page, project: "Trips & Things", origin: "saved", favorite: true, time: "34m ago",
    markdown: `## Pick your pace

An easy run can be a way to get to know a neighborhood. Plan a short loop with room to stop and look around.

## Before you head out

- Check the weather and daylight
- Bring water and your route
- Keep the first day relaxed

## After the run

Note the distance, how the route felt, and a place you would like to return to.`,
  },
  { id: "notes", title: "Research notes.md", kind: "doc", Icon: Document, markdown: ATLAS_TEMPLATES[1].markdown, project: "Rabbit Hole", origin: "upload", favorite: false, time: "41m ago" },
  { id: "context", title: "CONTEXT.md", kind: "doc", Icon: Document, project: "Work Stuff", origin: "generated", favorite: true, time: "54m ago", markdown: "## Project context\n\nA shared place for the decisions, research, and materials that shape the work.\n\n## Next steps\n\n- [ ] Review the project brief\n- [ ] Capture open questions\n- [ ] Agree on the next milestone" },
  { id: "cover", title: "Generative UI cover.webp", kind: "image", Icon: Picture, markdown: "", image: "/demos/generative-ui.webp", aspect: "aspect-square", project: "Rabbit Hole", origin: "generated", favorite: false, time: "1h ago" },
];

export const ATLAS_RECENTS = ["launch", "reading", "tokyo", "genui"] as const;
