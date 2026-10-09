import type { ReactNode } from "react";
import type { NavSection, User } from "@/types";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ShellMain } from "@/components/layout/shell-main";
import { Sidebar } from "@/components/layout/sidebar";
import { SidebarProvider } from "@/components/layout/sidebar-context";

interface AppShellProps {
  user: User;
  sections: NavSection[];
  homeHref: string;
  children: ReactNode;
}

export function AppShell({ user, sections, homeHref, children }: AppShellProps) {
  return (
    <SidebarProvider>
      <Sidebar sections={sections} user={user} homeHref={homeHref} />
      <ShellMain navbar={<Navbar user={user} />} footer={<Footer />}>
        {children}
      </ShellMain>
    </SidebarProvider>
  );
}

export default AppShell;
