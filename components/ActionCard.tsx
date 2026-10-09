import Link from "next/link";
import type { ActionItem } from "@/types";
import { cn } from "@/lib/cn";

const toneClasses: Record<ActionItem["tone"], string> = {
  lime: "bg-lime-translucent text-forest-medium",
  red: "bg-sys-red-bg text-sys-red",
  orange: "bg-sys-orange-bg text-sys-orange",
};

export function ActionCard({ title, description, href, icon, tone }: ActionItem) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-start gap-[.35rem] rounded-xxl bg-card p-7 text-text-main shadow-md transition-all duration-300 ease-smooth hover:-translate-y-[3px] hover:text-text-main hover:shadow-lg"
    >
      <span className={cn("mb-4 flex size-[52px] items-center justify-center rounded-lg", toneClasses[tone])}>
        <i className={cn("bi text-[1.4rem]", icon)} aria-hidden="true" />
      </span>
      <span className="text-[1.1rem] font-bold tracking-[-0.02em]">{title}</span>
      <span className="text-[.85rem] text-muted-green">{description}</span>
      <span className="mt-5 inline-flex items-center gap-[.4rem] text-[.85rem] font-bold text-forest-medium">
        Ir ahora
        <i className="bi bi-arrow-right transition-transform duration-200 group-hover:translate-x-[3px]" aria-hidden="true" />
      </span>
    </Link>
  );
}

export default ActionCard;
