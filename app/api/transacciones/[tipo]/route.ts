import { NextResponse } from "next/server";
import { z } from "zod";
import { backendFetch } from "@/lib/api";
import { getSessionRole } from "@/lib/session";
import { ReversalSchema } from "@/features/reversal/schema";

const ReversalResponse = z.object({
  codigo: z.number(),
  mensaje: z.string(),
  data: z
    .object({
      numeroAprobacion: z.union([z.string(), z.number()]).transform(String),
      referenciaFinanciera: z.union([z.string(), z.number()]).transform(String),
      tarjeta: z.string(),
      tipo: z.string(),
      estatus: z.string(),
      fecha: z.string(),
    })
    .optional(),
});

const VALID_TIPOS = new Set(["cancelacion", "devolucion"]);

export async function PATCH(request: Request, { params }: { params: Promise<{ tipo: string }> }) {
  const { tipo } = await params;
  if (!VALID_TIPOS.has(tipo)) {
    return NextResponse.json({ ok: false, mensaje: "Operación no válida" }, { status: 404 });
  }
  if (!(await getSessionRole())) {
    return NextResponse.json({ ok: false, mensaje: "Sesión no válida" }, { status: 401 });
  }

  const input = await request.json().catch(() => null);
  const parsed = ReversalSchema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  let result;
  try {
    result = await backendFetch(`/transacciones/${tipo}`, {
      method: "PATCH",
      body: JSON.stringify(parsed.data),
    });
  } catch {
    return NextResponse.json(
      { ok: false, mensaje: "No pudimos conectar con el servidor. Inténtalo de nuevo." },
      { status: 502 },
    );
  }

  const backend = ReversalResponse.safeParse(result.body);
  if (!backend.success || result.status !== 200 || !backend.data.data) {
    const mensaje =
      backend.success && backend.data.mensaje
        ? backend.data.mensaje
        : "No se encontró una venta con esa referencia.";
    return NextResponse.json({ ok: false, mensaje }, { status: 400 });
  }

  return NextResponse.json({ ok: true, mensaje: backend.data.mensaje, data: backend.data.data }, { status: 200 });
}
