import * as React from "react"
import { SVGProps } from "react"

const SvgFinding = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={1.5} />
    <circle cx={12} cy={12} r={3} fill="currentColor" />
  </svg>
)

export default SvgFinding
