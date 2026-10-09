import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { CompactStatCard } from "@/components/ui/stat-card";
import { RequestToast } from "@/components/ui/request-toast";
import { TransactionsTable } from "@/features/consultas/transactions-table";
import { getTransactions } from "@/features/consultas/get-transactions";
import { formatMoney } from "@/lib/format";
import { PAGE_SIZE, toastMessages } from "@/content/copy";

export const metadata: Metadata = { title: "Consultas" };

export default async function ConsultasPage() {
  const { ok, rows, total, amount } = await getTransactions();
  const average = rows.length ? amount / rows.length : 0;

  const summary = [
    { label: "Transacciones", value: String(total), icon: "bi-receipt" },
    { label: "Monto total", value: formatMoney(amount), icon: "bi-cash-stack" },
    { label: "Ticket promedio", value: formatMoney(average), icon: "bi-graph-up" },
  ];

  return (
    <>
      <RequestToast {...(ok ? toastMessages.transactionsSuccess(total) : toastMessages.transactionsError)} />
      <PageHeader
        title="Consultas"
        subtitle="Transacciones aprobadas de la terminal."
        breadcrumb={{ homeHref: "/operador", current: "Consultas" }}
      />
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {summary.map((stat) => (
            <CompactStatCard key={stat.label} {...stat} />
          ))}
        </div>
        <TransactionsTable rows={rows} pageSize={PAGE_SIZE} />
      </div>
    </>
  );
}
