"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useSidebar } from "@/components/layout/sidebar-context";

export function ShellMain({ navbar, footer, children }: { navbar: ReactNode; footer: ReactNode; children: ReactNode }) {
  const { minimized } = useSidebar();
  return (
    <main
      className={cn(
        "flex min-h-screen flex-col p-6 transition-[margin-left] duration-300 ease-smooth xl:px-10 xl:py-8",
        minimized ? "xl:ml-sidebar-min" : "xl:ml-sidebar",
      )}
    >
      {navbar}
      <div className="flex-1 pb-8">{children}</div>
      {footer}
    </main>
  );
}

export default ShellMain;
