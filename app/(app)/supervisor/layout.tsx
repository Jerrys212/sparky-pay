import { RoleLayout } from "@/components/layout/role-layout";

export default function SupervisorLayout({ children }: { children: React.ReactNode }) {
  return <RoleLayout role="supervisor">{children}</RoleLayout>;
}
