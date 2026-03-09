import { Apple, Github, Windows, ArrowRightLine, Mail, CheckLine, DownloadLine } from "@/components/icons";

type GitHubButtonProps = {
  className?: string;
};

export function GitHubButton({ className }: GitHubButtonProps) {
  return (
    <button
      className={`group relative bg-primary-900 min-h-10 hover:bg-primary-900/60 text-white rounded-md px-2.5 py-1.5 text-sm font-semibold flex items-center gap-2 mr-4 ${className}`}
    >
      <span>See on GitHub</span>
      <div className="relative w-4 h-4 overflow-hidden">
        <div className="flex flex-row items-center -translate-x-4 transition-transform duration-150 ease-in-out group-hover:translate-x-0">
          <ArrowRightLine className="w-4 h-4 shrink-0" />
          <Github color="#fff" className="w-4 h-4 shrink-0" />
        </div>
      </div>
    </button>
  );
}

type WaitlistButtonProps = {
  onClick: () => void;
  className?: string;
};

export function WaitlistButton({ onClick, className }: WaitlistButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative bg-white min-h-8 hover:bg-gray-200 text-black rounded-md px-2.5 py-1.5 border border-gray-300 text-sm font-semibold flex items-center gap-2 ${className}`}
    >
      <span>Join Beta Waitlist</span>
      <div className="relative w-4 h-4 overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center transition-transform duration-150 ease-in-out group-hover:-translate-y-4">
          <Mail className="w-4 h-4 shrink-0" />
          <CheckLine className="w-4 h-4 shrink-0" />
        </div>
      </div>
    </button>
  );
}

type DownloadButtonProps = {
  platform: "macOS" | "Windows";
  className?: string;
};

export function DownloadButton({ platform, className }: DownloadButtonProps) {
  const isMac = platform === "macOS";

  return (
    <button
      className={`group relative bg-white min-h-8 hover:bg-gray-200 text-black rounded-md px-2.5 py-1.5 border border-gray-300 text-sm font-semibold flex items-center gap-2 ${className}`}
    >
      <span>Download for {platform}</span>
      <div className="relative w-4 h-4 overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center transition-transform duration-150 ease-in-out group-hover:-translate-y-4">
          {isMac ? (
            <Apple className="w-4 h-4 shrink-0" />
          ) : (
            <Windows className="w-4 h-4 shrink-0" />
          )}
          <DownloadLine className="w-4 h-4 shrink-0" />
        </div>
      </div>
    </button>
  );
}
