"use client";

import { useEffect, useRef, useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { PulseDemo } from "@/components/demo/pulse-demo";
import { McpAppDemo } from "@/components/demo/mcp-app-demo";
import { VisualizeDemo } from "@/components/demo/visualize-demo";

type UseCase = { title: string; description: string };
type UseCasesSectionProps = { useCases: readonly UseCase[] };

// Each use case is drawn live, not filmed.
const MOCKUPS = [PulseDemo, VisualizeDemo, McpAppDemo] as const;

function PreviewFrame({ index }: { index: number }) {
  const Mockup = MOCKUPS[index % MOCKUPS.length];

  return (
    // The voice orb moves into each mockup once its frame is centred on screen.
    <div data-orb-frame className="overflow-hidden rounded-xl border border-primary-700/40 bg-primary-900 p-0.75 sm:rounded-xl sm:p-1">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-primary-700/20 bg-primary-950 sm:rounded-xl">
        <Mockup className="absolute inset-0" />
      </div>
    </div>
  );
}

export function UseCasesSection({ useCases }: UseCasesSectionProps) {
  const cases = useCases.slice(0, MOCKUPS.length);
  const [activeIndex, setActiveIndex] = useState(0);
  const frameRefs = useRef<(HTMLElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let frame = 0;

    const updateActive = () => {
      frame = 0;
      const viewportCenter = window.innerHeight * 0.5;
      let nearestIndex = 0;
      let nearestDistance = Infinity;

      frameRefs.current.slice(0, cases.length).forEach((element, index) => {
        if (!element) return;
        const bounds = element.getBoundingClientRect();
        const distance = Math.abs(bounds.top + bounds.height / 2 - viewportCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      setActiveIndex((current) => current === nearestIndex ? current : nearestIndex);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [cases.length]);

  const scrollToFrame = (index: number) => {
    frameRefs.current[index]?.scrollIntoView({
      behavior: prefersReducedMotion ? "instant" : "smooth",
      block: "center",
    });
  };

  return (
    <section
      id="use-cases"
      aria-labelledby="use-cases-title"
      className="px-5 py-24 sm:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-360">
        <div className="mx-auto mb-10 max-w-3xl text-center lg:mb-20">

          <h2
            id="use-cases-title"
            className=" text-5xl leading-none tracking-tight text-primary-50 sm:text-6xl lg:text-6xl"
          >
            Built for agent workflows.
            </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)] lg:items-start lg:gap-16 xl:gap-24">
          <div className="space-y-20 lg:space-y-0">
            {cases.map((useCase, index) => (
              <article
                key={useCase.title}
                ref={(element) => { frameRefs.current[index] = element; }}
                className="flex scroll-mt-24 flex-col justify-center lg:min-h-[86vh]"
                aria-label={useCase.title}
              >
                <PreviewFrame index={index} />
                <div className="mt-6 lg:hidden">
                  <h3 className="mt-2 text-2xl tracking-tight text-primary-50">
                    {useCase.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-primary-400">
                    {useCase.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden lg:sticky lg:top-[max(6rem,calc(50vh-14rem))] lg:block">
            <LayoutGroup id="use-case-indicator">
              <nav aria-label="Use cases" className="relative border-l border-primary-700/40">
                {cases.map((useCase, index) => {
                  const active = activeIndex === index;
                  return (
                    <button
                      key={useCase.title}
                      type="button"
                      onClick={() => scrollToFrame(index)}
                      aria-current={active ? "step" : undefined}
                      className="relative block w-full cursor-pointer py-6 pr-2 pl-7 text-left focus-visible:rounded-r-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    >
                      {active && (
                        <motion.span
                          layoutId="active-indicator"
                          aria-hidden="true"
                          className="absolute inset-y-0 -left-px w-0.5 rounded-full bg-primary-50"
                          transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 340, damping: 34 }}
                        />
                      )}

                      <span className={`mt-2 block text-2xl leading-tight tracking-tight transition-colors duration-300 xl:text-[1.75rem] ${active ? "text-primary-50" : "text-primary-500"}`}>
                        {useCase.title}
                      </span>
                      <span className={`grid transition-[grid-template-rows,opacity] duration-300 ${active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                        <span className="overflow-hidden">
                          <span className="mt-3 block max-w-sm text-sm leading-relaxed text-primary-400">
                            {useCase.description}
                          </span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </nav>
            </LayoutGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
