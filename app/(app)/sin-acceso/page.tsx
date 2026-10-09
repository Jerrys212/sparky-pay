import type { Metadata } from "next";
import { AuthShell } from "@/components/layout/auth-shell";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Sin acceso" };

export default function NoAccessPage() {
  return (
    <AuthShell>
      <div className="flex flex-col items-center text-center">
        <span className="mb-6 flex size-20 items-center justify-center rounded-full bg-sys-red-bg">
          <i className="bi bi-shield-x text-[2.2rem] text-sys-red" aria-hidden="true" />
        </span>
        <h1 className="text-2xl text-balance">No tienes acceso a esta sección</h1>
        <p className="mt-3 mb-8 max-w-[380px] text-[.9rem] text-pretty text-muted-green">
          Tu rol no tiene permisos para ver esta página. Si crees que es un error, contacta a tu supervisor.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href="/login" variant="light">
            Cerrar sesión
          </ButtonLink>
          <ButtonLink href="/operador" icon="bi-house">
            Ir a mi inicio
          </ButtonLink>
        </div>
      </div>
    </AuthShell>
  );
}
