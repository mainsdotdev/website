/**
 * The mockup's three chats: a Codex voice conversation and the two chats it
 * handed work to. Plain data, so the client tab strip and the server-rendered
 * transcripts agree on ids and titles.
 */
export const CHAT_TABS = [
  { id: "voice", title: "Release prep" },
  { id: "flaky", title: "Flaky test: sidebar-order" },
  { id: "image", title: "OG image: Earth from the Moon" },
] as const;

export type ChatTabId = (typeof CHAT_TABS)[number]["id"];
