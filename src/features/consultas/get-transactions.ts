import { z } from "zod";
import type { TransactionRow } from "@/types";
import { backendFetch } from "@/lib/api";
import { formatDay, formatMaskedCard, formatMoney, formatTime } from "@/lib/format";

const TransactionItem = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  numeroAprobacion: z.union([z.string(), z.number()]).transform(String),
  referenciaFinanciera: z.union([z.string(), z.number()]).transform(String),
  tarjeta: z.string(),
  nombreTitular: z.string(),
  importe: z.number(),
  tipo: z.string(),
  estatus: z.string(),
  fecha: z.string(),
});

const TransactionsResponse = z.object({
  codigo: z.number(),
  mensaje: z.string(),
  total: z.number().optional(),
  data: z.array(TransactionItem),
});

export interface TransactionsResult {
  ok: boolean;
  rows: TransactionRow[];
  total: number;
  amount: number;
}

export async function getTransactions(): Promise<TransactionsResult> {
  let result;
  try {
    result = await backendFetch("/transacciones", { method: "GET" });
  } catch {
    return { ok: false, rows: [], total: 0, amount: 0 };
  }

  const parsed = TransactionsResponse.safeParse(result.body);
  if (!parsed.success || result.status !== 200) {
    return { ok: false, rows: [], total: 0, amount: 0 };
  }

  const rows: TransactionRow[] = parsed.data.data.map((t) => ({
    id: t.id,
    day: formatDay(t.fecha),
    time: formatTime(t.fecha),
    aprobacion: t.numeroAprobacion,
    referencia: t.referenciaFinanciera,
    titular: t.nombreTitular,
    card: formatMaskedCard(t.tarjeta),
    amount: formatMoney(t.importe),
    estatus: "Aprobada",
  }));

  const amount = parsed.data.data.reduce((sum, t) => sum + t.importe, 0);
  return { ok: true, rows, total: parsed.data.total ?? rows.length, amount };
}
