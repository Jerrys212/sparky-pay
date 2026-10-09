"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Role } from "@/types";
import { roleLabels } from "@/content/copy";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { LoginSchema, type LoginInput } from "@/features/auth/schema";

interface DemoAccess {
  role: Role;
  username: string;
  password: string;
}

export function LoginForm({ demoAccess }: { demoAccess: DemoAccess[] }) {
  const router = useRouter();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { username: "", password: "" },
  });

  const submit = handleSubmit(async (values) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        toast.show({ variant: "success", title: "Sesión iniciada", message: `Bienvenido, ${data.nombre}.` });
        router.replace(`/${data.rol}`);
        router.refresh();
        return;
      }

      if (data.errors) {
        if (data.errors.username?.[0]) setError("username", { message: data.errors.username[0] });
        if (data.errors.password?.[0]) setError("password", { message: data.errors.password[0] });
        return;
      }

      toast.show({
        variant: "error",
        title: "No se pudo iniciar sesión",
        message: data.mensaje ?? "Inténtalo de nuevo en unos minutos.",
      });
    } catch {
      toast.show({
        variant: "error",
        title: "Error de conexión",
        message: "No pudimos conectar con el servidor. Inténtalo de nuevo.",
      });
    }
  });

  const loginAs = (demo: DemoAccess) => {
    setValue("username", demo.username);
    setValue("password", demo.password);
    void submit();
  };

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-[1.35rem]">Bienvenido</h1>
        <p className="mt-[.35rem] text-sm text-muted-green">Inicia sesión para acceder a tu terminal</p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={submit} noValidate>
        <Input
          id="login-user"
          label="Usuario"
          icon="bi-person"
          tone="auth"
          placeholder="Ingresa tu usuario"
          autoComplete="username"
          error={errors.username?.message}
          {...register("username")}
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
          error={errors.password?.message}
          {...register("password")}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-forest-medium p-[.85rem] text-[.925rem] font-bold text-white transition-all duration-200 hover:-translate-y-px hover:bg-forest-dark hover:shadow-glow focus-visible:ring-3 focus-visible:ring-forest-medium/15 focus-visible:outline-none active:scale-[.97] disabled:pointer-events-none disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <i className="bi bi-asterisk animate-spinner" aria-hidden="true" />
              Iniciando sesión…
            </>
          ) : (
            <>
              Iniciar sesión
              <i className="bi bi-arrow-right transition-transform duration-200 group-hover:translate-x-[3px]" aria-hidden="true" />
            </>
          )}
        </button>
      </form>

      <div className="my-7 flex items-center gap-3 text-[.7rem] font-bold tracking-[.08em] text-muted-green uppercase">
        <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
        Acceso de demostración
        <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {demoAccess.map((demo) => {
          const meta = roleLabels[demo.role];
          return (
            <button
              key={demo.role}
              type="button"
              onClick={() => loginAs(demo)}
              disabled={isSubmitting}
              className="flex flex-col items-center gap-[.15rem] rounded-lg border border-border-light bg-card p-3 text-center text-[.85rem] font-semibold text-text-main transition-all duration-200 hover:border-forest-medium hover:bg-surface-soft disabled:pointer-events-none disabled:opacity-70"
            >
              <span className="flex items-center gap-[.4rem]">
                <i className={cn("bi text-forest-medium", meta.icon)} aria-hidden="true" />
                {meta.label}
              </span>
              <span className="text-[.7rem] font-medium text-muted-green">{meta.permissions}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

export default LoginForm;
