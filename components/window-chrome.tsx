import { cn } from "@/lib/utils";

type WindowChromeProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function WindowChrome({ title, children, className }: WindowChromeProps) {
  return (
    <div className={cn("bg-primary-900 rounded-lg border border-primary-700 shadow-2xl overflow-hidden", className)}>
      <div className="bg-primary-800 px-4 py-3 flex items-center gap-2">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex-1 text-center text-primary-400 text-sm">
          {title}
        </div>
      </div>
      {children}
    </div>
  );
}
