"use client";

import { cn } from "@/lib/cn";
import { useSidebar } from "@/components/layout/sidebar-context";

const squareButton =
  "flex size-[42px] items-center justify-center rounded-lg border border-border-light bg-card text-text-main shadow-sm transition-all duration-200 hover:bg-border-light hover:text-forest-medium";

export function SidebarToggle() {
  const { minimized, toggleMinimized, mobileOpen, setMobileOpen } = useSidebar();

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={toggleMinimized}
        aria-label={minimized ? "Expandir menú" : "Minimizar menú"}
        aria-controls="app-sidebar"
        aria-expanded={!minimized}
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
  );
}

export default SidebarToggle;
