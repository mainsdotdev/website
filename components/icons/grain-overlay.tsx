import * as React from "react"
import { SVGProps } from "react"

const SvgGrainOverlay = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves={120} stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain)" />
  </svg>
)

export default SvgGrainOverlay
