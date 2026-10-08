import type { TurnFile } from "@/components/demo/turn-changes-card";

/**
 * The six files the Full Access confirmation turn edited, as the app's Mains
 * repo has them — shared by the mockups that show that turn.
 */
export const EDITED_FILES: TurnFile[] = [
  { path: "apps/desktop/src/renderer/components/ui/full-access-confirmation-modal.tsx", additions: 96, deletions: 0 },
  { path: "apps/desktop/src/renderer/components/ui/index.ts", additions: 1, deletions: 0 },
  { path: "apps/desktop/src/renderer/components/ui/input/permission-mode-dropdown.tsx", additions: 16, deletions: 2 },
  { path: "apps/desktop/src/renderer/features/settings/components/codex.tsx", additions: 17, deletions: 1 },
  { path: "apps/desktop/src/renderer/features/workspace/components/input-toolbar.test.ts", additions: 24, deletions: 0 },
  { path: "apps/desktop/src/renderer/features/settings/components/codex.test.tsx", additions: 65, deletions: 0 },
];
