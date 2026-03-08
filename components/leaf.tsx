import * as React from "react"
import { SVGProps } from "react"
const Leaf = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 18C19.954 18 20.917 7.83 20.994 2.997a.983.983 0 0 0-1.006-.988C3 2.321 3 10.557 3 18v4"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 18s0-6 8-7"
    />
  </svg>
)
export default Leaf
