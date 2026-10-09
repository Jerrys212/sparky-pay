import type { ReactNode } from "react";
import type { Role } from "@/types";
import { navigation, users } from "@/lib/mock-data";
import { AppShell } from "./AppShell";

export function RoleLayout({ role, children }: { role: Role; children: ReactNode }) {
  return (
    <AppShell user={users[role]} sections={navigation[role]} homeHref={`/${role}`}>
      {children}
    </AppShell>
  );
}

export default RoleLayout;
