import { SVGProps } from "react"

/** Slack's mark, from the app's icon set, drawn in one color. */
const SvgSlack = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 32 32"
    fill="currentColor"
    {...props}
  >
    <path d="M26.5 15a2.5 2.5 0 1 0-2.5-2.5V15h2.5Zm-7 0a2.5 2.5 0 0 0 2.5-2.5v-7a2.5 2.5 0 0 0-5 0v7a2.5 2.5 0 0 0 2.5 2.5Z" />
    <path d="M5.5 17A2.5 2.5 0 1 0 8 19.5V17H5.5Zm7 0a2.5 2.5 0 0 0-2.5 2.5v7a2.5 2.5 0 0 0 5 0v-7a2.5 2.5 0 0 0-2.5-2.5Z" />
    <path d="M17 26.5a2.5 2.5 0 1 0 2.5-2.5H17v2.5Zm0-7a2.5 2.5 0 0 0 2.5 2.5h7a2.5 2.5 0 0 0 0-5h-7a2.5 2.5 0 0 0-2.5 2.5Z" />
    <path d="M15 5.5A2.5 2.5 0 1 0 12.5 8H15V5.5Zm0 7a2.5 2.5 0 0 0-2.5-2.5h-7a2.5 2.5 0 0 0 0 5h7a2.5 2.5 0 0 0 2.5-2.5Z" />
  </svg>
)

export default SvgSlack
