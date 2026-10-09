import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { OperationsTable } from "@/features/supervisor/operations-table";
import { formatMaskedCard, formatMoney } from "@/lib/format";
import { supervisorOperations } from "@/content/mock-data";

export const metadata: Metadata = { title: "Operaciones" };

export default function OperacionesPage() {
  const rows = supervisorOperations.map((op) => ({
    id: op.id,
    tipo: op.tipo,
    titular: op.titular,
    aprobacion: op.aprobacion,
    card: formatMaskedCard(op.tarjeta),
    amount: formatMoney(op.importe),
    hora: op.hora,
    estatus: op.estatus,
  }));

  return (
    <>
      <PageHeader
        title="Operaciones"
        subtitle="Cancelaciones y devoluciones aplicadas."
        breadcrumb={{ homeHref: "/supervisor", current: "Operaciones" }}
      />
      <OperationsTable rows={rows} />
    </>
  );
}
