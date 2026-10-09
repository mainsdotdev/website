import * as React from "react"
import { SVGProps } from "react"
/** A speaker; `muted` crosses it out, otherwise it sends out sound waves. */
const SvgComponent = ({ muted = false, ...props }: SVGProps<SVGSVGElement> & { muted?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
    viewBox="0 0 16 16"
  >
    <path fill="currentColor" stroke="none" d="M2.5 6v4h2.5l3.5 3V3L5 6Z" />
    {muted ? <path d="m11 6 3.5 4m0-4L11 10" /> : <path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.6a6 6 0 0 1 0 8.8" />}
  </svg>
)
export default SvgComponent
