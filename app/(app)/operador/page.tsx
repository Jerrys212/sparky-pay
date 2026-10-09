import type { Metadata } from "next";
import { RoleHome } from "@/features/home/role-home";
import { formatMaskedCard, formatMoney, formatTime } from "@/lib/format";
import { homeContent, transactions, users } from "@/content/mock-data";

export const metadata: Metadata = { title: "Inicio" };

export default function OperadorHome() {
  const items = transactions.slice(0, 4).map((t) => ({
    id: t.id,
    icon: "bi-credit-card-2-front",
    titular: t.titular,
    detail: `Aprob. ${t.aprobacion} · ${formatMaskedCard(t.tarjeta)}`,
    amount: formatMoney(t.importe),
    time: formatTime(t.fecha),
  }));

  return <RoleHome role="operador" user={users.operador} content={homeContent.operador} items={items} />;
}
