import { SVGProps } from "react"

/** The composer's "Start voice chat" mark: five level bars. */
const SvgVoiceWave = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    {...props}
  >
    <path d="M4 10.5v3" />
    <path d="M8 7v10" />
    <path d="M12 4v16" />
    <path d="M16 8v8" />
    <path d="M20 10.5v3" />
  </svg>
)

export default SvgVoiceWave
