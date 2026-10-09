import type { Metadata } from "next";
import { AuthShell } from "@/components/layout/auth-shell";
import { RequestToast } from "@/components/ui/request-toast";
import { LoginForm } from "@/features/auth/login-form";
import { toastMessages } from "@/content/copy";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ sesion?: string }> }) {
  const { sesion } = await searchParams;
  return (
    <AuthShell>
      {sesion === "cerrada" && <RequestToast {...toastMessages.logoutSuccess} clearQuery />}
      <LoginForm
        demoAccess={[
          { role: "operador", username: "operador", password: "Operador123" },
          { role: "supervisor", username: "supervisor", password: "Supervisor123" },
        ]}
      />
    </AuthShell>
  );
}
