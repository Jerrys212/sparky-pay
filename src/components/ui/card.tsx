import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardProps {
  as?: ElementType;
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Card({ as: Tag = "div", title, subtitle, action, className, children }: CardProps) {
  return (
    <Tag className={cn("relative overflow-hidden rounded-xxl bg-card p-7 shadow-md", className)}>
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            {title && <h2 className="text-[1.1rem]">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-[.8rem] text-muted-green">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </Tag>
  );
}

export default Card;
