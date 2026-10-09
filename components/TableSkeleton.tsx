interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 6, columns = 4 }: TableSkeletonProps) {
  const widths = ["1fr", "1.4fr", "1fr", ".8fr", "1.2fr", "1fr", ".9fr"].slice(0, columns);
  return (
    <div aria-busy="true" aria-label="Cargando transacciones" className="px-5 py-2">
      {Array.from({ length: rows }, (_, r) => (
        <div
          key={r}
          className="grid gap-4 border-b border-text-main/5 py-[.85rem] last:border-b-0"
          style={{ gridTemplateColumns: widths.join(" ") }}
        >
          {widths.map((_, c) => (
            <span key={c} className="shimmer-bar h-3 animate-shimmer rounded-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default TableSkeleton;
