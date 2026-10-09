import type { StatItem } from "@/types";
import { cn } from "@/lib/cn";

export function StatCard({ label, icon, value, suffix, note, trend }: StatItem) {
  return (
    <div className="flex flex-col justify-between gap-3 rounded-xxl bg-card p-7 shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-[.85rem] font-semibold text-muted-green">{label}</span>
        <span className="flex size-9 items-center justify-center rounded-md bg-canvas text-forest-medium">
          <i className={cn("bi", icon)} aria-hidden="true" />
        </span>
      </div>
      <div className="flex items-baseline gap-[.4rem]">
        <span className="text-[2rem] leading-[1.1] font-extrabold tracking-[-0.03em] tabular-nums">{value}</span>
        {suffix && <span className="text-[.8rem] font-bold text-muted-green">{suffix}</span>}
      </div>
      <div className={cn("flex items-center gap-[.3rem] text-[.8rem] font-semibold", trend === "up" ? "text-sys-green-text" : "text-muted-green")}>
        {trend === "up" && <i className="bi bi-arrow-up-right" aria-hidden="true" />}
        {note}
      </div>
    </div>
  );
}

export function CompactStatCard({ label, icon, value }: Pick<StatItem, "label" | "icon" | "value">) {
  return (
    <div className="flex items-center gap-4 rounded-xxl bg-card p-5 shadow-md">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-lime-translucent text-[1.15rem] text-forest-medium">
        <i className={cn("bi", icon)} aria-hidden="true" />
      </span>
      <div>
        <div className="text-[.8rem] font-semibold text-muted-green">{label}</div>
        <div className="text-[1.35rem] font-extrabold tracking-[-0.02em] tabular-nums">{value}</div>
      </div>
    </div>
  );
}

export default StatCard;
