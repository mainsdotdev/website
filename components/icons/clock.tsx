import * as React from "react"
import { SVGProps } from "react"

const SvgClock = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    {...props}
  >
    <circle cx={12} cy={12} r={9} />
    <path d="M12 7v5l3 3" />
  </svg>
)

export default SvgClock
