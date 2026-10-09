"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface SidebarContextValue {
  minimized: boolean;
  mobileOpen: boolean;
  toggleMinimized: () => void;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [minimized, setMinimized] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const value = useMemo(
    () => ({ minimized, mobileOpen, toggleMinimized: () => setMinimized((v) => !v), setMobileOpen }),
    [minimized, mobileOpen],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar debe usarse dentro de SidebarProvider");
  return ctx;
}
