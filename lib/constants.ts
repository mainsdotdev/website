export const INTEGRATIONS = [
  { name: "GitHub", logo: "/github.png" },
  { name: "Linear", logo: "/linear.png" },
  { name: "Notion", logo: "/notion.png" },
  { name: "GitLab", logo: "/gitlab.png" },
  { name: "Jira", logo: "/jira.png" },
  { name: "Trello", logo: "/trello.png" },
  { name: "Slack", logo: "/slack.png" },
  { name: "Figma", logo: "/figma.png" },
  { name: "Todoist", logo: "/todoist.png" },
  { name: "Asana", logo: "/asana.png" },
] as const;

export const USE_CASES = [

  {
    title: "Chat with your work context",
    description:
      'Ask questions across your tools in one chat. "Noisy issues?", "What changed since yesterday?", "What needs action?"',
  },
  {
    title: "What should I focus on today?",
    description:
      "Get a daily briefing from your own data. Prioritized tasks, context, and suggestions - generated locally.",
  },
  {
    title: "Track issues across your tools",
    description:
      "Pull in issues from GitHub, Linear, and Jira into a single view. Stay on top of what matters without switching tabs.",
  },
] as const;
