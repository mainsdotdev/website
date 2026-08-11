"use client";

import { useEffect, useRef, useState } from "react";

type LazyVideoProps = {
  src: string;
  poster: string;
  /** Strings, because MDX posts can't pass `{numbers}` — see mdx-content. */
  width: number | string;
  height: number | string;
  className?: string;
  "aria-label"?: string;
};

/**
 * A looping demo clip that costs nothing until it is scrolled to.
 *
 * An `autoPlay` video is fetched in full the moment the page loads, no matter
 * how far below the fold it sits — four of them on a changelog post means
 * megabytes spent before the reader has scrolled a line. Here the poster is
 * the only thing that loads up front; `src` is attached on approach, and the
 * clip pauses again on the way out so idle decoders don't burn battery.
 *
 * `width`/`height` feed the UA's aspect-ratio rule, so the box is the right
 * shape before either the poster or the video arrives.
 */
export function LazyVideo({
  src,
  poster,
  width,
  height,
  className,
  "aria-label": ariaLabel,
}: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Attaching `src` under preload="none" costs nothing — the fetch starts at
    // play() — so both it and the poster can be armed a screen early, leaving
    // the actual download to the moment the clip is on screen.
    const armed = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        armed.disconnect();
      },
      { rootMargin: "800px" }
    );

    const playback = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // play() rejects when the browser declines autoplay — a muted clip is
        // normally allowed, and a rejection here is not worth surfacing.
        void el.play().catch(() => {});
      } else {
        el.pause();
      }
    });

    armed.observe(el);
    playback.observe(el);
    return () => {
      armed.disconnect();
      playback.disconnect();
    };
  }, []);

  return (
    <video
      ref={ref}
      src={near ? src : undefined}
      poster={near ? poster : undefined}
      width={width}
      height={height}
      loop
      muted
      playsInline
      preload="none"
      aria-label={ariaLabel}
      className={className}
    />
  );
}
