import type { Metadata } from "next";
import { RoleHome } from "@/components/RoleHome";
import { formatMaskedCard, formatMoney } from "@/lib/format";
import { homeContent, supervisorOperations, users } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Inicio" };

export default function SupervisorHome() {
  const items = supervisorOperations.map((op) => ({
    id: op.id,
    icon: op.tipo === "Cancelación" ? "bi-x-circle" : "bi-arrow-counterclockwise",
    titular: op.titular,
    detail: `Aprob. ${op.aprobacion} · ${formatMaskedCard(op.tarjeta)}`,
    amount: formatMoney(op.importe),
    time: op.hora,
    typeBadge: op.tipo,
    statusBadge: op.estatus,
  }));

  return <RoleHome role="supervisor" user={users.supervisor} content={homeContent.supervisor} items={items} />;
}
