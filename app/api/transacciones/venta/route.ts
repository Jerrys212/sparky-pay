import { NextResponse } from "next/server";
import { z } from "zod";
import { backendFetch } from "@/lib/api";
import { aesEncrypt, createTransportDecrypter } from "@/lib/crypto";
import { getSessionRole } from "@/lib/session";
import { EncryptedCardSchema } from "@/lib/transport";
import { VentaSchema } from "@/features/venta/schema";

const VentaRequest = EncryptedCardSchema.extend({ importe: z.string(), nombreTitular: z.string() });

const VentaResponse = z.object({
  codigo: z.number(),
  mensaje: z.string(),
  data: z
    .object({
      numeroAprobacion: z.union([z.string(), z.number()]).transform(String),
      referenciaFinanciera: z.union([z.string(), z.number()]).transform(String),
      tarjeta: z.string(),
      importe: z.number(),
      nombreTitular: z.string(),
      estatus: z.string(),
      fecha: z.string(),
    })
    .optional(),
});

export async function POST(request: Request) {
  const role = await getSessionRole();
  if (!role) {
    return NextResponse.json({ ok: false, mensaje: "Sesión no válida" }, { status: 401 });
  }
  if (role !== "operador") {
    return NextResponse.json({ ok: false, mensaje: "Tu rol no tiene permiso para realizar ventas." }, { status: 403 });
  }

  const envelope = VentaRequest.safeParse(await request.json().catch(() => null));
  if (!envelope.success) {
    return NextResponse.json({ ok: false, mensaje: "Los datos de la tarjeta deben enviarse cifrados." }, { status: 400 });
  }

  let input;
  try {
    const decrypt = createTransportDecrypter(envelope.data.llavePublica);
    input = {
      importe: envelope.data.importe,
      nombreTitular: envelope.data.nombreTitular,
      numeroTarjeta: decrypt(envelope.data.numeroTarjeta),
      fechaExpiracion: decrypt(envelope.data.fechaExpiracion),
      cvv: decrypt(envelope.data.cvv),
    };
  } catch {
    return NextResponse.json({ ok: false, mensaje: "No pudimos descifrar los datos de la tarjeta." }, { status: 400 });
  }

  const parsed = VentaSchema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { importe, nombreTitular, numeroTarjeta, fechaExpiracion, cvv } = parsed.data;
  const payload = {
    importe: Number(importe),
    nombreTitular,
    numeroTarjeta: aesEncrypt(numeroTarjeta),
    fechaExpiracion: aesEncrypt(fechaExpiracion),
    cvv: aesEncrypt(cvv),
  };

  let result;
  try {
    result = await backendFetch("/transacciones/venta", { method: "POST", body: JSON.stringify(payload) });
  } catch {
    return NextResponse.json(
      { ok: false, mensaje: "No pudimos conectar con el servidor. Inténtalo de nuevo." },
      { status: 502 },
    );
  }

  const backend = VentaResponse.safeParse(result.body);
  if (!backend.success || result.status !== 200 || !backend.data.data) {
    const mensaje =
      backend.success && backend.data.mensaje
        ? backend.data.mensaje
        : "No se pudo procesar la venta. Verifica los datos e inténtalo de nuevo.";
    return NextResponse.json({ ok: false, mensaje }, { status: 400 });
  }

  return NextResponse.json({ ok: true, mensaje: backend.data.mensaje, data: backend.data.data }, { status: 200 });
}
