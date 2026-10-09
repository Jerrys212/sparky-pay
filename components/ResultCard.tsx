import type { ResultRow } from "@/types";
import { Badge } from "./Badge";
import { Button } from "./Button";

interface ResultCardProps {
  title: string;
  date: string;
  rows: ResultRow[];
  primaryLabel: string;
  onPrimary?: () => void;
  onPrint?: () => void;
}

export function ResultCard({ title, date, rows, primaryLabel, onPrimary, onPrint }: ResultCardProps) {
  return (
    <section
      aria-label={title}
      className="relative animate-result-in overflow-hidden rounded-xxl bg-card p-7 shadow-md"
    >
      <div className="flex flex-col items-center gap-[.3rem] text-center">
        <span className="mb-2 flex size-14 items-center justify-center rounded-full bg-sys-green-bg">
          <i className="bi bi-check-lg text-[1.6rem] text-sys-green" aria-hidden="true" />
        </span>
        <h3 className="text-[1.15rem]">{title}</h3>
        <p className="text-[.8rem] text-muted-green tabular-nums">{date}</p>
      </div>
      <div aria-hidden="true" className="relative -mx-7 mt-6 mb-4 border-t-2 border-dashed border-border-light">
        <span className="absolute -top-2.5 -left-[9px] size-[18px] rounded-full bg-canvas" />
        <span className="absolute -top-2.5 -right-[9px] size-[18px] rounded-full bg-canvas" />
      </div>
      <dl className="flex flex-col">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 border-b border-border-light py-[.7rem] text-[.85rem]">
            <dt className="text-muted-green">{row.label}</dt>
            <dd className="text-right font-bold tabular-nums">{row.badge ? <Badge variant={row.badge} /> : row.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button variant="light" icon="bi-printer" onClick={onPrint}>
          Imprimir
        </Button>
        <Button icon="bi-plus-lg" onClick={onPrimary}>
          {primaryLabel}
        </Button>
      </div>
    </section>
  );
}

export default ResultCard;
