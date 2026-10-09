import Link from "next/link";
import { cn } from "@/lib/cn";

export interface TabItem {
  label: string;
  href: string;
  icon?: string;
  active: boolean;
}

export function Tabs({ items, label }: { items: TabItem[]; label: string }) {
  return (
    <nav aria-label={label} className="inline-flex gap-1 self-start rounded-lg bg-surface-soft-hover p-1">
      {items.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={tab.active ? "page" : undefined}
          className={cn(
            "inline-flex items-center gap-[.45rem] rounded-md px-4 py-2 text-[.85rem] transition-all duration-200 hover:text-text-main",
            tab.active ? "bg-card font-bold text-text-main shadow-tab" : "font-semibold text-muted-green",
          )}
        >
          {tab.icon && <i className={cn("bi", tab.icon)} aria-hidden="true" />}
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

export default Tabs;
