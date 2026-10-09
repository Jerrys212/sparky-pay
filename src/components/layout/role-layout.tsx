import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import type { Role } from "@/types";
import { navigation } from "@/content/mock-data";
import { getSessionUser } from "@/lib/session";
import { AppShell } from "@/components/layout/app-shell";

export async function RoleLayout({ role, children }: { role: Role; children: ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <AppShell user={user} sections={navigation[role]} homeHref={`/${role}`}>
      {children}
    </AppShell>
  );
}

export default RoleLayout;
