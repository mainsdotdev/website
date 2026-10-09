import {
  ClaudeMark,
  Clock,
  Codex,
  Copilot,
  Cursor,
  Ellipsis,
  Figma,
  Globe,
  Home,
  Linear,
  Plugin,
  Question,
  Relay,
  Search,
  Settings,
  Task,
} from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * The app's `NavigationRail`, shared by every desktop-window mockup on the
 * site so they all show the same app.
 */

export type IconComponent = React.FC<React.SVGProps<SVGSVGElement> & { filled?: boolean }>;

type RailItem = {
  label: string;
  icon: IconComponent;
  iconClassName?: string;
  active?: boolean;
};

/**
 * The app's `NavigationRail` destinations, in its order. The active one draws
 * its icon's `filled` variant, as the app does.
 */
const RAIL_ITEMS: RailItem[] = [
  { label: "Home", icon: Home, active: true },
  { label: "Search Mains", icon: Search },
  { label: "Atlas", icon: Globe },
  { label: "Plugins", icon: Plugin, iconClassName: "-rotate-45" },
  { label: "Tasks", icon: Task },
  { label: "Pulse", icon: Clock },
  { label: "Connect", icon: Relay },
];

/**
 * Pinned MCP apps, in the app's `McpAppRail` under the destinations. The app
 * draws them monochrome so a row of brand marks reads as part of the rail.
 */
const PINNED_APPS: RailItem[] = [
  { label: "Figma", icon: Figma },
  { label: "Linear", icon: Linear },
];

/** Agent spaces at the foot of the rail; only the active one is full strength. */
const SPACES: RailItem[] = [
  { label: "Claude", icon: ClaudeMark },
  { label: "Codex", icon: Codex, active: true },
  { label: "Copilot", icon: Copilot },
  { label: "Cursor", icon: Cursor },
];

function RailButton({
  item: { icon: Icon, iconClassName, active },
}: {
  item: RailItem;
}) {
  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-lg",
        active ? "bg-primary-900 text-primary-50" : "text-primary-300",
      )}
    >
      {/* Only the active destination asks for `filled`; the brand marks
          below have no filled variant to pass it to. */}
      {active ? (
        <Icon className={cn("size-3.5", iconClassName)} filled />
      ) : (
        <Icon className={cn("size-3.5", iconClassName)} />
      )}
    </span>
  );
}

/**
 * The app's `NavigationRail`: page destinations and pinned apps up top;
 * agent spaces, help and settings pinned to the foot. It sits on the content
 * color as its own rounded card, inset from the vibrant chrome around it.
 */
export function NavigationRail({ voiceSlot, mode = "developer", activeLabel = "Home", showSpaces = mode !== "work", showPinnedApps = mode !== "work" }: {
  voiceSlot?: React.ReactNode;
  mode?: "developer" | "work";
  activeLabel?: string;
  showSpaces?: boolean;
  showPinnedApps?: boolean;
} = {}) {
  return (
    <div className="mx-1 mb-1 flex w-8 shrink-0 flex-col items-center rounded-xl bg-(--demo-content) p-1">
      <div className="flex flex-col items-center gap-1.5">
        {RAIL_ITEMS.filter((item) => mode !== "work" || item.label !== "Tasks").map((item) => (
          <RailButton key={item.label} item={{ ...item, active: item.label === activeLabel }} />
        ))}

        <div className="w-6 border-b border-primary-800" />
        {showPinnedApps && PINNED_APPS.map((item) => (
          <RailButton key={item.label} item={item} />
        ))}
        <RailButton item={{ label: "App options", icon: Ellipsis }} />
      </div>

      <div className="mt-auto flex flex-col items-center gap-1">
        {/* The app's RealtimeVoiceDock: a live voice chat shows its orb here,
            just above the spaces. */}
        {voiceSlot}
        <div className="flex flex-col items-center gap-1">
          {showSpaces && SPACES.map(({ label, icon: Icon, active }) => (
            <span
              key={label}
              className={cn(
                "flex size-6 items-center justify-center text-primary",
                !active && "opacity-50",
              )}
            >
              <Icon className="size-3" />
            </span>
          ))}
        </div>
        <div className="my-1 w-6 border-b border-primary-800" />
        <RailButton item={{ label: "Help & Resources", icon: Question }} />
        <RailButton item={{ label: "Settings", icon: Settings }} />
      </div>
    </div>
  );
}
