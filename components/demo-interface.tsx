export function DemoInterface() {
  return (
    <div className="bg-primary-900 rounded-lg border border-primary-700 shadow-2xl overflow-hidden">
      {/* VS Code Window Controls */}
      <div className="bg-primary-800 px-4 py-3 flex items-center gap-2">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 text-center text-primary-400 text-sm mr-12">
          Jinzo - Overview
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 min-h-100 flex items-center justify-center text-primary-500">
        <p className="text-lg">Demo interface</p>
      </div>
    </div>
  );
}
