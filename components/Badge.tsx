import type { BadgeVariant, Role } from "@/types";
import { cn } from "@/lib/cn";
import { roleLabels } from "@/lib/mock-data";

const variantClasses: Record<BadgeVariant, { pill: string; dot: string }> = {
  Aprobada: { pill: "bg-sys-green/10 text-sys-green-text", dot: "bg-sys-green" },
  Aplicado: { pill: "bg-sys-green/10 text-sys-green-text", dot: "bg-sys-green" },
  Pendiente: { pill: "bg-sys-orange/10 text-sys-orange-text", dot: "bg-sys-orange" },
  Rechazada: { pill: "bg-sys-red/10 text-sys-red-text", dot: "bg-sys-red" },
  Venta: { pill: "bg-forest-medium/8 text-forest-medium", dot: "bg-forest-medium" },
  Cancelación: { pill: "bg-sys-red/10 text-sys-red-text", dot: "bg-sys-red" },
  Devolución: { pill: "bg-sys-orange/10 text-sys-orange-text", dot: "bg-sys-orange" },
};

interface BadgeProps {
  variant: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
}

export function Badge({ variant, size = "md", className }: BadgeProps) {
  const styles = variantClasses[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-bold whitespace-nowrap",
        size === "md" ? "px-[.65rem] py-1 text-xs" : "px-[.55rem] py-[.15rem] text-[.7rem]",
        styles.pill,
        className,
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", styles.dot)} />
      {variant}
    </span>
  );
}

interface RoleBadgeProps {
  role: Role;
  dark?: boolean;
  size?: "sm" | "md";
}

export function RoleBadge({ role, dark, size = "md" }: RoleBadgeProps) {
  const { label, icon } = roleLabels[role];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[.35rem] rounded-full font-bold whitespace-nowrap",
        size === "md" ? "px-[.65rem] py-1 text-xs" : "px-[.6rem] py-[.2rem] text-[.7rem]",
        dark ? "bg-lime/12 text-lime" : "bg-lime-translucent text-forest-medium",
      )}
    >
      <i className={cn("bi", icon)} aria-hidden="true" />
      {label}
    </span>
  );
}

export default Badge;
