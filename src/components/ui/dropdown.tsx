"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface DropdownProps {
  trigger: (props: { open: boolean; toggle: () => void; id: string }) => ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  menuClassName?: string;
}

export function Dropdown({ trigger, children, align = "right", menuClassName }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {trigger({ open, toggle: () => setOpen((v) => !v), id })}
      {open && (
        <div
          id={id}
          role="menu"
          className={cn(
            "absolute top-[calc(100%+.5rem)] z-10 w-[220px] animate-fade-in rounded-xl border border-border-light bg-card p-2 shadow-lg",
            align === "right" ? "right-0" : "left-0",
            menuClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
