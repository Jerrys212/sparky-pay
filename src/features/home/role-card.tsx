import type { Role } from "@/types";
import { AsteriskShape } from "@/components/ui/asterisk-shape";
import { RoleBadge } from "@/components/ui/badge";

export function RoleCard({ role, permissions }: { role: Role; permissions: string }) {
  return (
    <div className="group relative flex min-h-[165px] flex-col items-start justify-between gap-4 overflow-hidden rounded-xxl bg-forest-medium p-7 text-white shadow-md">
      <RoleBadge role={role} dark />
      <div className="relative z-10">
        <div className="text-xs text-sidebar-muted">Permisos asignados</div>
        <div className="text-[1.15rem] font-bold tracking-[-0.02em]">{permissions}</div>
      </div>
      <AsteriskShape className="absolute -right-5 -bottom-5 size-[120px] rotate-[15deg] transition-transform duration-500 ease-smooth group-hover:scale-105 group-hover:rotate-45" />
    </div>
  );
}

export default RoleCard;
