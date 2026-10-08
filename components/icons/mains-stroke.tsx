import * as React from "react"
import { SVGProps } from "react"
/**
 * The Mains mark as an outline, the app's `mains-stroke` project icon. The app
 * masks a doubled stroke to the shape; a centered stroke in a padded viewBox
 * draws the same at icon sizes without needing a per-instance mask id.
 */
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={34}
    height={32}
    fill="none"
    {...props}
    viewBox="-1 -1 34 32"
  >
    <path
      stroke="currentColor"
      strokeWidth={2}
      strokeLinejoin="round"
      d="M5.63 3.046C8.889 8.383 12 10.756 16 10.756c4 0 7.111-2.373 10.37-7.71.593-.89 1.334-1.038 1.926 0C30.666 6.308 32 10.459 32 15.5c0 5.04-1.333 9.192-3.704 12.454-.592 1.038-1.333.89-1.926 0-3.259-5.338-6.37-7.71-10.37-7.71-4 0-7.111 2.372-10.37 7.71-.593.89-1.334 1.038-1.926 0C1.334 24.692 0 20.54 0 15.5c0-5.04 1.333-9.192 3.704-12.454.592-1.038 1.333-.89 1.926 0Z"
    />
  </svg>
)
export default SvgComponent
