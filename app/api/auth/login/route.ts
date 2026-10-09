import { NextResponse } from "next/server";
import { z } from "zod";
import { backendFetch } from "@/lib/api";
import { AUTH_COOKIE, normalizeRole } from "@/lib/auth";
import { LoginSchema } from "@/features/auth/schema";

const BackendLoginResponse = z.object({
  codigo: z.number(),
  mensaje: z.string(),
  data: z
    .object({
      token: z.string(),
      usuario: z.object({ nombre: z.string(), rol: z.string() }),
    })
    .optional(),
});

const COOKIE_MAX_AGE = 60 * 60 * 8;

export async function POST(request: Request) {
  const input = await request.json().catch(() => null);
  const parsed = LoginSchema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  let result;
  try {
    result = await backendFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });
  } catch {
    return NextResponse.json(
      { ok: false, mensaje: "No pudimos conectar con el servidor. Inténtalo de nuevo." },
      { status: 502 },
    );
  }

  const backend = BackendLoginResponse.safeParse(result.body);
  if (!backend.success || result.status !== 200 || !backend.data.data) {
    const mensaje =
      backend.success && backend.data.mensaje
        ? backend.data.mensaje
        : "Usuario o contraseña incorrectos";
    return NextResponse.json({ ok: false, mensaje }, { status: 400 });
  }

  const { token, usuario } = backend.data.data;
  const rol = normalizeRole(usuario.rol);
  if (!rol) {
    return NextResponse.json({ ok: false, mensaje: "Rol no reconocido" }, { status: 400 });
  }

  const response = NextResponse.json(
    { ok: true, rol, nombre: usuario.nombre, mensaje: backend.data.mensaje },
    { status: 200 },
  );
  response.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return response;
}
