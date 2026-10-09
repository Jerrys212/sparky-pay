"use client";

import Link from "next/link";
import type { User } from "@/types";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/ui/badge";
import { Dropdown } from "@/components/ui/dropdown";
import { useSidebar } from "@/components/layout/sidebar-context";

const squareButton =
  "flex size-[42px] items-center justify-center rounded-lg border border-border-light bg-card text-text-main shadow-sm transition-all duration-200 hover:bg-border-light hover:text-forest-medium";

export function Navbar({ user, logoutHref = "/login" }: { user: User; logoutHref?: string }) {
  const { minimized, toggleMinimized, mobileOpen, setMobileOpen } = useSidebar();

  return (
    <header className="sticky top-0 z-[1000] -mx-6 -mt-6 mb-8 flex items-center justify-between gap-4 border-b border-black/5 bg-canvas/85 px-6 py-4 backdrop-blur-[12px] xl:-mx-10 xl:-mt-8 xl:px-10 xl:py-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleMinimized}
          aria-label={minimized ? "Expandir menú" : "Minimizar menú"}
          aria-controls="app-sidebar"
          className={cn(squareButton, "hidden text-[1.1rem] xl:flex")}
        >
          <i className={cn("bi", minimized ? "bi-chevron-bar-right" : "bi-chevron-bar-left")} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
          aria-controls="app-sidebar"
          aria-expanded={mobileOpen}
          className={cn(squareButton, "text-xl xl:hidden")}
        >
          <i className="bi bi-list" aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-[.55rem] rounded-full border border-border-light bg-card px-[.9rem] py-[.45rem] text-[.8rem] font-semibold whitespace-nowrap text-muted-green md:flex">
          <span aria-hidden="true" className="size-[7px] animate-status-pulse rounded-full bg-sys-green" />
          Terminal en línea
        </div>

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
      </div>
    </header>
  );
}

export default Navbar;
