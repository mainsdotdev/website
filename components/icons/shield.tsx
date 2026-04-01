import { SVGProps } from "react"

const SvgShield = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M8 1L2.5 3.5V7.5C2.5 11.09 4.82 14.41 8 15.25C11.18 14.41 13.5 11.09 13.5 7.5V3.5L8 1Z" />
    <path d="M5.5 8L7 9.5L10.5 6" />
  </svg>
)

export default SvgShield
