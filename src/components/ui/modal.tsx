"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  icon?: string;
  iconClassName?: string;
  children?: ReactNode;
  footer?: ReactNode;
}

export function Modal({ open, onClose, title, description, icon, iconClassName, children, footer }: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[1080] flex animate-fade-in items-center justify-center bg-forest-dark/45 p-4 backdrop-blur-[4px]"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[440px] animate-modal-in rounded-xxl bg-card p-7 shadow-lg"
      >
        {icon && (
          <span className={cn("mb-4 flex size-[52px] items-center justify-center rounded-full text-[1.35rem]", iconClassName)}>
            <i className={cn("bi", icon)} aria-hidden="true" />
          </span>
        )}
        <h2 id={titleId} className="text-[1.15rem]">
          {title}
        </h2>
        {description && <p className="mt-[.35rem] mb-5 text-sm text-muted-green">{description}</p>}
        {children}
        {footer && <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
