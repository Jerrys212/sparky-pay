import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "@/components/ui/asterisk-shape";

export type ButtonVariant = "primary" | "secondary" | "light" | "danger" | "outline-primary";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-forest-medium text-white hover:bg-forest-dark hover:text-white",
  secondary: "bg-lime text-forest-medium hover:bg-lime-hover hover:text-forest-medium",
  light: "border-text-main/8 bg-surface-soft text-forest-dark hover:bg-surface-soft-hover hover:text-forest-dark",
  danger: "bg-sys-red text-white hover:bg-sys-red-strong hover:text-white",
  "outline-primary": "border-forest-medium bg-transparent text-forest-medium hover:bg-forest-medium hover:text-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "gap-1.5 rounded-md px-3 py-[.35rem] text-xs",
  md: "gap-2 rounded-lg px-5 py-[.6rem] text-sm",
  lg: "gap-2 rounded-xl px-7 py-[.8rem] text-base",
};

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

export const buttonClasses = ({ variant = "primary", size = "md", fullWidth, className }: ButtonStyleOptions) =>
  cn(
    "inline-flex items-center justify-center border border-transparent font-semibold transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-forest-medium/15 enabled:active:scale-[.97]",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className,
  );

interface ButtonContentProps {
  icon?: string;
  iconRight?: string;
  loading?: boolean;
  loadingLabel?: string;
  variant?: ButtonVariant;
  children: ReactNode;
}

function ButtonContent({ icon, iconRight, loading, loadingLabel = "Procesando…", variant, children }: ButtonContentProps) {
  if (loading) {
    return (
      <>
        <Spinner tone={variant === "light" || variant === "secondary" ? "dark" : "light"} />
        {loadingLabel}
      </>
    );
  }
  return (
    <>
      {icon && <i className={cn("bi", icon)} aria-hidden="true" />}
      {children}
      {iconRight && <i className={cn("bi", iconRight)} aria-hidden="true" />}
    </>
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleOptions {
  icon?: string;
  iconRight?: string;
  loading?: boolean;
  loadingLabel?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  icon,
  iconRight,
  loading,
  loadingLabel,
  disabled,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonClasses({ variant, size, fullWidth, className }), loading ? "opacity-85" : "disabled:opacity-50")}
      {...rest}
    >
      <ButtonContent icon={icon} iconRight={iconRight} loading={loading} loadingLabel={loadingLabel} variant={variant}>
        {children}
      </ButtonContent>
    </button>
  );
}

interface ButtonLinkProps extends ButtonStyleOptions {
  href: string;
  icon?: string;
  iconRight?: string;
  children: ReactNode;
}

export function ButtonLink({ href, variant = "primary", size = "md", fullWidth, className, icon, iconRight, children }: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClasses({ variant, size, fullWidth, className })}>
      <ButtonContent icon={icon} iconRight={iconRight} variant={variant}>
        {children}
      </ButtonContent>
    </Link>
  );
}
