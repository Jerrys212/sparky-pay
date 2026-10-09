import type { BadgeVariant } from "@/types";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export interface OperationRow {
  id: string;
  tipo: BadgeVariant;
  titular: string;
  aprobacion: string;
  card: string;
  amount: string;
  hora: string;
  estatus: BadgeVariant;
}

const columns = "grid-cols-[150px_minmax(160px,1fr)_140px_190px_130px_110px_130px]";
const cell = "px-5 py-4";

export function OperationsTable({ rows }: { rows: OperationRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-text-main/6 bg-card shadow-sm">
      {rows.length === 0 ? (
        <EmptyState title="Sin operaciones" description="Aún no hay cancelaciones ni devoluciones para mostrar." />
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <div role="table" aria-label="Operaciones aplicadas" className="min-w-[920px]">
              <div role="rowgroup">
                <div
                  role="row"
                  className={cn("grid border-b border-text-main/5 bg-surface-soft text-xs font-bold tracking-[.05em] text-muted-green uppercase", columns)}
                >
                  {["Tipo", "Titular", "No. aprobación", "Tarjeta", "Importe", "Hora", "Estatus"].map((h) => (
                    <div key={h} role="columnheader" className={cn(cell, h === "Importe" && "text-right")}>
                      {h}
                    </div>
                  ))}
                </div>
              </div>
              <div role="rowgroup">
                {rows.map((r) => (
                  <div
                    key={r.id}
                    role="row"
                    className={cn(
                      "grid items-center border-b border-text-main/5 text-[.85rem] whitespace-nowrap transition-colors duration-150 hover:bg-lime/4",
                      columns,
                    )}
                  >
                    <div role="cell" className={cell}>
                      <Badge variant={r.tipo} />
                    </div>
                    <div role="cell" className={cn(cell, "truncate font-semibold")}>
                      {r.titular}
                    </div>
                    <div role="cell" className={cn(cell, "font-mono text-[.82rem] font-semibold")}>
                      {r.aprobacion}
                    </div>
                    <div role="cell" className={cn(cell, "flex items-center gap-2 tabular-nums")}>
                      <i className="bi bi-credit-card-2-front text-muted-green" aria-hidden="true" />
                      {r.card}
                    </div>
                    <div role="cell" className={cn(cell, "text-right font-bold tabular-nums")}>
                      {r.amount}
                    </div>
                    <div role="cell" className={cn(cell, "text-muted-green tabular-nums")}>
                      {r.hora}
                    </div>
                    <div role="cell" className={cell}>
                      <Badge variant={r.estatus} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <ul className="flex flex-col gap-3 p-4 md:hidden">
            {rows.map((r) => (
              <li key={r.id} className="flex flex-col gap-[.6rem] rounded-lg bg-canvas p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[.9rem] font-bold">{r.titular}</span>
                  <span className="font-extrabold tabular-nums">{r.amount}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-[.4rem] text-xs text-muted-green tabular-nums">
                  <span>
                    Aprob. <strong className="font-mono text-text-main">{r.aprobacion}</strong>
                  </span>
                  <span>{r.hora}</span>
                  <span className="flex items-center gap-[.35rem]">
                    <i className="bi bi-credit-card-2-front" aria-hidden="true" />
                    {r.card}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Badge variant={r.tipo} />
                  <Badge variant={r.estatus} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-text-main/5 px-5 py-4">
        <span className="text-[.8rem] text-muted-green tabular-nums">
          {rows.length} {rows.length === 1 ? "operación" : "operaciones"}
        </span>
      </div>
    </div>
  );
}

export default OperationsTable;
