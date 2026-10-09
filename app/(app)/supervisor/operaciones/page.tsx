import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { RequestToast } from "@/components/ui/request-toast";
import { OperationsTable } from "@/features/supervisor/operations-table";
import { getOperations } from "@/features/supervisor/get-operations";
import { toastMessages } from "@/content/copy";

export const metadata: Metadata = { title: "Operaciones" };

export default async function OperacionesPage() {
  const { ok, rows, total } = await getOperations();

  return (
    <>
      <RequestToast {...(ok ? toastMessages.operationsSuccess(total) : toastMessages.operationsError)} />
      <PageHeader
        title="Operaciones"
        subtitle="Cancelaciones y devoluciones aplicadas."
        breadcrumb={{ homeHref: "/supervisor", current: "Operaciones" }}
      />
      <OperationsTable rows={rows} />
    </>
  );
}
