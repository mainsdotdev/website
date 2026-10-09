import Link from "next/link";
import { AtlasBackdrop } from "@/components/atlas-backdrop";
import { BridgeBackdrop } from "@/components/bridge-backdrop";
import { MAINS_MARK_PATH } from "@/components/icons/mains";
import {
  MAINS_APP_STORE_URL,
  MAINS_DOCS_URL,
  MAINS_GITHUB_REPO_URL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

type FooterVariant = "blueprint" | "dots" | "meridians" | "bridge";

const FOOTER_COLUMNS = [
  {
    title: "product",
    links: [
      { label: "changelog", href: "/changelog" },
      { label: "work", href: "/work" },
      { label: "atlas", href: "/atlas" },
      { label: "bridge", href: "/bridge" },
    ],
  },
  {
    title: "explore",
    links: [
      { label: "docs", href: MAINS_DOCS_URL },
      { label: "privacy", href: "/privacy" },
      { label: "terms", href: "/terms" },
      { label: "license", href: "/license" },
    ],
  },
  {
    title: "contact",
    links: [
      { label: "github", href: MAINS_GITHUB_REPO_URL },
      { label: "issues", href: `${MAINS_GITHUB_REPO_URL}/issues` },
      { label: "support", href: "/support" },
      { label: "email", href: "mailto:team@mains.dev" },
    ],
  },
] as const;

function FooterWordmark({ variant }: { variant: FooterVariant }) {
  const dotted = variant === "dots";
  const spherical = variant === "meridians";
  const bridge = variant === "bridge";

  return (
    <h2
      className={cn(
        "relative isolate mt-20 flex justify-center overflow-hidden border border-primary-50/5 rounded-3xl text-[clamp(3.5rem,18vw,14rem)] leading-none select-none sm:mt-12",
        dotted && "border-dotted",
      )}
    >
      <span className="sr-only">mains</span>
      {spherical ? (
        <AtlasBackdrop className="inset-0 -z-10 h-full" />
      ) : bridge ? (
        <BridgeBackdrop className="-z-10" />
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 -z-10",
            dotted ? "text-primary-700/30" : "text-primary-50/15",
          )}
          style={{
            backgroundImage: dotted
              ? "radial-gradient(currentColor 1px, transparent 1px)"
              : "repeating-linear-gradient(to bottom, currentColor 0 1px, transparent 1px 12px), repeating-linear-gradient(-45deg, currentColor 0 1px, transparent 1px 7px)",
            backgroundSize: dotted ? "32px 32px" : undefined,
          }}
        />
      )}
      <svg
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        width={996}
        height={240}
        viewBox="-260 -8 996 240"
        fill="none"
        stroke="currentColor"
        strokeWidth={dotted ? 1.5 : 1}
        strokeDasharray={dotted ? "0 4" : undefined}
        strokeLinecap={dotted ? "round" : undefined}
        className="block h-[1em] w-auto max-w-full"
      >
        {/* The circles and extended guides expose the letters' construction. */}
        <g className="text-primary-50/8">
          {!spherical && !bridge && (
            <>
              {[
                -244, -147, -50, 0, 32, 80, 112, 160, 192, 216, 296, 344, 376,
                400, 432, 456, 488, 536, 568, 600, 648, 680, 728,
              ].map((x) => (
                <path
                  key={x}
                  d={`M${x} -8V232`}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {[16, 48, 64, 80, 104, 128, 160, 192, 208].map((y) => (
                <path
                  key={y}
                  d={`M-260 ${y}H736`}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              <rect
                x={-244}
                y={48}
                width={(648 * 160) / 534}
                height={160}
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}
          {[
            [56, 104, 56],
            [56, 104, 24],
            [136, 104, 56],
            [136, 104, 24],
            [296, 128, 80],
            [296, 128, 48],
            [512, 104, 56],
            [512, 104, 24],
            [648, 96, 48],
            [648, 96, 16],
            [680, 160, 48],
            [680, 160, 16],
          ].map(([cx, cy, r]) => (
            <circle
              key={`${cx}-${cy}-${r}`}
              cx={cx}
              cy={cy}
              r={r}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        {/* Closed contours retain the geometric letterforms without a fill. */}
        <g className="text-primary-50/25">
          <path
            d={MAINS_MARK_PATH}
            transform={`translate(-244 48) scale(${160 / 534})`}
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M0 208V104A56 56 0 0 1 96 64.808A56 56 0 0 1 192 104V208H160V104a24 24 0 0 0-48 0v104H80V104a24 24 0 0 0-48 0v104Z"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M344 48H376V208H344V192A80 80 0 1 1 344 64ZM344 128a48 48 0 1 0-96 0a48 48 0 1 0 96 0Z"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx={416} cy={32} r={16} vectorEffect="non-scaling-stroke" />
          <rect
            x={400}
            y={64}
            width={32}
            height={144}
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M456 208V104a56 56 0 0 1 112 0v104H536V104a24 24 0 0 0-48 0v104Z"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M712 48H648a48 48 0 0 0 0 96H680a16 16 0 0 1 0 32H608V208H680a48 48 0 0 0 0-96H648a16 16 0 0 1 0-32H712Z"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        <g className="text-primary-50/15">
          {[
            [-147, 128],
            [56, 104],
            [136, 104],
            [296, 128],
            [416, 32],
            [512, 104],
            [648, 96],
            [680, 160],
          ].map(([x, y]) => (
            <path
              key={`${x}-${y}`}
              d={`M${x - 4} ${y}h8M${x} ${y - 4}v8`}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      </svg>
    </h2>
  );
}

export default function Footer({
  variant = "blueprint",
}: {
  variant?: FooterVariant;
}) {
  return (
    <footer className="relative isolate overflow-hidden bg-primary-950 text-primary-50">
      <div className="mx-auto w-full max-w-7xl px-6 pt-16 pb-5 sm:px-10 sm:pt-20 lg:px-12 lg:pt-24">
        <nav
          aria-label="Footer navigation"
          className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4 lg:gap-x-12"
        >
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-base font-medium leading-tight text-primary-50">
                {column.title}
              </p>
              <ul className="mt-5 space-y-3 text-[15px] leading-snug text-primary-500">
                {column.links.map((link) => {
                  const external = link.href.startsWith("https://");

                  return (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="inline-block rounded-sm hover:text-primary-50 focus-visible:text-primary-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-50"
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-base font-medium leading-tight text-primary-50">
              mains
            </p>
            <p className="mt-5 max-w-64 text-[15px] leading-relaxed text-primary-500">
              Your workspaces and run history stay on your Mac by default. You
              choose the AI providers and tools for each task.
            </p>
          </div>
        </nav>

        <FooterWordmark variant={variant} />

        {/* Apple's marketing guidelines require this credit wherever the App
            Store badge appears, and the badge shows once there's a listing. */}
        {MAINS_APP_STORE_URL && (
          <p className="mt-8 text-center text-xs leading-relaxed text-primary-600">
            Apple and the Apple logo are trademarks of Apple Inc., registered in
            the U.S. and other countries and regions. App Store is a service
            mark of Apple Inc.
          </p>
        )}
      </div>
    </footer>
  );
}
