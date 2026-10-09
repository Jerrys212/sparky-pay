import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CompactStatCard } from "@/components/StatCard";
import { TransactionsTable } from "@/components/TransactionsTable";
import { formatDay, formatMaskedCard, formatMoney, formatTime } from "@/lib/format";
import { PAGE_SIZE, transactions, transactionsSummary } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Consultas" };

export default function ConsultasPage() {
  const rows = transactions.map((t) => ({
    id: t.id,
    day: formatDay(t.fecha),
    time: formatTime(t.fecha),
    aprobacion: t.aprobacion,
    referencia: t.referencia,
    titular: t.titular,
    card: formatMaskedCard(t.tarjeta),
    amount: formatMoney(t.importe),
    estatus: t.estatus,
  }));

  return (
    <>
      <PageHeader
        title="Consultas"
        subtitle="Transacciones aprobadas de la terminal."
        breadcrumb={{ homeHref: "/operador", current: "Consultas" }}
      />
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {transactionsSummary.map((stat) => (
            <CompactStatCard key={stat.label} {...stat} />
          ))}
        </div>
        <TransactionsTable rows={rows} pageSize={PAGE_SIZE} />
      </div>
    </>
  );
}
