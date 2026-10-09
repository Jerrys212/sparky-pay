"use client";

import Link from "next/link";
import type { Role } from "@/types";
import { roleLabels } from "@/lib/mock-data";
import { cn } from "@/lib/cn";
import { Input } from "./Input";

interface DemoAccess {
  role: Role;
  href: string;
}

export function LoginForm({ demoAccess }: { demoAccess: DemoAccess[] }) {
  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-[1.35rem]">Bienvenido</h1>
        <p className="mt-[.35rem] text-sm text-muted-green">Inicia sesión para acceder a tu terminal</p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()} noValidate>
        <Input
          id="login-user"
          label="Usuario"
          icon="bi-person"
          tone="auth"
          placeholder="Ingresa tu usuario"
          autoComplete="username"
        />
        <Input
          id="login-pass"
          label="Contraseña"
          icon="bi-shield-lock"
          tone="auth"
          placeholder="••••••••"
          autoComplete="current-password"
          revealable
          revealLabels={["Mostrar contraseña", "Ocultar contraseña"]}
        />
        <button
          type="submit"
          className="group inline-flex w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-forest-medium p-[.85rem] text-[.925rem] font-bold text-white transition-all duration-200 hover:-translate-y-px hover:bg-forest-dark hover:shadow-glow focus-visible:ring-3 focus-visible:ring-forest-medium/15 focus-visible:outline-none active:scale-[.97]"
        >
          Iniciar sesión
          <i className="bi bi-arrow-right transition-transform duration-200 group-hover:translate-x-[3px]" aria-hidden="true" />
        </button>
      </form>

      <div className="my-7 flex items-center gap-3 text-[.7rem] font-bold tracking-[.08em] text-muted-green uppercase">
        <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
        Acceso de demostración
        <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {demoAccess.map(({ role, href }) => {
          const meta = roleLabels[role];
          return (
            <Link
              key={role}
              href={href}
              className="flex flex-col items-center gap-[.15rem] rounded-lg border border-border-light bg-card p-3 text-center text-[.85rem] font-semibold text-text-main transition-all duration-200 hover:border-forest-medium hover:bg-surface-soft hover:text-text-main"
            >
              <span className="flex items-center gap-[.4rem]">
                <i className={cn("bi text-forest-medium", meta.icon)} aria-hidden="true" />
                {meta.label}
              </span>
              <span className="text-[.7rem] font-medium text-muted-green">{meta.permissions}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export default LoginForm;
