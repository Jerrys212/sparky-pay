import type { Metadata } from "next";
import { AuthShell } from "@/components/AuthShell";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  return (
    <AuthShell>
      <LoginForm
        demoAccess={[
          { role: "operador", href: "/operador" },
          { role: "supervisor", href: "/supervisor" },
        ]}
      />
    </AuthShell>
  );
}
