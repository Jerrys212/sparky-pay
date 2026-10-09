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
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      className="m-0 max-h-none max-w-none bg-transparent p-4"
    >
      <div
        className="mx-auto mt-[12vh] w-full max-w-[440px] animate-modal-in rounded-xxl bg-card p-7 shadow-lg"
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
    </dialog>
  );
}

export default Modal;
