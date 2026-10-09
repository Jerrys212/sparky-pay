"use client";

import { useState } from "react";
import type { TransactionRow } from "@/types";
import { cn } from "@/lib/cn";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { EmptyState } from "./EmptyState";
import { Input } from "./Input";

interface TransactionsTableProps {
  rows: TransactionRow[];
  pageSize: number;
}

const columns = "grid-cols-[130px_140px_130px_minmax(170px,1fr)_200px_130px_130px]";
const cell = "px-5 py-4";

const pagerButton =
  "flex size-[34px] items-center justify-center rounded-md border font-bold transition-all duration-200 disabled:opacity-40";

export function TransactionsTable({ rows, pageSize }: TransactionsTableProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageRows = rows.slice(start, start + pageSize);

  return (
    <div className="overflow-hidden rounded-xl border border-text-main/6 bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-text-main/6 p-5">
        <Input
          type="search"
          aria-label="Buscar transacciones"
          icon="bi-search"
          placeholder="Buscar por referencia, titular o tarjeta…"
          fieldClassName="min-w-[220px] max-w-[320px] flex-1"
          className="py-[.6rem] text-[.85rem]"
        />
        <Button variant="light" icon="bi-arrow-clockwise">
          Actualizar
        </Button>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="Sin transacciones" description="Aún no hay transacciones aprobadas para mostrar." />
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <div role="table" aria-label="Transacciones aprobadas" className="min-w-[920px]">
              <div role="rowgroup">
                <div
                  role="row"
                  className={cn("grid border-b border-text-main/5 bg-surface-soft text-xs font-bold tracking-[.05em] text-muted-green uppercase", columns)}
                >
                  {["Fecha", "No. aprobación", "Referencia", "Titular", "Tarjeta", "Importe", "Estatus"].map((h) => (
                    <div key={h} role="columnheader" className={cn(cell, h === "Importe" && "text-right")}>
                      {h}
                    </div>
                  ))}
                </div>
              </div>
              <div role="rowgroup">
                {pageRows.map((r) => (
                  <div
                    key={r.id}
                    role="row"
                    className={cn(
                      "grid items-center border-b border-text-main/5 text-[.85rem] whitespace-nowrap transition-colors duration-150 hover:bg-lime/4",
                      columns,
                    )}
                  >
                    <div role="cell" className={cell}>
                      <div className="font-semibold">{r.day}</div>
                      <div className="text-xs text-muted-green tabular-nums">{r.time}</div>
                    </div>
                    <div role="cell" className={cn(cell, "font-mono text-[.82rem] font-semibold")}>
                      {r.aprobacion}
                    </div>
                    <div role="cell" className={cn(cell, "font-mono text-[.82rem] font-semibold")}>
                      {r.referencia}
                    </div>
                    <div role="cell" className={cn(cell, "truncate font-semibold")}>
                      {r.titular}
                    </div>
                    <div role="cell" className={cn(cell, "flex items-center gap-2 tabular-nums")}>
                      <i className="bi bi-credit-card-2-front text-muted-green" aria-hidden="true" />
                      {r.card}
                    </div>
                    <div role="cell" className={cn(cell, "text-right font-bold tabular-nums")}>
                      {r.amount}
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
            {pageRows.map((r) => (
              <li key={r.id} className="flex flex-col gap-[.6rem] rounded-lg bg-canvas p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[.9rem] font-bold">{r.titular}</span>
                  <span className="font-extrabold tabular-nums">{r.amount}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-[.4rem] text-xs text-muted-green tabular-nums">
                  <span>
                    Aprob. <strong className="font-mono text-text-main">{r.aprobacion}</strong>
                  </span>
                  <span>
                    Ref. <strong className="font-mono text-text-main">{r.referencia}</strong>
                  </span>
                  <span className="flex items-center gap-[.35rem]">
                    <i className="bi bi-credit-card-2-front" aria-hidden="true" />
                    {r.card}
                  </span>
                  <span>
                    {r.day} · {r.time}
                  </span>
                </div>
                <div>
                  <Badge variant={r.estatus} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-text-main/5 px-5 py-4">
        <span className="text-[.8rem] text-muted-green tabular-nums">
          Mostrando {rows.length ? start + 1 : 0} a {start + pageRows.length} de {rows.length} registros
        </span>
        <nav aria-label="Paginación" className="flex gap-[.35rem]">
          <button
            type="button"
            aria-label="Página anterior"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={cn(pagerButton, "border-border-light bg-card text-text-main enabled:hover:bg-surface-soft")}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`Página ${n}`}
              aria-current={n === page ? "page" : undefined}
              onClick={() => setPage(n)}
              className={cn(
                pagerButton,
                "text-[.85rem]",
                n === page
                  ? "border-forest-medium bg-forest-medium text-white"
                  : "border-border-light bg-card text-text-main hover:bg-surface-soft",
              )}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            aria-label="Página siguiente"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className={cn(pagerButton, "border-border-light bg-card text-text-main enabled:hover:bg-surface-soft")}
          >
            ›
          </button>
        </nav>
      </div>
    </div>
  );
}

export default TransactionsTable;
