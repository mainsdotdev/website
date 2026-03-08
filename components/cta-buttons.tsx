import { Apple, Github, Windows } from "@/components/icons";

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
          <ArrowRightIcon className="w-4 h-4 shrink-0" />
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
          <MailIcon className="w-4 h-4 shrink-0" />
          <CheckIcon className="w-4 h-4 shrink-0" />
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
          <DownloadIcon className="w-4 h-4 shrink-0" />
        </div>
      </div>
    </button>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );
}

