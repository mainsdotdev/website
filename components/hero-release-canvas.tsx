import { HeroPaperNote } from "@/components/hero-paper-note";
import { HeroVisualizeTile } from "@/components/hero-visualize-tile";
import { HeroImageGenTile } from "@/components/hero-image-gen-tile";
import { HeroFlightsTile } from "@/components/hero-flights-tile";
import { HeroPresentationTile } from "@/components/hero-presentation-tile";
import { HeroVoiceOrb } from "@/components/hero-voice-orb";

/** Hover targets only; the spring that carries a tile there is `.hero-release-tile` in globals.css. */
const TILE_HOVER_CLASS =
  "lg:hover:z-20 lg:hover:rotate-0 lg:hover:scale-115 lg:focus-within:z-20 lg:focus-within:rotate-0 lg:focus-within:scale-115";

export function HeroReleaseCanvas() {
  return (
    <div
      className="hero-release-canvas relative z-10 mt-10 lg:pointer-events-none lg:absolute lg:inset-0 lg:mt-0"
    >
      {/* Reaches well past the canvas — tilted tiles at its edges poke out of
          it — and up to the top of the page, over the dots above the hero.
          The hero clips the sides; the bottom stops at the hero's edge. */}
      <div
        aria-hidden
        className="hero-release-backdrop pointer-events-none absolute -inset-x-40 -top-54 bottom-0 z-10 hidden bg-primary-950/40 opacity-0 backdrop-blur-md transition-opacity duration-400 ease-out lg:block motion-reduce:transition-none"
      />

      <HeroVoiceOrb />

      <ul
        aria-label="Mains feature demos"
        className="relative flex gap-4 overflow-x-auto px-5 pb-5 text-left [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:static lg:block lg:overflow-visible lg:px-0 lg:pb-0"
      >
        <HeroPaperNote
          position="lg:-top-10 lg:left-[55%] lg:w-48 lg:-translate-x-1/2 lg:-rotate-3 xl:left-[56%] xl:w-64 2xl:left-[62%] 2xl:w-80"
          hoverClass={TILE_HOVER_CLASS}
        />

        <HeroFlightsTile
          position="lg:top-6 lg:left-[4%] lg:w-40 lg:-rotate-7 xl:left-[7%] xl:w-48 2xl:left-[17%] 2xl:w-52"
          hoverClass={TILE_HOVER_CLASS}
        />

        <HeroImageGenTile
          position="lg:top-[270px] lg:left-[2%] lg:w-44 lg:rotate-6 xl:top-[290px] xl:left-[3%] xl:w-52 2xl:left-[5%] 2xl:w-60"
          hoverClass={TILE_HOVER_CLASS}
        />

        <HeroVisualizeTile
          position="lg:right-[2%] lg:top-8 lg:w-44 lg:rotate-5 xl:right-[5%] xl:top-12 xl:w-56 2xl:right-[8%]"
          hoverClass={TILE_HOVER_CLASS}
        />

        <HeroPresentationTile
          position="lg:hidden lg:right-[1%] lg:top-[275px] lg:w-40 lg:-rotate-4 xl:block xl:right-[2%] xl:top-[240px] xl:w-56 2xl:right-[15%] 2xl:w-64"
          hoverClass={TILE_HOVER_CLASS}
        />
      </ul>
    </div>
  );
}
