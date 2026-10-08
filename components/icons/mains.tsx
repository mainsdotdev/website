import * as React from "react"
import { SVGProps } from "react"
/** The Mains mark, from the app's `mains-default.icon`. Inherits its color. */
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={648}
    height={534}
    fill="none"
    {...props}
    viewBox="0 0 648 534"
  >
    <path
      fill="currentColor"
      d="M114 15.2931C180 123.293 243 171.293 324 171.293C405 171.293 468 123.293 534 15.2931C546 -2.70685 561 -5.70685 573 15.2931C621 81.2931 648 165.293 648 267.293C648 369.293 621 453.293 573 519.293C561 540.293 546 537.293 534 519.293C468 411.293 405 363.293 324 363.293C243 363.293 180 411.293 114 519.293C102 537.293 87 540.293 75 519.293C27 453.293 0 369.293 0 267.293C0 165.293 27 81.2931 75 15.2931C87 -5.70685 102 -2.70685 114 15.2931Z"
    />
  </svg>
)
export default SvgComponent
