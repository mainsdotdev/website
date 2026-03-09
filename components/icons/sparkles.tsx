import * as React from "react"
import { SVGProps } from "react"

const SvgSparkles = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <path
      d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5L8 1z"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinejoin="round"
    />
  </svg>
)

export default SvgSparkles
