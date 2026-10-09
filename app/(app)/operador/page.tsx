import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RequestToast } from "@/components/ui/request-toast";
import { RoleHome } from "@/features/home/role-home";
import { getTransactions } from "@/features/consultas/get-transactions";
import { formatMoney } from "@/lib/format";
import { getSessionUser } from "@/lib/session";
import { homeContent, homeStats, toastMessages } from "@/content/copy";

export const metadata: Metadata = { title: "Inicio" };

export default async function OperadorHome() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const { ok, rows, total, amount } = await getTransactions();
  const stats = [
    { ...homeStats.operador.count, value: String(total) },
    { ...homeStats.operador.amount, value: formatMoney(amount) },
  ];
  const items = rows.slice(0, 4).map((r) => ({
    id: r.id,
    icon: "bi-credit-card-2-front",
    titular: r.titular,
    detail: `Aprob. ${r.aprobacion} · ${r.card}`,
    amount: r.amount,
    time: r.time,
  }));

  return (
    <>
      <RequestToast {...(ok ? toastMessages.transactionsSuccess(total) : toastMessages.transactionsError)} />
      <RoleHome role="operador" user={user} content={homeContent.operador} stats={stats} items={items} />
    </>
  );
}
