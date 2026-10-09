import { z } from "zod";
import type { OperationRow } from "@/features/supervisor/operations-table";
import { backendFetch } from "@/lib/api";
import { formatDay, formatMaskedCard, formatMoney, formatTime } from "@/lib/format";

const OperationItem = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  numeroAprobacion: z.union([z.string(), z.number()]).transform(String),
  referenciaFinanciera: z.union([z.string(), z.number()]).transform(String),
  tarjeta: z.string(),
  nombreTitular: z.string(),
  importe: z.number(),
  tipo: z.enum(["Cancelación", "Devolución"]),
  estatus: z.literal("Aplicado"),
  fecha: z.string(),
});

const OperationsResponse = z.object({
  codigo: z.number(),
  mensaje: z.string(),
  total: z.number().optional(),
  data: z.array(OperationItem),
});

export interface OperationsResult {
  ok: boolean;
  rows: OperationRow[];
  total: number;
  cancelaciones: number;
  devoluciones: number;
}

const failed: OperationsResult = { ok: false, rows: [], total: 0, cancelaciones: 0, devoluciones: 0 };

export async function getOperations(): Promise<OperationsResult> {
  let result;
  try {
    result = await backendFetch("/transacciones/reversos", { method: "GET" });
  } catch {
    return failed;
  }

  const parsed = OperationsResponse.safeParse(result.body);
  if (!parsed.success || result.status !== 200) return failed;

  const operations = parsed.data.data;
  const rows: OperationRow[] = operations.map((op) => ({
    id: op.id,
    tipo: op.tipo,
    titular: op.nombreTitular,
    aprobacion: op.numeroAprobacion,
    card: formatMaskedCard(op.tarjeta),
    amount: formatMoney(op.importe),
    day: formatDay(op.fecha),
    hora: formatTime(op.fecha),
    estatus: op.estatus,
  }));

  return {
    ok: true,
    rows,
    total: parsed.data.total ?? rows.length,
    cancelaciones: operations.filter((op) => op.tipo === "Cancelación").length,
    devoluciones: operations.filter((op) => op.tipo === "Devolución").length,
  };
}
