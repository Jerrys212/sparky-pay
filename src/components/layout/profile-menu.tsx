"use client";

import Link from "next/link";
import type { User } from "@/types";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/ui/badge";
import { Dropdown } from "@/components/ui/dropdown";

export function ProfileMenu({ user, logoutHref }: { user: User; logoutHref: string }) {
  return (
    <Dropdown
      trigger={({ open, toggle, id }) => (
        <button
          type="button"
          onClick={toggle}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? id : undefined}
          aria-label="Menú de perfil"
          className="flex items-center gap-[.65rem] rounded-lg py-[.3rem] pr-[.55rem] pl-[.3rem] text-text-main transition-colors duration-200 hover:bg-canvas"
        >
          <Avatar user={user} />
          <span className="hidden text-sm font-bold whitespace-nowrap md:inline">{user.name}</span>
          <span className="hidden lg:inline-flex">
            <RoleBadge role={user.role} />
          </span>
          <i
            className={cn("bi bi-chevron-down text-[.8rem] text-muted-green transition-transform duration-200", open && "rotate-180")}
            aria-hidden="true"
          />
        </button>
      )}
    >
      <div className="px-3 py-[.65rem]">
        <div className="text-sm font-bold">{user.name}</div>
        <div className="text-xs text-muted-green">Sesión activa</div>
      </div>
      <div className="my-1 h-px bg-border-light" />
      <Link
        role="menuitem"
        href={logoutHref}
        className="flex items-center gap-[.6rem] rounded-md px-3 py-[.65rem] text-sm font-semibold text-sys-red-strong transition-colors duration-200 hover:bg-sys-red-bg hover:text-sys-red-strong"
      >
        <i className="bi bi-box-arrow-right" aria-hidden="true" />
        Cerrar sesión
      </Link>
    </Dropdown>
  );
}

export default ProfileMenu;
