import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";

function splitReleaseTitle(title: string): [string, string] {
  const atHome = title.lastIndexOf(" at ");
  if (atHome !== -1) return [title.slice(0, atHome), title.slice(atHome + 1)];

  const comma = title.indexOf(",");
  if (comma !== -1) {
    return [title.slice(0, comma + 1), title.slice(comma + 1).trim()];
  }

  return [title, ""];
}

/** Shared release card for the home changelog and the full blog listing. */
export function PostCard({
  post,
  className,
  priority = false,
  headingLevel = "h3",
}: {
  post: Post;
  className?: string;
  priority?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const number = post.version?.split(".").at(-1)?.padStart(3, "0");
  const title = post.title.replace(/^Mains\s+\d+(?:\.\d+)*:\s*/i, "");
  const [titleLead, titleRest] = splitReleaseTitle(title);
  const Heading = headingLevel;

  return (
    <Link
      href={post.url}
      aria-label={`Read release notes: ${post.title}`}
      className={cn(
        "group relative block aspect-350/400 rounded-[20px] bg-[#fbfbf8]/80 shadow-[inset_0_2px_0_#fff,0_0_2px_rgba(0,0,0,0.25),0_0_0_4px_rgba(232,231,230,0.32)] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-6 focus-visible:outline-primary-500 motion-reduce:transition-none",
        className
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[20px] bg-primary-850">
        {post.image ? (
          <Image
            src={post.image}
            alt={`${post.title} release artwork`}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-center transition-transform duration-700 ease-out motion-reduce:transition-none"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-primary-850 text-6xl text-primary-500/40">
            Mains
          </div>
        )}

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%]"
          style={{
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.36), rgba(0, 0, 0, 0.06) 55%, transparent)",
          }}
        />

        {number && (
          <div
            aria-hidden="true"
            className="absolute right-5 top-5 rotate-[8deg] border-2 border-dashed border-[#a93e33] bg-[#fff8e9]/95 p-1 text-[#a93e33] shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
          >
            <div className="flex h-18 w-18 flex-col items-center justify-center border border-[#a93e33]/70 text-center">
              <span className="text-[8px] leading-none">MAINS</span>
              <span className="mt-1 font-sans text-[2rem] leading-none font-semibold">
                {number}
              </span>
              <span className="mt-1 text-[7px] leading-none">RELEASE</span>
            </div>
          </div>
        )}

        <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.20))] p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.24),inset_0_-1px_2px_rgba(0,0,0,0.1)] backdrop-blur-[10px] sm:inset-x-4 sm:bottom-4 sm:p-5">
          <Heading className="text-balance text-[clamp(1.5rem,2vw,1.5rem)] leading-[1.15] font-normal tracking-[0.01em] [text-shadow:0_1px_3px_rgba(0,0,0,0.28)]">
            <span className="block text-[#fff]">{titleLead}</span>
            {titleRest && (
              <span className="block text-[rgba(255,255,255,0.7)]">
                {titleRest}
              </span>
            )}
          </Heading>
        </div>
      </div>
    </Link>
  );
}
