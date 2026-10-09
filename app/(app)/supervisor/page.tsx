import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RoleHome } from "@/features/home/role-home";
import { formatMaskedCard, formatMoney } from "@/lib/format";
import { getSessionUser } from "@/lib/session";
import { homeContent, supervisorOperations } from "@/content/mock-data";

export const metadata: Metadata = { title: "Inicio" };

export default async function SupervisorHome() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const items = supervisorOperations.slice(0, 4).map((op) => ({
    id: op.id,
    icon: op.tipo === "Cancelación" ? "bi-x-circle" : "bi-arrow-counterclockwise",
    titular: op.titular,
    detail: `Aprob. ${op.aprobacion} · ${formatMaskedCard(op.tarjeta)}`,
    amount: formatMoney(op.importe),
    time: op.hora,
    typeBadge: op.tipo,
    statusBadge: op.estatus,
  }));

  return <RoleHome role="supervisor" user={user} content={homeContent.supervisor} items={items} />;
}
