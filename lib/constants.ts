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
    title: "Review every change before committing",
    description:
      "Browse files, inspect diffs, and track changes across tabs. See exactly what the agent modified before you commit or open a pull request.",
  },
  {
    title: "Link tasks from your tools",
    description:
      "Connect issues from GitHub, Gitlab, Linear, Jira, and Asana directly to a workspace. Give agents the right context to start working immediately.",
  },
] as const;

/** Latest macOS .dmg from GitHub releases (update when shipping a new version). */
export const MAINS_DOWNLOAD_DMG_URL =
  "https://github.com/OkanBilal/mains/releases/download/v0.2.2/Mains-0.2.2-arm64.dmg";

export const MAINS_GITHUB_REPO_URL = "https://github.com/OkanBilal/mains";
