import type { Metadata } from "next";
import { AuthShell } from "@/components/layout/auth-shell";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  return (
    <AuthShell>
      <LoginForm
        demoAccess={[
          { role: "operador", username: "operador", password: "Operador123" },
          { role: "supervisor", username: "supervisor", password: "Supervisor123" },
        ]}
      />
    </AuthShell>
  );
}
