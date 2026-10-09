import Link from "next/link";
import type { HomeContent, Role, TransactionListItem, User } from "@/types";
import { ActionCard } from "./ActionCard";
import { Card } from "./Card";
import { PageHeader } from "./PageHeader";
import { RoleCard } from "./RoleCard";
import { StatCard } from "./StatCard";
import { TodayPill } from "./TodayPill";
import { TransactionItem } from "./TransactionItem";

interface RoleHomeProps {
  role: Role;
  user: User;
  content: HomeContent;
  items: TransactionListItem[];
}

export function RoleHome({ role, user, content, items }: RoleHomeProps) {
  return (
    <>
      <PageHeader
        title={`Hola, ${user.firstName}`}
        subtitle="Estas son las operaciones disponibles para tu rol."
        aside={<TodayPill />}
      />
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <RoleCard role={role} permissions={content.permissions} />
          {content.stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {content.actions.map((action) => (
            <ActionCard key={action.href} {...action} />
          ))}
        </div>
        <Card
          title={content.listTitle}
          action={
            <Link
              href={content.listHref}
              className="inline-flex items-center gap-[.3rem] text-[.85rem] font-bold text-forest-medium hover:text-forest-light"
            >
              Ver todas
              <i className="bi bi-chevron-right text-xs" aria-hidden="true" />
            </Link>
          }
        >
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <TransactionItem key={item.id} {...item} />
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

export default RoleHome;
