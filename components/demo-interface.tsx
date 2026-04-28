import { WindowChrome } from "@/components/window-chrome";

export function DemoInterface() {
  return (
    <WindowChrome title="Mains - Overview">
      <div className="p-8 min-h-100 flex items-center justify-center text-primary-500">
        <p className="text-lg">Demo interface</p>
      </div>
    </WindowChrome>
  );
}
