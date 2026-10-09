/**
 * The mockup's three chats: a Codex voice conversation and the two chats it
 * handed work to. Plain data, so the client tab strip and the server-rendered
 * transcripts agree on ids and titles.
 */
export const CHAT_TABS = [
  { id: "voice", title: "My day" },
  { id: "dinner", title: "Dinner plan" },
  { id: "image", title: "Earth wallpaper" },
] as const;

export type ChatTabId = (typeof CHAT_TABS)[number]["id"];
