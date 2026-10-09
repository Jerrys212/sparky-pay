import { RoleLayout } from "@/components/layout/role-layout";

export default function OperadorLayout({ children }: { children: React.ReactNode }) {
  return <RoleLayout role="operador">{children}</RoleLayout>;
}
