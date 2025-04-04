import React from "react";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function Button({
  children,
  className = "",
  type = "button",
  disabled = false,
  onClick,
  ...restProps
}: ButtonProps) {
  return (
    <button
      className={`interactive btn ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...restProps}
    >
      {children}
    </button>
  );
}

export default Button;
