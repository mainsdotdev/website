import type { SVGProps } from "react";

type MenuToggleProps = SVGProps<SVGSVGElement> & {
  isOpen: boolean;
};

/** Two parallel strokes that meet at the center to form a close icon. */
export default function MenuToggle({ isOpen, ...props }: MenuToggleProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      {...props}
    >
      <line
        x1={3}
        y1={12}
        x2={21}
        y2={12}
        className="transition-transform duration-300 ease-spring-critical motion-reduce:transition-none"
        style={{
          transformOrigin: "12px 12px",
          transform: isOpen
            ? "translateY(0px) rotate(45deg)"
            : "translateY(-3px) rotate(0deg)",
        }}
      />
      <line
        x1={3}
        y1={12}
        x2={21}
        y2={12}
        className="transition-transform duration-300 ease-spring-critical motion-reduce:transition-none"
        style={{
          transformOrigin: "12px 12px",
          transform: isOpen
            ? "translateY(0px) rotate(-45deg)"
            : "translateY(3px) rotate(0deg)",
        }}
      />
    </svg>
  );
}
