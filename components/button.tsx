import React, { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  textClass?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      leftIcon,
      rightIcon,
      textClass,
      type = "button",
      ...buttonProps
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn("inline-flex flex-row items-center font-mono", className)}
        {...buttonProps}
      >
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        <span className={cn(textClass)}>{children}</span>
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
