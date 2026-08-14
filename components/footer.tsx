import Image from "next/image";


/**
 * The page ends in a photograph rather than a rule: the site's dark surface
 * fades into the image, and the wordmark sits in it, fading out as it runs off
 * the bottom edge.
 */
export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-primary-950">
      <div aria-hidden className="absolute inset-0 -z-10">
        {/* No `quality` override: Next only serves the qualities configured
            for the optimizer (75 by default) and 400s on anything else. */}
        <Image src="/backdrop.webp" alt="" fill sizes="100vw" className="object-cover" />
        {/* Two fades: the page dissolving into the photo from the top, and a
            wash over the whole thing so the type keeps its contrast. */}
        <div className="absolute inset-0 bg-primary-950/55" />
        <div className="absolute inset-x-0 top-0 h-2/3 bg-linear-to-b from-primary-950 via-primary-950/85 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-primary-950/70 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-24 sm:pt-32">


        {/* Cropped at the baseline, like a mark stamped over the edge of the
            page. The gradient fill carries the fade down into the photo. */}
        <h2
          aria-label="Mains"
          className="mt-14 -mb-[0.06em] block bg-linear-to-b from-primary-50/70 to-primary-50/6 bg-clip-text text-center font-sans text-[22vw] leading-[0.86] font-semibold tracking-tighter text-transparent select-none"
        >
          mains.
        </h2>
      </div>
    </footer>
  );
}
