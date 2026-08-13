import * as React from "react"
import { SVGProps } from "react"

const SvgHamburger = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1={3} y1={7} x2={21} y2={7} />
    <line x1={3} y1={17} x2={21} y2={17} />
  </svg>
)

export default SvgHamburger
