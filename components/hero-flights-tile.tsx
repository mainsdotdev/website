"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HeroChatDialog } from "@/components/hero-chat-dialog";

const FUJI_IMAGE = "/demos/fuji-stamp.png";

type FlightLeg = {
  depart: string;
  departAirport: string;
  arrive: string;
  arriveAirport: string;
  duration: string;
};

type FlightResult = {
  label: string;
  airline: string;
  initials: string;
  price: string;
  outbound: FlightLeg;
  inbound: FlightLeg;
};

// These fares are illustrative content for the hero demo, not live search data.
const FLIGHTS: FlightResult[] = [
  {
    label: "Best · Cheapest",
    airline: "Peach",
    initials: "P",
    price: "₩320K",
    outbound: { depart: "10:35 PM", departAirport: "ICN", arrive: "12:55 AM +1", arriveAirport: "HND", duration: "2h 20" },
    inbound: { depart: "02:10 AM", departAirport: "HND", arrive: "04:40 AM", arriveAirport: "ICN", duration: "2h 30" },
  },
  {
    label: "Fastest",
    airline: "Asiana Airlines",
    initials: "A",
    price: "₩410K",
    outbound: { depart: "09:00 AM", departAirport: "GMP", arrive: "11:20 AM", arriveAirport: "HND", duration: "2h 20" },
    inbound: { depart: "03:45 PM", departAirport: "HND", arrive: "05:55 PM", arriveAirport: "GMP", duration: "2h 10" },
  },
  {
    label: "More options",
    airline: "Korean Air",
    initials: "K",
    price: "₩435K",
    outbound: { depart: "06:40 PM", departAirport: "GMP", arrive: "09:00 PM", arriveAirport: "HND", duration: "2h 20" },
    inbound: { depart: "01:30 AM", departAirport: "HND", arrive: "04:10 AM", arriveAirport: "ICN", duration: "2h 40" },
  },
  {
    label: "More options",
    airline: "ANA",
    initials: "N",
    price: "₩488K",
    outbound: { depart: "12:40 PM", departAirport: "GMP", arrive: "02:55 PM", arriveAirport: "HND", duration: "2h 15" },
    inbound: { depart: "04:10 PM", departAirport: "HND", arrive: "06:35 PM", arriveAirport: "GMP", duration: "2h 25" },
  },
];

function FlightLegRow({ leg }: { leg: FlightLeg }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1fr)] items-center gap-2">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-primary-50">{leg.depart}</p>
        <p className="mt-0.5 text-xs text-primary-400">{leg.departAirport}</p>
      </div>
      <div className="text-center">
        <p className="text-[11px] text-primary-400">{leg.duration}</p>
        <span className="relative my-1 block h-px bg-primary-700 before:absolute before:top-1/2 before:left-0 before:size-1.5 before:-translate-y-1/2 before:rounded-full before:border before:border-primary-500 before:bg-primary-950 after:absolute after:top-1/2 after:right-0 after:size-1.5 after:-translate-y-1/2 after:rounded-full after:border after:border-primary-500 after:bg-primary-950" />
        <p className="text-[11px] text-primary-300">Direct</p>
      </div>
      <div className="min-w-0 text-right">
        <p className="truncate text-sm font-semibold text-primary-50">{leg.arrive}</p>
        <p className="mt-0.5 text-xs text-primary-400">{leg.arriveAirport}</p>
      </div>
    </div>
  );
}

function SearchingCard() {
  return (
    <article
      data-flight-card
      aria-label="Searching for another flight option"
      className="flex w-[min(82vw,355px)] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-primary-700/40 bg-primary-950"
    >
      <div className="border-b border-primary-700/35 p-4">
        <p className="flex items-center gap-2 text-xs font-medium text-primary-200">
          <span aria-hidden className="size-3.5 animate-spin rounded-full border-2 border-primary-700 border-t-primary-100 motion-reduce:animate-none" />
          Searching…
        </p>
        <h3 className="mt-2 text-lg font-semibold text-primary-50">Seoul to Tokyo</h3>
        <p className="text-xs text-primary-400">Oct 2 – Oct 6 · Return</p>
      </div>
      <div aria-hidden className="flex min-h-63 flex-1 flex-col gap-5 p-4">
        <div className="h-4 w-24 animate-pulse rounded bg-primary-800 motion-reduce:animate-none" />
        {[0, 1].map((row) => (
          <div key={row} className="grid grid-cols-[1fr_0.8fr_1fr] items-center gap-3">
            <div className="space-y-2">
              <div className="h-3 w-20 max-w-full animate-pulse rounded bg-primary-800 motion-reduce:animate-none" />
              <div className="h-3 w-12 animate-pulse rounded bg-primary-800 motion-reduce:animate-none" />
            </div>
            <div className="h-px bg-primary-700" />
            <div className="space-y-2 justify-self-end">
              <div className="h-3 w-20 max-w-full animate-pulse rounded bg-primary-800 motion-reduce:animate-none" />
              <div className="ml-auto h-3 w-12 animate-pulse rounded bg-primary-800 motion-reduce:animate-none" />
            </div>
          </div>
        ))}
        <div className="mt-auto h-10 w-full animate-pulse rounded-full bg-primary-800 motion-reduce:animate-none" />
      </div>
    </article>
  );
}

function ResultCard({ flight }: { flight: FlightResult }) {
  return (
    <article
      data-flight-card
      className="flex w-[min(82vw,355px)] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-primary-700/40 bg-primary-950"
    >
      <div className="border-b border-primary-700/35 p-4">
        <p className="text-xs font-semibold text-primary-200">{flight.label}</p>
        <div className="mt-2 flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-primary-50">Seoul to Tokyo</h3>
            <p className="text-xs text-primary-400">Oct 2 – Oct 6 · Return</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xl font-semibold leading-none text-primary-50">{flight.price}</p>
            <p className="mt-1 text-[11px] text-primary-400">Per person</p>
          </div>
        </div>
      </div>
      <div className="flex min-h-63 flex-1 flex-col p-4">
        <p className="flex items-center gap-2 text-sm text-primary-300">
          <span aria-hidden className="flex size-6 items-center justify-center rounded-full border border-primary-700 bg-primary-900 text-[10px] font-bold text-primary-100">
            {flight.initials}
          </span>
          {flight.airline}
        </p>
        <div className="mt-5 space-y-5">
          <FlightLegRow leg={flight.outbound} />
          <FlightLegRow leg={flight.inbound} />
        </div>
        <span className="mt-auto flex min-h-10 items-center justify-center rounded-full bg-blue-500 px-3 text-center text-xs font-medium text-primary-950">
          Compare deals on Skyscanner
        </span>
      </div>
    </article>
  );
}

function FlightResultsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(true);

  const updateScrollControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanScrollBack(track.scrollLeft > 2);
    setCanScrollForward(track.scrollLeft + track.clientWidth < track.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(updateScrollControls);
    window.addEventListener("resize", updateScrollControls);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateScrollControls);
    };
  }, [updateScrollControls]);

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-flight-card]");
    const distance = (card?.offsetWidth ?? 355) + 12;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * distance, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <div className="relative rounded-2xl bg-primary-900/80 py-3 sm:py-4">
      <div
        ref={trackRef}
        onScroll={updateScrollControls}
        role="region"
        aria-label="Sample flight results; scroll horizontally for more options"
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-1 outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 [&::-webkit-scrollbar]:hidden sm:px-4"
      >
        <SearchingCard />
        {FLIGHTS.map((flight) => <ResultCard key={flight.airline} flight={flight} />)}
      </div>
      {canScrollBack && (
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="Scroll flight results left"
          className="absolute top-1/2 left-1 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full  bg-primary-950 text-xl text-primary-50 shadow-lg transition-colors hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 sm:left-2"
        >
          <span aria-hidden="true">{"<"}</span>
        </button>
      )}
      {canScrollForward && (
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="Scroll flight results right"
          className="absolute top-1/2 right-1 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary-950 text-xl text-primary-50 shadow-lg transition-colors hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 sm:right-2"
        >
          <span aria-hidden="true">{">"}</span>
        </button>
      )}
    </div>
  );
}

export function HeroFlightsTile({ position, hoverClass }: { position: string; hoverClass: string }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => buttonRef.current?.focus());
  };

  return (
    <>
      <li className={`hero-release-tile relative z-0 w-36 shrink-0 lg:pointer-events-auto lg:absolute ${hoverClass} ${position}`}>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open flight search chat preview"
          aria-haspopup="dialog"
          aria-expanded={open}
          className="group relative block w-full cursor-pointer rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-primary-50 focus-visible:ring-offset-4 focus-visible:ring-offset-primary-950"
        >
          <span className="relative block aspect-1175/1338 w-full overflow-hidden ">
            <Image
              src={FUJI_IMAGE}
              alt="Fuji National Park illustrated postage stamp"
              fill
              sizes="(min-width: 1536px) 160px, (min-width: 1280px) 144px, 112px"
              className="object-cover transition-transform duration-600 ease-spring group-hover:scale-105"
            />
          </span>
          <span className="hero-tile-caption mt-2 block text-[10px] leading-snug text-primary-300">
            Explore flights in a Mains chat.
          </span>
        </button>
      </li>

      {open && (
        <HeroChatDialog
          title="Flight search in a Mains conversation"
          prompt={
            <>
              <span>Flights from Seoul to Tokyo next weekend, returning Tuesday.</span>
              <span className="ml-2 inline-flex items-center gap-1 rounded-lg bg-primary-950 px-2 py-1 text-xs text-primary-200">
                <span aria-hidden="true">✺</span> Skyscanner
              </span>
            </>
          }
          onClose={close}
          triggerRef={buttonRef}
        >
          <p className="mb-7 max-w-3xl text-sm leading-relaxed text-primary-100 sm:text-base">
            I’ll compare flights from both Seoul airports to Haneda and find the most practical round-trip options.
          </p>
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-primary-400 sm:text-sm">
            <span aria-hidden="true" className="flex size-5 items-center justify-center rounded bg-primary-100 text-xs text-primary-950">✺</span>
            <span>Skyscanner · flights-live-prices-create-search</span>
            <span aria-hidden="true">›</span>
            <span className="ml-auto font-mono text-[10px] tracking-wide uppercase">Demo fares</span>
          </div>
          <FlightResultsCarousel />
          <p className="mt-3 text-xs text-primary-400">Illustrative results for this interactive preview.</p>
        </HeroChatDialog>
      )}
    </>
  );
}
