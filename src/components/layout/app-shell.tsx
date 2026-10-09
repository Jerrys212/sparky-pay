"use client";

import type { ReactNode } from "react";
import type { NavSection, User } from "@/types";
import { cn } from "@/lib/cn";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { SidebarProvider, useSidebar } from "@/components/layout/sidebar-context";

interface AppShellProps {
  user: User;
  sections: NavSection[];
  homeHref: string;
  children: ReactNode;
}

function Main({ user, children }: { user: User; children: ReactNode }) {
  const { minimized } = useSidebar();
  return (
    <main
      className={cn(
        "flex min-h-screen flex-col p-6 transition-[margin-left] duration-300 ease-smooth xl:px-10 xl:py-8",
        minimized ? "xl:ml-sidebar-min" : "xl:ml-sidebar",
      )}
    >
      <Navbar user={user} />
      <div className="flex-1 pb-8">{children}</div>
      <Footer />
    </main>
  );
}

export function AppShell({ user, sections, homeHref, children }: AppShellProps) {
  return (
    <SidebarProvider>
      <Sidebar sections={sections} user={user} homeHref={homeHref} />
      <Main user={user}>{children}</Main>
    </SidebarProvider>
  );
}

export default AppShell;
