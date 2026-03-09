import * as React from "react"
import { SVGProps } from "react"

const SvgDescription = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path d="M12 21a9 9 0 100-18 9 9 0 000 18z" stroke="currentColor" strokeWidth={1.5} />
    <path d="M8 12h8M8 9h5M8 15h6" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
  </svg>
)

export default SvgDescription
