import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

export default function Button({
  variant = "ghost",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = `${variant} ${className}`.trim();
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
