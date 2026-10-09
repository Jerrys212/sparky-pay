import type { TransactionListItem } from "@/types";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";

export function TransactionItem({ icon, titular, detail, amount, time, typeBadge, statusBadge }: TransactionListItem) {
  return (
    <li className="flex items-center gap-4 rounded-lg bg-canvas px-4 py-[.85rem] transition-colors duration-200 hover:bg-forest-dark/6">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-forest-dark">
        <i className={cn("bi text-[1.05rem] text-lime", icon)} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold">{titular}</span>
          {typeBadge && <Badge variant={typeBadge} size="sm" />}
          {statusBadge && <Badge variant={statusBadge} size="sm" />}
        </div>
        <div className="truncate text-xs text-muted-green tabular-nums">{detail}</div>
      </div>
      <div className="shrink-0 text-right">
        <div className="font-bold tabular-nums">{amount}</div>
        <div className="text-xs text-muted-green tabular-nums">{time}</div>
      </div>
    </li>
  );
}

export default TransactionItem;
