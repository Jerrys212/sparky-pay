import Link from "next/link";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: { homeHref: string; current: string };
  aside?: ReactNode;
}

export function PageHeader({ title, subtitle, breadcrumb, aside }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col flex-wrap items-start justify-between gap-4 md:flex-row md:gap-6">
      <div>
        <h1 className="text-[1.75rem]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-green">{subtitle}</p>}
      </div>
      {breadcrumb && (
        <nav aria-label="Ruta" className="flex items-center text-[.85rem] font-semibold">
          <Link href={breadcrumb.homeHref} className="text-forest-medium hover:text-forest-light hover:underline">
            Inicio
          </Link>
          <span aria-hidden="true" className="px-2 text-divider">
            /
          </span>
          <span aria-current="page" className="text-muted-green">
            {breadcrumb.current}
          </span>
        </nav>
      )}
      {aside}
    </div>
  );
}

export default PageHeader;
