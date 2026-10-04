export const INTEGRATIONS = [
  { name: "GitHub", logo: "/github.png" },
  { name: "Linear", logo: "/linear.png" },
  { name: "Notion", logo: "/notion.png" },
  { name: "GitLab", logo: "/gitlab.png" },
  { name: "Jira", logo: "/jira.png" },
  { name: "Trello", logo: "/trello.png" },
  { name: "Slack", logo: "/slack.png" },
  { name: "Figma", logo: "/figma.png" },
  { name: "Sentry", logo: "/sentry.png" },
  { name: "Asana", logo: "/asana.png" },
] as const;

export const USE_CASES = [
  {
    title: "Preview, annotate, and iterate live",
    description:
      "Open your app in the built-in browser and see changes as agents work. Annotate any element to show what needs attention, watch your feedback turn into updates.",
  },
  {
    title: "Review changes and give feedback in context",
    description:
      "Inspect diffs, leave comments on specific lines, and ask agents to explain. Keep every question tied to the code, so you can review and iterate without leaving Mains.",
  },
  {
    title: "Work with interactive apps alongside your agents",
    description:
      "Open MCP apps directly in Mains and interact with their interfaces alongside your chat. Let agents create a first draft, and keep working together in one place.",
  },
] as const;

/** Latest macOS .dmg builds from GitHub releases (update both when shipping a new version). */
export const MAINS_VERSION = "0.14.2";

export const MAINS_DOWNLOAD_DMG_URL =
  `https://github.com/mainsdotdev/mains/releases/download/v${MAINS_VERSION}/Mains-${MAINS_VERSION}-arm64.dmg`;
/** Intel (x64) build — offered as a secondary text link under the main download button. */
export const MAINS_DOWNLOAD_DMG_X64_URL =
  `https://github.com/mainsdotdev/mains/releases/download/v${MAINS_VERSION}/Mains-${MAINS_VERSION}-x64.dmg`;

/**
 * App Store listing for the iPhone companion app.
 *
 * `null` until the app is released: every App Store link and badge on the site
 * hides itself (or shows "Coming Soon") while this is unset. On release, set it
 * to the real listing, e.g. "https://apps.apple.com/app/id0000000000".
 */
export const MAINS_APP_STORE_URL: string | null = null;

export const MAINS_GITHUB_REPO_URL = "https://github.com/mainsdotdev/mains";

/** The docs are their own site, not a route on this one. */
export const MAINS_DOCS_URL = "https://docs.mains.dev";
