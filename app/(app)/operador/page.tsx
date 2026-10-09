import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RoleHome } from "@/features/home/role-home";
import { getTransactions } from "@/features/consultas/get-transactions";
import { getSessionUser } from "@/lib/session";
import { homeContent } from "@/content/mock-data";

export const metadata: Metadata = { title: "Inicio" };

export default async function OperadorHome() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const { rows } = await getTransactions();
  const items = rows.slice(0, 4).map((r) => ({
    id: r.id,
    icon: "bi-credit-card-2-front",
    titular: r.titular,
    detail: `Aprob. ${r.aprobacion} · ${r.card}`,
    amount: r.amount,
    time: r.time,
  }));

  return <RoleHome role="operador" user={user} content={homeContent.operador} items={items} />;
}
