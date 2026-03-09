import * as React from "react"
import { SVGProps } from "react"

const SvgCommitCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <circle cx={8} cy={8} r={3} stroke="currentColor" strokeWidth={1.2} />
    <path d="M8 1v4M8 11v4" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
  </svg>
)

export default SvgCommitCircle
