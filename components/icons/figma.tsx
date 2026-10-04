import { SVGProps } from "react"

/** Figma's mark as an outline, the way the navigation rail draws pinned apps. */
const SvgFigma = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2.75H9.25a3.125 3.125 0 0 0 0 6.25H12V2.75Z" />
    <path d="M12 2.75h2.75a3.125 3.125 0 0 1 0 6.25H12V2.75Z" />
    <path d="M12 9H9.25a3.125 3.125 0 0 0 0 6.25H12V9Z" />
    <circle cx={14.875} cy={12.125} r={3.125} />
    <path d="M12 15.25H9.25a3.125 3.125 0 1 0 2.75 3.1V15.25Z" />
  </svg>
)

export default SvgFigma
