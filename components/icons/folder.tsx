import * as React from "react"
import { SVGProps } from "react"

const SvgFolder = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      d="M2 5a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"
      fill="#F6C547"
    />
  </svg>
)

export default SvgFolder
