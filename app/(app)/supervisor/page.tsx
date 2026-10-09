import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RequestToast } from "@/components/ui/request-toast";
import { RoleHome } from "@/features/home/role-home";
import { getOperations } from "@/features/supervisor/get-operations";
import { getSessionUser } from "@/lib/session";
import { homeContent, homeStats, toastMessages } from "@/content/copy";

export const metadata: Metadata = { title: "Inicio" };

export default async function SupervisorHome() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const { ok, rows, total, cancelaciones, devoluciones } = await getOperations();
  const stats = [
    { ...homeStats.supervisor.cancelaciones, value: String(cancelaciones) },
    { ...homeStats.supervisor.devoluciones, value: String(devoluciones) },
  ];
  const items = rows.slice(0, 4).map((op) => ({
    id: op.id,
    icon: op.tipo === "Cancelación" ? "bi-x-circle" : "bi-arrow-counterclockwise",
    titular: op.titular,
    detail: `Aprob. ${op.aprobacion} · ${op.card}`,
    amount: op.amount,
    time: op.hora,
    typeBadge: op.tipo,
    statusBadge: op.estatus,
  }));

  return (
    <>
      <RequestToast {...(ok ? toastMessages.operationsSuccess(total) : toastMessages.operationsError)} />
      <RoleHome role="supervisor" user={user} content={homeContent.supervisor} stats={stats} items={items} />
    </>
  );
}
