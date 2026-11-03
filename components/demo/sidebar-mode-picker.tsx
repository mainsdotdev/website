import { Bag, Chat, Code, Search } from "@/components/icons";
import { cn } from "@/lib/utils";

/** Compact mode switcher and sidebar search, matching the desktop app. */
export function SidebarModePicker({ mode = "code" }: { mode?: "code" | "work" | "chat" }) {
  const modes = [
    { id: "code", label: "Code", Icon: Code },
    { id: "work", label: "Work", Icon: Bag },
    { id: "chat", label: "Chat", Icon: Chat },
  ];
  return (
    <div className="mb-2 flex items-center gap-1 px-1 text-primary-400">
      {modes.map(({ id, label, Icon }) => (
        <span key={id} title={label} className={cn("flex h-6 items-center gap-1 rounded-full px-1.5", mode === id && "bg-primary-900 text-primary-100")}>
          <Icon className="size-3" />
          {mode === id && <span className="text-[10px] font-medium">{label}</span>}
        </span>
      ))}
      <span title="Search Mains" className="ml-auto flex size-6 items-center justify-center">
        <Search className="size-3" />
      </span>
    </div>
  );
}
