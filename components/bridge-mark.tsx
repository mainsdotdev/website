import type { CSSProperties } from "react";
import { MAINS_MARK_PATH } from "@/components/icons/mains";
import styles from "@/components/bridge-mark.module.css";

// The lanes gather at the mark's waist, then fan out into the other device.
export const BRIDGE_LANES = Array.from({ length: 13 }, (_, index) => {
  const edgeY = 67 + index * 33.4;
  const centerY = 195 + index * 12;

  return {
    path: `M-48 ${edgeY} C142 ${edgeY} 208 ${centerY} 324 ${centerY} S506 ${edgeY} 696 ${edgeY}`,
    reverse: index % 2 === 1,
    duration: 6.8 + (index % 4) * 0.7,
    delay: -(index * 1.37 + 0.8),
  };
});

/** An outline of the shared Mains mark carrying two-way sync traffic. */
export function BridgeMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-8 -8 664 550"
      width={664}
      height={550}
      fill="none"
      className={styles.mark}
      role="img"
      aria-label="Data flowing in both directions through the Mains logo"
    >
      <defs>
        <clipPath id="bridge-mark-clip">
          <path d={MAINS_MARK_PATH} />
        </clipPath>
        {BRIDGE_LANES.map((lane, index) => (
          <path
            key={index}
            id={`bridge-lane-${index}`}
            d={lane.path}
            pathLength={1000}
          />
        ))}
      </defs>

      <g clipPath="url(#bridge-mark-clip)">
        <g className={styles.lanes} stroke="currentColor" strokeWidth={0.6}>
          {BRIDGE_LANES.map((_, index) => (
            <use key={index} href={`#bridge-lane-${index}`} />
          ))}
        </g>

        {BRIDGE_LANES.map((lane, index) => (
          <g
            key={index}
            className={styles.packet}
            data-reverse={lane.reverse || undefined}
            style={
              {
                "--flow-duration": `${lane.duration}s`,
                "--flow-delay": `${lane.delay}s`,
              } as CSSProperties
            }
            stroke="currentColor"
            strokeLinecap="round"
          >
            <use
              href={`#bridge-lane-${index}`}
              className={styles.tail}
              strokeWidth={1.2}
              strokeDasharray="32 968"
            />
            <use
              href={`#bridge-lane-${index}`}
              className={styles.body}
              strokeWidth={1.2}
              strokeDasharray="12 988"
            />
            <use
              href={`#bridge-lane-${index}`}
              className={styles.head}
              strokeWidth={1.6}
              strokeDasharray="3 997"
            />
          </g>
        ))}
      </g>

      <path
        d={MAINS_MARK_PATH}
        className={styles.outline}
        stroke="currentColor"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
