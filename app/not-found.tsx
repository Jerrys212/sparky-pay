import type { Metadata } from "next";
import { AuthShell } from "@/components/layout/auth-shell";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Página no encontrada" };

export default function NotFound() {
  return (
    <AuthShell>
      <div className="flex flex-col items-center text-center">
        <div aria-label="404" className="flex items-center gap-2 text-[7.5rem] leading-none font-extrabold tracking-[-0.04em] text-forest-dark">
          4
          <i className="bi bi-asterisk inline-block animate-asterisk-20 text-[5.5rem] text-lime" aria-hidden="true" />
          4
        </div>
        <h1 className="mt-6 text-[1.75rem]">Página no encontrada</h1>
        <p className="mt-2 mb-8 text-[.9rem] text-muted-green">La página que buscas no existe o fue movida.</p>
        <ButtonLink href="/login" icon="bi-house">
          Volver al inicio
        </ButtonLink>
      </div>
    </AuthShell>
  );
}
