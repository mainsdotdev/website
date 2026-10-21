import * as React from "react"
import { SVGProps } from "react"

// The desktop app's ArrowUp chevron, turned 180° to point down.
const SvgChevronDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    color="currentColor"
    {...props}
    fill="none"
    viewBox="0 0 24 24"
  >
    <path d="M6 9s4.419 6 6 6c1.581 0 6-6 6-6" />
  </svg>
)

export default SvgChevronDown
