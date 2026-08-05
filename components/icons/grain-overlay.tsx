import * as React from "react"
import { SVGProps } from "react"

const SvgGrainOverlay = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* numOctaves is a per-pixel loop: each octave halves in amplitude, so past
        ~4 it costs full price for noise nobody can see. WebKit rasterizes SVG
        filters on the CPU, which made a high count block first paint on iOS. */}
    <filter id="grain" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves={3} stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain)" />
  </svg>
)

export default SvgGrainOverlay
