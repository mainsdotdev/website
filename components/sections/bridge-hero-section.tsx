import { BridgeMark } from "@/components/bridge-mark";
import HeaderSpacer from "@/components/header-spacer";
import styles from "@/components/sections/bridge-hero-section.module.css";

export function BridgeHeroSection() {
  return (
    <div className={styles.canvas}>
      {/* Like the other heroes, the backdrop starts behind the navigation. */}
      <div aria-hidden="true" className={styles.backdrop}>
        <div className={styles.flow}>
          <div className={styles.mark}>
            <BridgeMark />
          </div>
        </div>
      </div>

      <HeaderSpacer />
      <section aria-labelledby="bridge-title" className={styles.hero}>
        <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          <p className="mb-6 text-xl tracking-tight text-primary-300 sm:mb-7 sm:text-2xl">
            Bridge
          </p>
          <h1
            id="bridge-title"
            className="font-sans text-[2rem] leading-[1.15] font-normal tracking-tight text-primary-50/95 sm:text-4xl md:text-5xl lg:text-[3.25rem]"
          >
            Your work,
            <br />
            across your devices.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-primary-400 sm:mt-7 sm:text-xl">
            Keep your Mains workspaces in sync.
            <br className="hidden sm:block" />
            {" "}Pick up right where you left off.
          </p>
          <p className="mt-9 inline-flex items-center gap-2.5 rounded-full bg-primary-50 px-6 py-3 text-sm font-medium text-primary-950 sm:mt-10">
            
            Coming soon
          </p>
        </div>
      </section>
    </div>
  );
}
