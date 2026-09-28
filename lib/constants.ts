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
    title: "Run agents in isolated workspaces",
    description:
      "Spin up Git-backed workspaces linked to your repos. Run AI coding agents like Claude Code, Copilot or Codex in secure, sandboxed environments.",
  },
  {
    title: "Write commits and open PRs faster",
    description:
      "Generate a commit message and a clear PR description from your changes, then commit and open the pull request without leaving Mains.",
  },
  {
    title: "Preview your site as you build",
    description:
      "Open your local website in Mains’ built-in browser to check layouts and interactions as you work. Spot issues quickly and keep building in one place.",
  },
] as const;

/** Latest macOS .dmg builds from GitHub releases (update both when shipping a new version). */
export const MAINS_VERSION = "0.11.0";

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
