interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
}

export function EmptyState({ title, description, icon = "bi-inbox" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <span className="mb-4 flex size-16 items-center justify-center rounded-full bg-canvas">
        <i className={`bi ${icon} text-[1.6rem] text-muted-green`} aria-hidden="true" />
      </span>
      <p className="text-base font-bold">{title}</p>
      {description && <p className="mt-1 max-w-[260px] text-[.85rem] text-muted-green">{description}</p>}
    </div>
  );
}

export default EmptyState;
